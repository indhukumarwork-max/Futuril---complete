import React from 'react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-xl shadow-lg max-w-md w-full p-6 text-ink space-y-4">
        {title && (
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <button
              onClick={onClose}
              className="text-ink-secondary hover:text-ink transition-colors p-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
