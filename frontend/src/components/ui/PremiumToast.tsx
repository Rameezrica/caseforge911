import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface PremiumToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
}

const typeStyles = {
  success: 'border-emerald-500 text-emerald-300',
  error: 'border-rose-500 text-rose-300',
  info: 'border-indigo-500 text-indigo-300',
};

const typeIcons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />,
  error: <XCircle className="w-5 h-5 text-rose-400 mr-2" />,
  info: <Info className="w-5 h-5 text-indigo-400 mr-2" />,
};

const PremiumToast: React.FC<PremiumToastProps> = ({ message, type = 'info', visible, onClose }) => {
  if (!visible) return null;

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      aria-live="polite"
      className={
        `fixed z-50 left-1/2 bottom-8 -translate-x-1/2 transition-all duration-300 max-w-md w-full px-4 flex justify-center pointer-events-none`
      }
    >
      <div
        className={`flex items-center gap-2 shadow-lg rounded-xl border-2 px-5 py-3 font-sans bg-dark-900/95 backdrop-blur-md ${typeStyles[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 pointer-events-auto`}
        style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
        role="status"
      >
        {typeIcons[type]}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-dark-400 hover:text-dark-100 focus:outline-none"
          aria-label="Close notification"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PremiumToast; 