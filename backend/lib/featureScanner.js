import  features  from 'web-features';

class FeatureScanner {
  constructor() {
    this.jsFeatures = [
      'fetch',
      'replaceAll',
      'IntersectionObserver',
      'Intl.RelativeTimeFormat',
      'Promise',
      'async/await',
      'arrow functions',
      'template literals',
      'destructuring',
      'spread operator',
      'Optional chaining',
      'Nullish coalescing'
    ];
    
    this.cssFeatures = [
      'CSS Grid',
      'CSS Subgrid',
      'CSS Flexbox',
      'CSS Custom Properties',
      'CSS Container Queries',
      'CSS Cascade Layers',
      'CSS Nesting',
      'CSS :has() pseudo-class'
    ];
  }

  analyzeCode(code, codeType) {
    const detectedFeatures = [];
    const featuresToCheck = codeType === 'javascript' ? this.jsFeatures : this.cssFeatures;

    featuresToCheck.forEach(feature => {
      const isDetected = this.detectFeature(code, feature, codeType);
      const baselineData = this.getBaselineData(feature);
      
      detectedFeatures.push({
        feature,
        detected: isDetected,
        baseline: baselineData.baseline,
        browserSupport: baselineData.browserSupport
      });
    });

    return this.generateReport(detectedFeatures);
  }

  detectFeature(code, feature, codeType) {
    const patterns = {
      // JavaScript patterns
      'fetch': /\bfetch\s*\(/,
      'replaceAll': /\.replaceAll\s*\(/,
      'IntersectionObserver': /\bnew\s+IntersectionObserver\s*\(/,
      'Intl.RelativeTimeFormat': /\bIntl\.RelativeTimeFormat\b/,
      'Promise': /\bnew\s+Promise\s*\(|\.then\s*\(|\.catch\s*\(/,
      'async/await': /\basync\s+function|\basync\s*\(|\bawait\s+/,
      'arrow functions': /=>\s*{|=>\s*[^{]/,
      'template literals': /`[^`]*\${[^}]*}[^`]*`/,
      'destructuring': /\{\s*[\w,\s]+\}\s*=|\[\s*[\w,\s]+\]\s*=/,
      'spread operator': /\.{3}\w+/,
      'Optional chaining': /\?\./,
      'Nullish coalescing': /\?\?/,
      
      // CSS patterns
      'CSS Grid': /display\s*:\s*grid|grid-template|grid-area/i,
      'CSS Subgrid': /grid-template-[rows|columns]\s*:\s*subgrid/i,
      'CSS Flexbox': /display\s*:\s*flex|flex-direction|justify-content/i,
      'CSS Custom Properties': /--[\w-]+\s*:|var\s*\(/i,
      'CSS Container Queries': /@container/i,
      'CSS Cascade Layers': /@layer/i,
      'CSS Nesting': /&\s*{|&\s*:/i,
      'CSS :has() pseudo-class': /:has\s*\(/i
    };

    const pattern = patterns[feature];
    return pattern ? pattern.test(code) : false;
  }

  getBaselineData(feature) {
    // Map feature names to web-features identifiers
    const featureMapping = {
      'fetch': 'fetch',
      'replaceAll': 'string-replaceall',
      'IntersectionObserver': 'intersectionobserver',
      'Intl.RelativeTimeFormat': 'intl-relativetimeformat',
      'CSS Grid': 'css-grid',
      'CSS Subgrid': 'css-subgrid',
      'CSS Flexbox': 'flexbox',
      'CSS Custom Properties': 'css-variables'
    };

    const featureId = featureMapping[feature];
    const featureData = featureId ? features[featureId] : null;

    if (featureData) {
      return {
        baseline: {
          status: featureData.status?.baseline_high_date ? 'available' : 'limited',
          since: featureData.status?.baseline_high_date || 'Unknown',
          description: featureData.description || 'No description available'
        },
        browserSupport: this.extractBrowserSupport(featureData)
      };
    }

    // Fallback data for features not in web-features
    return {
      baseline: {
        status: 'unknown',
        since: 'Unknown',
        description: 'Feature data not available'
      },
      browserSupport: {
        chrome: 'Unknown',
        firefox: 'Unknown',
        safari: 'Unknown',
        edge: 'Unknown'
      }
    };
  }

  extractBrowserSupport(featureData) {
    const support = featureData.status?.support || {};
    
    return {
      chrome: support.chrome || 'Unknown',
      firefox: support.firefox || 'Unknown', 
      safari: support.safari || 'Unknown',
      edge: support.edge || 'Unknown'
    };
  }

  generateReport(features) {
    const detectedFeatures = features.filter(f => f.detected);
    const baselineCompliant = detectedFeatures.filter(f => f.baseline.status === 'available').length;
    const modernFeatures = detectedFeatures.filter(f => 
      f.baseline.since && new Date(f.baseline.since) > new Date('2020-01-01')
    ).length;

    return {
      features,
      summary: {
        totalFeatures: features.length,
        detectedFeatures: detectedFeatures.length,
        baselineCompliant,
        modernFeatures
      }
    };
  }
}

export default new FeatureScanner();