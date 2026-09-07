import React, { useEffect } from 'react';

export function BottomSheet({ open, onClose, children, title, dark }) {
  const isDark = dark ?? document.body.classList.contains('dark');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', animation: 'fadeIn 0.2s ease' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="relative z-10 w-full max-h-[90vh] rounded-t-[24px] overflow-hidden flex flex-col"
        style={{
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#000000',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div
            className="rounded-full"
            style={{ width: 36, height: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)' }}
          />
        </div>
        {/* Title */}
        {title && (
          <div className="px-5 pb-2 shrink-0">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        {/* Content */}
        <div className="overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}
