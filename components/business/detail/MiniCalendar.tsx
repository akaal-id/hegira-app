
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { CalendarDays } from 'lucide-react';

interface AvailabilitySlot {
  day: string;
  slots: string[];
}

interface MiniCalendarProps {
  availability?: AvailabilitySlot[];
  companyName: string;
  isMobileContext?: boolean;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ availability, companyName, isMobileContext }) => {
  const today = new Date();
  const currentMonthYear = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 for Sunday, 1 for Monday etc.

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${isMobileContext ? 'text-left' : ''}`}>
      <h4 className={`font-semibold text-hegra-deep-navy mb-1.5 ${isMobileContext ? 'text-sm' : 'text-md'}`}>
        <CalendarDays size={isMobileContext ? 15 : 16} className="inline mr-1.5 mb-0.5" />
        Ketersediaan (Simulasi)
      </h4>
      <div className={`p-2.5 rounded-lg text-xs ${isMobileContext ? 'bg-gray-50/50 border border-gray-200/50' : 'bg-gray-50 border border-gray-200'}`}>
        <p className={`text-center font-medium text-gray-700 ${isMobileContext ? 'text-[11px]' : 'text-xs mb-1.5'}`}>{currentMonthYear}</p>
        
        {!isMobileContext && (
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1">
            {dayNames.map(day => (
              <div key={day} className="font-semibold text-gray-500">{day}</div>
            ))}
          </div>
        )}
        {!isMobileContext && (
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNumber = i + 1;
              const isToday = dayNumber === today.getDate();
              // Simple simulation: mark some days as 'available' (e.g., weekdays)
              const dateObj = new Date(today.getFullYear(), today.getMonth(), dayNumber);
              const dayOfWeek = dateObj.getDay(); // 0 (Sun) to 6 (Sat)
              const isPotentiallyAvailable = dayOfWeek !== 0 && dayOfWeek !== 6; // Weekdays

              return (
                <div 
                  key={dayNumber} 
                  className={`p-0.5 rounded-full aspect-square flex items-center justify-center
                              ${isToday ? 'bg-hegra-turquoise text-white font-bold' : 
                               isPotentiallyAvailable ? 'bg-green-100 text-green-700' : 'text-gray-500 bg-gray-100'}`}
                  title={isPotentiallyAvailable ? "Potensi tersedia" : ""}
                >
                  {dayNumber}
                </div>
              );
            })}
          </div>
        )}
        <p className={`text-[10px] text-gray-500 mt-1.5 ${isMobileContext ? '' : 'text-center'}`}>
          Jadwal aktual akan dikonfirmasi oleh {companyName} setelah Anda mengajukan permintaan meeting.
        </p>
      </div>
    </div>
  );
};

export default MiniCalendar;
