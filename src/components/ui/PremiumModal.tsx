import React, { useEffect } from 'react';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ open, onClose, title, children, actions }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl max-w-lg w-full p-7 relative flex flex-col font-sans" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
        <h2 className="text-lg font-bold mb-3 text-dark-50">{title}</h2>
        <div className="text-dark-200 mb-6 text-sm">{children}</div>
        <div className="flex justify-end gap-3">{actions}</div>
        <button
          className="absolute top-4 right-4 text-dark-400 hover:text-dark-100 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PremiumModal; 