
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { EventData } from '../../../HegiraApp';
import { X, Search } from 'lucide-react';

interface MinimalEventCardProps {
  event: EventData;
  onSelect: (event: EventData) => void;
}

const MinimalEventCard: React.FC<MinimalEventCardProps> = ({ event, onSelect }) => {
  const displayPosterUrl = event.coverImageUrl || event.posterUrl || 'https://via.placeholder.com/400x150/E0E0E0/BDBDBD?text=Event';
  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-white rounded-lg border border-gray-200 hover:border-hegra-turquoise cursor-pointer transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(event);}}
      aria-label={`Pilih event ${event.name}`}
    >
      <div className="relative w-full" style={{ paddingTop: '37.5%' /* 16:6 aspect ratio */ }}>
        <img
          src={displayPosterUrl}
          alt={`Poster ${event.name}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x150/f0f0f0/969696?text=Image+Error')}
        />
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-hegra-navy truncate" title={event.name}>{event.name}</h4>
        <p className="text-xs text-gray-500 truncate" title={event.dateDisplay}>{event.dateDisplay}</p>
        <p className="text-xs text-gray-500 truncate" title={event.location}>{event.location}</p>
      </div>
    </div>
  );
};


interface EventSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: EventData) => void;
  events: EventData[];
}

const EventSelectionModal: React.FC<EventSelectionModalProps> = ({ isOpen, onClose, onEventSelect, events }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="event-selection-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-2xl relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h2 id="event-selection-modal-title" className="text-lg font-semibold text-hegra-deep-navy">
            Pilih Event
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hegra-turquoise transition-colors" aria-label="Tutup modal">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau lokasi event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise"
            />
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="flex-grow overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1 custom-scrollbar-modal">
            {filteredEvents.map(event => (
              <MinimalEventCard key={event.id} event={event} onSelect={onEventSelect} />
            ))}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Tidak ada event yang cocok dengan pencarian.
          </div>
        )}
        
         <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Batal
            </button>
        </div>

      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
      `}</style>
    </div>
  );
};

export default EventSelectionModal;
