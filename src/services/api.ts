import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private async getAuthHeader(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        return { Authorization: `Bearer ${token}` };
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return {};
  }

  async analyzeCode(code: string, codeType: 'javascript' | 'css') {
    const headers = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeader())
    };

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code, codeType })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analysis failed');
    }

    return response.json();
  }

  async getReports(page: number = 1, limit: number = 10, codeType?: string) {
    const headers = await this.getAuthHeader();
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (codeType) {
      params.append('codeType', codeType);
    }

    const response = await fetch(`${API_BASE_URL}/api/reports?${params}`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch reports');
    }

    return response.json();
  }

  async getReport(reportId: string) {
    const headers = await this.getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch report');
    }

    return response.json();
  }

  async deleteReport(reportId: string) {
    const headers = await this.getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete report');
    }

    return response.json();
  }
}

export const apiService = new ApiService();