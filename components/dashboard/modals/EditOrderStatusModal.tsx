

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { OrderItem } from '../../../pages/dashboard/PesananDB'; // Assuming OrderItem is exported or define type here

interface EditOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: OrderItem['status'];
  onUpdateStatus: (orderId: string, newStatus: OrderItem['status']) => void;
}

const EditOrderStatusModal: React.FC<EditOrderStatusModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentStatus,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  const statuses: OrderItem['status'][] = ['Berhasil', 'Pending', 'Dibatalkan'];
  const statusDetails = {
    Berhasil: { icon: CheckCircle, color: 'text-green-500', hoverBg: 'hover:bg-green-50' },
    Pending: { icon: AlertCircle, color: 'text-yellow-500', hoverBg: 'hover:bg-yellow-50' },
    Dibatalkan: { icon: XCircle, color: 'text-red-500', hoverBg: 'hover:bg-red-50' },
  };

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="edit-status-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal edit status"
        >
          <X size={24} />
        </button>

        <h2 id="edit-status-modal-title" className="text-xl font-semibold text-hegra-navy mb-2">
          Ubah Status Pesanan
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Untuk Pesanan ID: <span className="font-medium text-hegra-turquoise">{orderId}</span>
        </p>

        <div className="space-y-3">
          {statuses.map((status) => {
            const Icon = statusDetails[status].icon;
            const color = statusDetails[status].color;
            const hoverBg = statusDetails[status].hoverBg;
            const isCurrent = status === currentStatus;

            return (
              <button
                key={status}
                onClick={() => {
                  onUpdateStatus(orderId, status);
                  onClose(); // Close modal after updating
                }}
                className={`w-full flex items-center text-left p-3 border rounded-lg transition-colors
                                  ${isCurrent 
                                    ? `bg-hegra-turquoise/10 border-hegra-turquoise/50 ${color}` 
                                    : `border-gray-300 text-gray-700 ${hoverBg} hover:border-gray-400`}
                                `}
              >
                <Icon size={20} className={`mr-3 ${isCurrent ? color : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isCurrent ? color : 'text-gray-800'}`}>{status}</span>
                {isCurrent && <CheckCircle size={18} className="ml-auto text-green-500" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        @keyframes modalAppear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default EditOrderStatusModal;