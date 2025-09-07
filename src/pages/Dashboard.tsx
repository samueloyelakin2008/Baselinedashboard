import React, { useState } from 'react';
import Editor from '../components/Editor';
import Results from '../components/Results';
import ReportHistory from '../components/ReportHistory';
import { apiService } from '../services/api';
import { AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');

  const handleAnalyze = async (code: string, codeType: 'javascript' | 'css') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.analyzeCode(code, codeType);
      setResults(response);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className=" space-x-1 bg-white p-1 rounded-lg border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'analyze'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Analyze Code
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Report History
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'analyze' ? (
          <div className="space-y-8">
            <Editor onAnalyze={handleAnalyze} loading={loading} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">Analysis Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Results results={results} />
          </div>
        ) : (
          <ReportHistory />
        )}
      </div>
    </div>
  );
};

export default Dashboard;