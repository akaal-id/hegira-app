/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { EventData, formatEventTime, formatDisplayDate } from '../../HegiraApp'; 
import { CalendarDays, Clock, MapPin, ArrowRight, Eye } from 'lucide-react'; 
import { AugmentedEventData } from '../../pages/dashboard/EventListPageDB'; // Import augmented type

interface EventCardDBProps {
  eventData: AugmentedEventData; 
  onNavigateToDetail: (event: AugmentedEventData) => void; // Modified prop
}

const EventCardDB: React.FC<EventCardDBProps> = ({
  eventData,
  onNavigateToDetail,
}) => {
  const {
    name,
    coverImageUrl,
    posterUrl,
    status,
    dateDisplay,
    timeDisplay,
    timezone,
    address, 
  } = eventData;

  const statusColors: { [key: string]: { dot: string; text: string } } = {
    Aktif: { dot: 'bg-green-500', text: 'text-green-700' },
    Selesai: { dot: 'bg-blue-500', text: 'text-blue-700' },
    Draf: { dot: 'bg-yellow-500', text: 'text-yellow-700' },
    Default: { dot: 'bg-gray-400', text: 'text-gray-700'}
  };

  const currentStatusStyle = statusColors[status as keyof typeof statusColors] || statusColors.Default;
  const displayPosterUrl = coverImageUrl || posterUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60&text=Event';


  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-hegra-turquoise/30 overflow-hidden transition-all duration-300 group flex flex-col h-full"
      role="article" 
      aria-labelledby={`event-db-title-${eventData.id}`}
    >
      {/* Image Section */}
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '37.5%' /* 16:6 Aspect Ratio */ }}>
        <img
          src={displayPosterUrl}
          alt={`Poster ${name}`}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60&text=ErrorLoadingImage')}
        />
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow"> {/* Standardized padding */}
        {/* Title and Status */}
        <div className="flex justify-between items-center mb-2">
          <h3 
            id={`event-db-title-${eventData.id}`}
            className="text-lg font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 truncate flex-grow mr-2" 
            title={name}
          >
            {name}
          </h3>
          <div className="flex-shrink-0 flex items-center text-xs font-medium whitespace-nowrap">
            <span className={`h-2 w-2 rounded-full mr-1.5 ${currentStatusStyle.dot}`}></span>
            <span className={currentStatusStyle.text}>{status}</span>
          </div>
        </div>

        {/* Details (Date, Time, Location) */}
        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <CalendarDays size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span className="truncate" title={formatDisplayDate(dateDisplay)}>{formatDisplayDate(dateDisplay)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span className="truncate" title={formatEventTime(timeDisplay, timezone)}>{formatEventTime(timeDisplay, timezone)}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span className="truncate" title={address}>{address}</span>
          </div>
        </div>
        
        {/* Detail Event Button */}
        <div className="mt-auto pt-3 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onNavigateToDetail(eventData); // Call with eventData
            }}
            className="text-sm font-semibold text-hegra-turquoise hover:text-hegra-yellow transition-colors duration-200 py-1 group/button inline-flex items-center"
            aria-label={`Lihat event ${name}`}
          >
            <Eye size={16} className="mr-1.5 opacity-70 group-hover/button:opacity-100 transition-opacity" />
            Lihat Event
            <ArrowRight size={16} className="ml-1.5 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 transform group-hover/button:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCardDB;