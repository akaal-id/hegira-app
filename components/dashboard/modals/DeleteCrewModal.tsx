/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  crewMemberName: string;
}

const DeleteCrewModal: React.FC<DeleteCrewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  crewMemberName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[102] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="delete-crew-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal konfirmasi hapus"
        >
          <X size={24} />
        </button>

        <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 sm:h-12 sm:w-12 mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="flex-grow">
                <h2 id="delete-crew-modal-title" className="text-xl font-semibold text-hegra-navy">
                Konfirmasi Hapus Crew
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                Anda yakin ingin menghapus anggota crew <strong className="text-hegra-deep-navy">{crewMemberName}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
            </div>
        </div>


        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors"
          >
            <Trash2 size={18} /> Ya, Hapus Crew
          </button>
          <button
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s ease-out forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default DeleteCrewModal;
