import React, { useState } from 'react';
import { Code, Play, Loader } from 'lucide-react';

interface EditorProps {
  onAnalyze: (code: string, codeType: 'javascript' | 'css') => void;
  loading: boolean;
}

const Editor: React.FC<EditorProps> = ({ onAnalyze, loading }) => {
  const [code, setCode] = useState('');
  const [codeType, setCodeType] = useState<'javascript' | 'css'>('javascript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onAnalyze(code, codeType);
    }
  };

  const sampleCode = {
    javascript: `// Sample modern JavaScript code
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    
    // Optional chaining and nullish coalescing
    const displayName = userData?.profile?.name ?? 'Anonymous';
    
    // String replaceAll method
    const cleanedBio = userData.bio?.replaceAll('\\n', ' ') || '';
    
    return { displayName, cleanedBio };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};

// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
});

// Intl.RelativeTimeFormat for human-readable dates
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
console.log(rtf.format(-1, 'day')); // "yesterday"`,
    css: `/* Sample modern CSS code */
.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  min-height: 100vh;
}

.sidebar {
  grid-column: 1;
  grid-row: 1 / -1;
  background: var(--sidebar-bg, #f8f9fa);
  padding: 1rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* CSS Custom Properties */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --border-radius: 0.5rem;
}

/* Container Queries */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
}

/* Modern pseudo-class */
.form-group:has(input:invalid) {
  border-color: #ef4444;
}

/* CSS Nesting */
.navigation {
  background: white;
  
  & ul {
    list-style: none;
    margin: 0;
    
    & li {
      display: inline-block;
      
      & a:hover {
        color: var(--primary-color);
      }
    }
  }
}`
  };

  const handleLoadSample = () => {
    setCode(sampleCode[codeType]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={codeType}
            onChange={(e) => setCodeType(e.target.value as 'javascript' | 'css')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="javascript">JavaScript</option>
            <option value="css">CSS</option>
          </select>
          
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Load Sample
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Paste your ${codeType === 'javascript' ? 'JavaScript' : 'CSS'} code here...`}
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm bg-gray-50"
          required
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {code.length > 0 && `${code.length.toLocaleString()} characters`}
            {code.length > 45000 && (
              <span className="text-orange-600 ml-2">
                ⚠️ Approaching size limit (50KB)
              </span>
            )}
          </p>
          
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze Code'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;