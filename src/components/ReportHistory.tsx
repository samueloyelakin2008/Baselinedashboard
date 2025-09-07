import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Clock, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';

interface Report {
  _id: string;
  codeType: string;
  summary: {
    totalFeatures: number;
    detectedFeatures: number;
    baselineCompliant: number;
    modernFeatures: number;
  };
  createdAt: string;
}

const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getReports(page, 10, filter === 'all' ? undefined : filter);
      
      if (response.success) {
        setReports(response.reports);
        setTotalPages(response.pagination.pages);
      } else {
        setReports([]);
        if (response.message !== 'Database not configured') {
          setError('Failed to load reports');
        }
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, filter]);

  const handleDelete = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await apiService.deleteReport(reportId);
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError('Failed to delete report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
          </div>
          
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="javascript">JavaScript</option>
            <option value="css">CSS</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600">
            Start analyzing your code to see reports here
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.codeType === 'javascript' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.codeType.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Detected:</span>
                        <span className="ml-1 font-medium">{report.summary.detectedFeatures}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Baseline:</span>
                        <span className="ml-1 font-medium text-green-600">{report.summary.baselineCompliant}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Modern:</span>
                        <span className="ml-1 font-medium text-purple-600">{report.summary.modernFeatures}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <span className="ml-1 font-medium text-blue-600">
                          {report.summary.detectedFeatures > 0 
                            ? Math.round((report.summary.baselineCompliant / report.summary.detectedFeatures) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportHistory;