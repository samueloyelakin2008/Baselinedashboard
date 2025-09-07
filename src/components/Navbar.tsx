import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BarChart3, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Baseline Dashboard
            </h1>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{currentUser.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;