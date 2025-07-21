
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, QrCode } from 'lucide-react';
import { CrewMember } from '../../../pages/dashboard/ManajemenCrewPageDB';

interface SingleCrewBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  crewMember: CrewMember;
}

const SingleCrewBarcodeModal: React.FC<SingleCrewBarcodeModalProps> = ({ isOpen, onClose, crewMember }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[102] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      aria-labelledby="single-crew-barcode-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal barcode"
        >
          <X size={24} />
        </button>

        <h2 id="single-crew-barcode-modal-title" className="text-lg sm:text-xl font-semibold text-hegra-deep-navy mb-2">
          ID Crew: {crewMember.name}
        </h2>
        <p className="text-sm text-gray-500 mb-1">Role: {crewMember.role}</p>
        <p className="text-xs text-gray-400 mb-6 font-mono">{crewMember.id}</p>
        
        <div className="bg-gray-100 p-4 rounded-lg inline-block border border-gray-200">
          {/* Barcode Placeholder - Using QrCode icon for visual representation */}
          <QrCode size={160} strokeWidth={1.5} className="text-black mx-auto" />
        </div>
        <p className="text-xs text-gray-500 mt-3">Pindai barcode ini untuk check-in.</p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-hegra-turquoise hover:bg-opacity-90 rounded-lg shadow-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default SingleCrewBarcodeModal;
