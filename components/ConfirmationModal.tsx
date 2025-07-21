
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  icon?: React.ElementType; // Optional icon component
  iconColorClass?: string; // Optional Tailwind color class for the icon
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  cancelButtonClass = "bg-gray-200 hover:bg-gray-300 text-gray-800",
  icon: IconComponent,
  iconColorClass,
}) => {
  if (!isOpen) return null;

  const FinalIconComponent = IconComponent || AlertTriangle;
  const finalIconColor = iconColorClass || 'text-red-600';
  const iconBgColor = iconColorClass ? (iconColorClass.includes('red') ? 'bg-red-100' : (iconColorClass.includes('yellow') ? 'bg-yellow-100' : (iconColorClass.includes('green') ? 'bg-green-100' : (iconColorClass.includes('blue') ? 'bg-blue-100' : (iconColorClass.includes('turquoise') ? 'bg-hegra-turquoise/10' : 'bg-gray-100'))))) : 'bg-red-100';


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="confirmation-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-hegra-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors"
          aria-label="Tutup modal konfirmasi"
        >
          <X size={24} />
        </button>

        <div className="flex items-start">
          <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${iconBgColor} sm:h-12 sm:w-12 mr-4`}>
            <FinalIconComponent className={`h-6 w-6 ${finalIconColor}`} aria-hidden="true" />
          </div>
          <div className="flex-grow">
            <h2 id="confirmation-modal-title" className="text-xl font-semibold text-hegra-navy">
              {title}
            </h2>
            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            type="button"
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            type="button"
            className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors ${cancelButtonClass}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
      {/* Re-using animation from LoginPage, ensure this style is defined globally or copied if LoginPage is removed/refactored */}
      <style>{`
        @keyframes modal-appear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;