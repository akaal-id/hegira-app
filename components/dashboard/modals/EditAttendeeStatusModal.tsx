
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, CheckCircle, UserX } from 'lucide-react';
import { AttendeeData } from '../../../pages/dashboard/PengunjungDB';

interface EditAttendeeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: AttendeeData;
  onUpdateStatus: (ticketId: string, newStatus: 'Sudah Hadir' | 'Belum Hadir') => void;
}

const EditAttendeeStatusModal: React.FC<EditAttendeeStatusModalProps> = ({
  isOpen,
  onClose,
  attendee,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  const handleSetHadir = () => {
    onUpdateStatus(attendee.ticketId, 'Sudah Hadir');
  };

  const handleSetBelumHadir = () => {
    onUpdateStatus(attendee.ticketId, 'Belum Hadir');
  };

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="edit-attendee-status-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal"
        >
          <X size={24} />
        </button>

        <h2 id="edit-attendee-status-modal-title" className="text-xl font-semibold text-hegra-navy mb-2">
          Ubah Status Kehadiran
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          Pengunjung: <span className="font-medium">{attendee.ownerName}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          ID Tiket: <span className="font-medium text-hegra-turquoise">{attendee.ticketId}</span>
        </p>

        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Status Saat Ini: 
            <span className={`ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${attendee.status === 'Sudah Hadir' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {attendee.status}
            </span>
          </p>

          <button
            onClick={handleSetHadir}
            disabled={attendee.status === 'Sudah Hadir'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} /> Tandai Sudah Hadir
          </button>

          <button
            onClick={handleSetBelumHadir}
            disabled={attendee.status === 'Belum Hadir'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-yellow-500 rounded-lg shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserX size={18} /> Tandai Belum Hadir
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
          >
            Tutup
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

export default EditAttendeeStatusModal;
