import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ServerStatusProps {
  isOnline: boolean;
  onRetry?: () => void;
  className?: string;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ 
  isOnline, 
  onRetry, 
  className = "" 
}) => {
  if (isOnline) {
    return null;
  }

  return (
    <div className={`bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <p className="text-yellow-200 font-medium">Server Offline</p>
            <p className="text-yellow-300 text-sm">
              Using cached data. Some features may be limited.
            </p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center px-3 py-1.5 bg-yellow-600 text-yellow-100 rounded-md hover:bg-yellow-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ServerStatus;