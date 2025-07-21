/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Star, MapPin, Ticket, CalendarDays, Clock, Eye, MoreHorizontal } from 'lucide-react';
import { EventData, PageName, formatEventTime, formatDisplayDate } from '../HegiraApp'; // Renamed import

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

interface EventCardProps extends EventData {
  onNavigate: (page: PageName, data?: any) => void;
}

const EventCard: React.FC<EventCardProps> = (props) => {
  const {
    id,
    category,
    name,
    location,
    dateDisplay, 
    timeDisplay,  
    timezone,
    posterUrl = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    onNavigate,
    ticketCategories,
    summary, // Summary is still passed as a prop, but not rendered here
    organizerName,
    organizerLogoUrl,
  } = props;

  const [isBookmarked, setIsBookmarked] = useState(false);
  // isSummaryExpanded state is removed

  const categoryStyles = {
    B2C: 'bg-hegra-turquoise text-hegra-deep-navy text-xs',
    B2B: 'bg-hegra-navy text-hegra-white text-xs',
    B2G: 'bg-hegra-yellow text-hegra-deep-navy text-xs',
  };

  const handleDetailClick = () => {
    onNavigate('eventDetail', props);
  };

  let finalPriceDisplay: string;
  let finalPriceColorClass = 'text-hegra-yellow';

  const numericPrices = ticketCategories?.map(tc => tc.price).filter(price => typeof price === 'number') as number[] | undefined;

  if (numericPrices && numericPrices.length > 0) {
    const minPrice = Math.min(...numericPrices);
    finalPriceDisplay = formatCurrency(minPrice);
  } else {
    finalPriceDisplay = props.displayPrice; 
    if (!props.displayPrice.toLowerCase().startsWith('rp')) {
      finalPriceColorClass = 'text-hegra-deep-navy'; 
    }
  }


  return (
    <div className="bg-hegra-card-bg rounded-xl border border-hegra-navy/10 hover:border-hegra-turquoise/20 overflow-hidden transition-all duration-300 group flex flex-col event-card h-full">
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '37.5%' /* 6 / 16 = 0.375 */ }}>
        <img 
          src={props.coverImageUrl || posterUrl}
          alt={`Poster ${name}`} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60')}
        />
        <span 
          className={`absolute top-4 left-4 px-3 py-1 font-semibold rounded-full shadow-md ${categoryStyles[category]}`}
        >
          {category}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked);}}
          className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-hegra-yellow hover:bg-white/100 transition-colors duration-200 shadow-md"
          aria-label={isBookmarked ? "Hapus dari Simpanan" : "Simpan Event"}
        >
          <Star size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold font-jakarta text-hegra-deep-navy mb-2 leading-tight group-hover:text-hegra-gradient-start transition-colors truncate">{name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <CalendarDays size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
          <span>{formatDisplayDate(dateDisplay)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
          <span>{formatEventTime(timeDisplay, timezone)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3"> 
          <MapPin size={15} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
          <span>{location}</span>
        </div>
        
        {/* Event summary and expand/collapse button are removed from here */}

        {organizerName && (
          <div className="flex items-center text-sm text-gray-600 mb-4 pt-2 border-t border-gray-100">
            {organizerLogoUrl ? (
              <img src={organizerLogoUrl} alt={organizerName} className="w-6 h-6 rounded-full mr-2 object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-400 text-xs">
                {organizerName.substring(0,1)}
              </div>
            )}
            <span><strong>{organizerName}</strong></span>
          </div>
        )}
        
        <div className="mt-auto"> {/* Pushes content below to the bottom */}
          <div className="flex items-baseline mb-4">
            <p className={`text-2xl font-bold font-jakarta ${finalPriceColorClass}`}>
              {finalPriceDisplay}
            </p>
          </div>

          <button 
            onClick={handleDetailClick}
            className="w-full bg-gradient-to-r from-hegra-turquoise to-hegra-turquoise/80 text-white font-semibold py-3 px-4 rounded-lg
                       transition-all duration-300
                       flex items-center justify-center group/button
                       hover:bg-gradient-to-r hover:from-hegra-turquoise/30 hover:to-hegra-turquoise/40 hover:text-hegra-turquoise"
            aria-label={`Beli tiket untuk event ${name}`}
          >
            <Ticket size={18} className="mr-2 transition-transform duration-300" />
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;