import React, { useEffect } from 'react';

export function Snackbar({ message, open, onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-[100] px-5 py-3 rounded-[16px] text-sm font-medium text-white shadow-lg"
      style={{
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(30,30,30,0.92)',
        maxWidth: 'calc(100% - 40px)',
        animation: 'slideUp 0.25s ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      {message}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
