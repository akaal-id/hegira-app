/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Briefcase, Send, Info } from 'lucide-react';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onSchedule: (details: {
    vendorName: string;
    date: Date;
    timeSlot: string;
    duration: string;
    type: string;
    agenda: string;
  }) => void;
}

const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  onSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00');
  const [meetingDuration, setMeetingDuration] = useState<string>('30 menit');
  const [meetingType, setMeetingType] = useState<string>('Online (Google Meet)');
  const [agenda, setAgenda] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot || !agenda.trim()) {
      alert('Harap lengkapi tanggal, slot waktu, dan agenda meeting.');
      return;
    }
    onSchedule({
      vendorName,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      duration: meetingDuration,
      type: meetingType,
      agenda,
    });
  };

  // Mock time slots and dates
  const availableTimeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const meetingDurations = ['30 menit', '45 menit', '1 jam', '1 jam 30 menit'];
  const meetingTypes = ['Online (Google Meet)', 'Online (Zoom)', 'Telepon', 'Offline (Kantor Vendor)', 'Offline (Lokasi Netral)'];
  
  // Generate dates for the next 7 days
  const today = new Date();
  const availableDates: { value: string; label: string }[] = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  });


  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="meeting-scheduler-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-deep-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal jadwal meeting"
        >
          <X size={24} />
        </button>

        <h2 id="meeting-scheduler-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-2 flex items-center">
          <Calendar size={24} className="mr-3 text-hegra-turquoise" />
          Jadwalkan Meeting Dengan
        </h2>
        <p className="text-lg font-medium text-hegra-turquoise mb-6">{vendorName}</p>
        
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto custom-scrollbar-modal pr-1 flex-grow">
          <div>
            <label htmlFor="meetingDate" className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
            <select
              id="meetingDate"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value + 'T00:00:00'))} // Ensure correct date object parsing
              className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm appearance-none"
            >
              {availableDates.map(date => (
                <option key={date.value} value={date.value}>{date.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">Slot Waktu Tersedia (WIB)</label>
            <select
              id="timeSlot"
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm appearance-none"
            >
              {availableTimeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Slot waktu adalah simulasi.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meetingDuration" className="block text-sm font-medium text-gray-700 mb-1">Durasi Meeting</label>
              <select id="meetingDuration" value={meetingDuration} onChange={(e) => setMeetingDuration(e.target.value)} className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm appearance-none">
                {meetingDurations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 mb-1">Tipe Meeting</label>
              <select id="meetingType" value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm appearance-none">
                {meetingTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">Agenda Singkat <span className="text-red-500">*</span></label>
            <textarea
              id="agenda"
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              required
              className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm placeholder-gray-400"
              placeholder="Contoh: Diskusi potensi kerjasama proyek X, Presentasi produk Y..."
            />
          </div>
          <div className="p-3 bg-blue-50 border-l-4 border-hegra-turquoise rounded-md text-xs text-blue-700">
            <Info size={16} className="inline mr-1.5 mb-0.5"/>
            Tim <span className="font-semibold">{vendorName}</span> akan menerima notifikasi dan mengkonfirmasi ketersediaan jadwal Anda.
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="submit"
            form="meeting-form" // Point to the form id if needed, or trigger via handleSubmit call
            onClick={handleSubmit} // Can also be directly on the button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-yellow text-hegra-navy text-sm font-bold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-navy transition-colors"
          >
            <Send size={16} /> Kirim Permintaan Meeting
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s ease-out forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
};

export default MeetingSchedulerModal;