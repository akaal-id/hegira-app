
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { EventData, formatEventTime } from '../../HegiraApp';
import { CalendarDays, Clock, MapPin, Eye } from 'lucide-react';

interface EventSelectorCardDBProps {
  eventData: EventData;
  onSelectEvent: (event: EventData) => void;
}

const EventSelectorCardDB: React.FC<EventSelectorCardDBProps> = ({ eventData, onSelectEvent }) => {
  const {
    name,
    coverImageUrl,
    posterUrl,
    dateDisplay,
    timeDisplay,
    timezone,
    location,
  } = eventData;

  const displayPosterUrl = coverImageUrl || posterUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60&text=Event';

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-hegra-turquoise/40 overflow-hidden transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={() => onSelectEvent(eventData)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectEvent(eventData); }}
      aria-labelledby={`event-selector-title-${eventData.id}`}
    >
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '37.5%' /* 16:6 Aspect Ratio */ }}>
        <img
          src={displayPosterUrl}
          alt={`Poster ${name}`}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x150/f0f0f0/969696?text=ErrorLoadingImage')}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3
          id={`event-selector-title-${eventData.id}`}
          className="text-md font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 mb-2 truncate"
          title={name}
        >
          {name}
        </h3>

        <div className="space-y-1 text-xs text-gray-500 mb-3 flex-grow">
          <div className="flex items-center">
            <CalendarDays size={13} className="mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={dateDisplay}>{dateDisplay}</span>
          </div>
          <div className="flex items-center">
            <Clock size={13} className="mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={formatEventTime(timeDisplay, timezone)}>{formatEventTime(timeDisplay, timezone)}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={13} className="mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={location}>{location}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click if button is distinct
            onSelectEvent(eventData);
          }}
          className="mt-auto w-full bg-hegra-turquoise/10 text-hegra-turquoise font-semibold py-2 px-3 rounded-md
                     hover:bg-hegra-turquoise/20 transition-colors duration-200
                     flex items-center justify-center text-sm gap-1.5"
          aria-label={`Lihat tiket dan kupon untuk event ${name}`}
        >
          <Eye size={15} /> Lihat Tiket & Kupon
        </button>
      </div>
    </div>
  );
};

export default EventSelectorCardDB;
