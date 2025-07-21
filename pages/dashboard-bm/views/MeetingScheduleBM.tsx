/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { CalendarClock, PlusCircle, ChevronLeft, ChevronRight, UserCircle, Video, MapPin, Phone } from 'lucide-react';

interface MeetingItem {
  id: string;
  title: string; // e.g., "Meeting dengan PT XYZ"
  withCompany: string;
  contactPerson: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string; // e.g., "1 jam"
  type: 'Online (Google Meet)' | 'Online (Zoom)' | 'Telepon' | 'Offline';
  locationOrLink?: string;
  status: 'Terjadwal' | 'Selesai' | 'Dibatalkan';
}

// Sample Data
const sampleMeetings: MeetingItem[] = [
  { id: 'meet001', title: 'Diskusi Kolaborasi Proyek ABC', withCompany: 'PT Inovasi Digital', contactPerson: 'Bapak Andi', date: '2024-08-05', time: '10:00', duration: '1 jam', type: 'Online (Google Meet)', locationOrLink: 'https://meet.google.com/xyz-abc', status: 'Terjadwal' },
  { id: 'meet002', title: 'Follow-up Proposal Event', withCompany: 'CV Kreatif Jaya', contactPerson: 'Ibu Sarah', date: '2024-08-07', time: '14:00', duration: '45 menit', type: 'Telepon', locationOrLink: '+628123456789', status: 'Terjadwal' },
  { id: 'meet003', title: 'Presentasi Layanan IT', withCompany: 'Startup Cepat Maju', contactPerson: 'Mas Rian', date: '2024-07-20', time: '11:00', duration: '1 jam 30 menit', type: 'Offline', locationOrLink: 'Kantor Startup Cepat Maju, Lt. 5', status: 'Selesai' },
];

const MeetingScheduleBM: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingItem[]>(sampleMeetings);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list'); // Calendar view is a placeholder
  // Further state for selected date (for calendar), filters, etc.

  const handleAddNewMeeting = () => alert("Fungsi tambah meeting baru belum diimplementasikan.");

  const statusColors: Record<MeetingItem['status'], string> = {
    'Terjadwal': 'bg-blue-100 text-blue-700',
    'Selesai': 'bg-green-100 text-green-700',
    'Dibatalkan': 'bg-red-100 text-red-700',
  };
  const typeIcons: Record<MeetingItem['type'], React.ElementType> = {
    'Online (Google Meet)': Video,
    'Online (Zoom)': Video,
    'Telepon': Phone,
    'Offline': MapPin,
  };

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Jadwal Meeting Anda</h1>
        <button
          onClick={handleAddNewMeeting}
          className="bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm mt-3 sm:mt-0"
        >
          <PlusCircle size={18} /> Tambah Jadwal Meeting
        </button>
      </div>

      {/* View Mode Toggle (Placeholder) */}
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs rounded-l-md border ${viewMode === 'list' ? 'bg-hegra-turquoise text-white border-hegra-turquoise z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Daftar</button>
          <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 text-xs rounded-r-md border -ml-px ${viewMode === 'calendar' ? 'bg-hegra-turquoise text-white border-hegra-turquoise z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Kalender (Segera)</button>
        </div>
      </div>

      {viewMode === 'list' && (
        meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map(meeting => {
                const MeetingIcon = typeIcons[meeting.type];
                return (
                <div key={meeting.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-grow">
                            <div className="flex items-center mb-1">
                                <MeetingIcon size={16} className="text-hegra-turquoise mr-2 flex-shrink-0" />
                                <h3 className="text-md font-semibold text-hegra-deep-navy truncate" title={meeting.title}>{meeting.title}</h3>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center mb-0.5"><UserCircle size={13} className="mr-1.5"/> Dengan: <span className="font-medium text-gray-700 ml-1">{meeting.contactPerson} ({meeting.withCompany})</span></p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <CalendarClock size={13} className="mr-1.5"/> 
                                {new Date(meeting.date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}, {meeting.time} ({meeting.duration})
                            </p>
                            {meeting.locationOrLink && <p className="text-xs text-gray-500 mt-0.5 truncate" title={meeting.locationOrLink}>Lokasi/Link: {meeting.locationOrLink}</p>}
                        </div>
                        <div className="flex-shrink-0 mt-2 sm:mt-0 text-right">
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColors[meeting.status]}`}>{meeting.status}</span>
                            {/* Edit/Cancel buttons could go here */}
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CalendarClock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada jadwal meeting.</p>
          </div>
        )
      )}

      {viewMode === 'calendar' && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <CalendarClock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Tampilan kalender akan segera tersedia.</p>
        </div>
      )}
       {/* Pagination would go here if many meetings */}
    </div>
  );
};

export default MeetingScheduleBM;