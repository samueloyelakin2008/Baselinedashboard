import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Chrome, Globe, Info } from 'lucide-react';

interface Feature {
  feature: string;
  detected: boolean;
  baseline: {
    status: string;
    since: string;
    description: string;
  };
  browserSupport: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
  };
}

interface ResultsProps {
  results: {
    analysis: {
      features: Feature[];
      summary: {
        totalFeatures: number;
        detectedFeatures: number;
        baselineCompliant: number;
        modernFeatures: number;
      };
    };
    timestamp: string;
  } | null;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  if (!results) return null;

  const { features, summary } = results.analysis;
  const detectedFeatures = features.filter(f => f.detected);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'limited':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      limited: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      unknown: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return styles[status as keyof typeof styles] || styles.unknown;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{summary.detectedFeatures}</div>
          <div className="text-sm text-gray-600">Features Detected</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{summary.baselineCompliant}</div>
          <div className="text-sm text-gray-600">Baseline Compliant</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{summary.modernFeatures}</div>
          <div className="text-sm text-gray-600">Modern Features</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {summary.detectedFeatures > 0 ? Math.round((summary.baselineCompliant / summary.detectedFeatures) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Compatibility</div>
        </div>
      </div>

      {/* Detected Features */}
      {detectedFeatures.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span>Detected Features ({detectedFeatures.length})</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {detectedFeatures.map((feature, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(feature.baseline.status)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.feature}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.baseline.description}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(feature.baseline.status)}`}>
                    {feature.baseline.status.charAt(0).toUpperCase() + feature.baseline.status.slice(1)}
                  </span>
                </div>

                {/* Browser Support */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Chrome className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Browser Support</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Chrome:</span>
                      <span className="font-medium">{feature.browserSupport.chrome}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Firefox:</span>
                      <span className="font-medium">{feature.browserSupport.firefox}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Safari:</span>
                      <span className="font-medium">{feature.browserSupport.safari}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Edge:</span>
                      <span className="font-medium">{feature.browserSupport.edge}</span>
                    </div>
                  </div>
                  {feature.baseline.since && feature.baseline.since !== 'Unknown' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center space-x-2 text-xs text-gray-600">
                      <Info className="h-3 w-3" />
                      <span>Baseline since: {feature.baseline.since}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Detected Features (Summary) */}
      {features.filter(f => !f.detected).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Features Not Detected ({features.filter(f => !f.detected).length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {features.filter(f => !f.detected).map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
              >
                {feature.feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Analysis completed at {new Date(results.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Results;