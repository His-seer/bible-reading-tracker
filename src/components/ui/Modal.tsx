import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  closeButton = true,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${maxWidthStyles[maxWidth]} w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closeButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            {title && <h2 className="text-xl font-bold text-neutral-900">{title}</h2>}
            {!title && <div />}
            {closeButton && (
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-fast p-1 rounded-base"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
