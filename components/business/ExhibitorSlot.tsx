/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { MapPin, CalendarDays, Clock, Building2 } from 'lucide-react';

export interface ExhibitorSlotData {
  id: string;
  name: string; // e.g., "Row 1A", "Row 2B"
  location: string;
  size: string;
  price: number;
  isAvailable: boolean;
  features?: string[];
  eventDate?: string;
  eventTime?: string;
}

interface ExhibitorSlotProps extends ExhibitorSlotData {
  onSelect: (slotId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const ExhibitorSlot: React.FC<ExhibitorSlotProps> = ({
  id,
  name,
  location,
  size,
  price,
  isAvailable,
  features = [],
  eventDate,
  eventTime,
  onSelect
}) => {
  const handleSelect = () => {
    if (isAvailable) {
      onSelect(id);
    }
  };

  return (
    <div className={`bg-white rounded-lg border transition-all duration-300 ${
      isAvailable 
        ? 'border-hegra-navy/10 hover:border-hegra-turquoise/40 hover:shadow-lg' 
        : 'border-gray-200 bg-gray-50 opacity-60'
    } overflow-hidden flex flex-col h-full`}>
      
      {/* Header with slot name and availability */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-jakarta font-semibold text-hegra-navy">{name}</h3>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            isAvailable 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <MapPin size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Building2 size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
          <span>Size: {size}</span>
        </div>
      </div>

      {/* Event details if available */}
      {(eventDate || eventTime) && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {eventDate && (
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <CalendarDays size={13} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
              <span>{eventDate}</span>
            </div>
          )}
          {eventTime && (
            <div className="flex items-center text-xs text-gray-600">
              <Clock size={13} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
              <span>{eventTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {features.map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-hegra-turquoise/10 text-hegra-turquoise font-medium px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer with price and action */}
      <div className="p-4 mt-auto">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">Price</span>
          <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(price)}</span>
        </div>
        
        <button
          onClick={handleSelect}
          disabled={!isAvailable}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
            isAvailable
              ? 'bg-hegra-turquoise text-white hover:bg-hegra-turquoise/80 hover:shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={`Select exhibitor slot ${name}`}
        >
          {isAvailable ? 'Select Exhibitor Slot' : 'Slot Booked'}
        </button>
      </div>
    </div>
  );
};

export default ExhibitorSlot;
