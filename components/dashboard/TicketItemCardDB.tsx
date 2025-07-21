/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { TicketCategoryWithEventInfo, formatEventTime, formatDisplayDate } from '../../HegiraApp';
import { Edit3, Trash2, AlertTriangle, Globe, Ticket as TicketIcon } from 'lucide-react';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

interface TicketItemCardDBProps {
  ticket: TicketCategoryWithEventInfo;
  onEdit: () => void;
  onDelete: () => void;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const TicketItemCardDB: React.FC<TicketItemCardDBProps> = ({ ticket, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isPaid = ticket.price !== undefined && ticket.price > 0;
  const ticketType = isPaid ? 'Berbayar' : 'Gratis';
  const ticketTypeStyle = isPaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  
  const ticketsPurchased = ticket.ticketsPurchased === undefined ? 0 : ticket.ticketsPurchased;
  const maxQuantity = ticket.maxQuantity; // This is now a required number > 0

  let derivedStatusText = 'N/A';
  let derivedStatusColor = 'text-gray-500';

  const remainingTickets = maxQuantity - ticketsPurchased;

  if (maxQuantity <= 0) { // Should not happen if maxQuantity is always > 0
    derivedStatusText = 'Tidak Valid';
    derivedStatusColor = 'text-gray-500';
  } else if (remainingTickets <= 0) {
    derivedStatusText = 'Habis';
    derivedStatusColor = 'text-red-600';
  } else if (remainingTickets <= 0.1 * maxQuantity) {
    derivedStatusText = 'Hampir Habis';
    derivedStatusColor = 'text-yellow-600';
  } else {
    derivedStatusText = 'Tersedia';
    derivedStatusColor = 'text-green-600';
  }


  const useEventSched = ticket.useEventSchedule === undefined ? true : ticket.useEventSchedule;

  let dateStringToFormat = ticket.eventDateDisplay;
  if (!useEventSched && ticket.ticketStartDate) {
      // ticket.ticketStartDate and ticket.ticketEndDate are YYYY-MM-DD.
      // formatDisplayDate expects YYYY/MM/DD, so we replace hyphens.
      const startDate = ticket.ticketStartDate.replace(/-/g, '/');
      if (ticket.ticketEndDate && ticket.ticketEndDate !== ticket.ticketStartDate) {
          const endDate = ticket.ticketEndDate.replace(/-/g, '/');
          dateStringToFormat = `${startDate} - ${endDate}`;
      } else {
          dateStringToFormat = startDate;
      }
  }
  const displayTicketDate = formatDisplayDate(dateStringToFormat);

  let ticketTimeDisplayValue = ticket.eventTimeDisplay; 
  let ticketTzValue = ticket.eventTimezone;

  if (!useEventSched && ticket.ticketStartTime) {
    ticketTimeDisplayValue = ticket.ticketStartTime;
    if (ticket.ticketIsTimeRange && ticket.ticketEndTime) {
      ticketTimeDisplayValue += ` - ${ticket.ticketEndTime}`;
    } else if (!ticket.ticketIsTimeRange) {
      ticketTimeDisplayValue += ` - Selesai`;
    }
    ticketTzValue = ticket.ticketTimezone || ticket.eventTimezone;
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center mr-2 flex-grow min-w-0">
              <TicketIcon size={20} className="text-green-600 mr-2 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 truncate leading-tight">
                {ticket.name}
              </h3>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-2">
              <button 
                onClick={onEdit} 
                className="text-blue-500 hover:text-blue-700 p-1"
                aria-label={`Edit tiket ${ticket.name}`}
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={handleDeleteClick} 
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Hapus tiket ${ticket.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 font-mono mb-2" title={`ID Tiket: ${ticket.id}`}>ID: {ticket.id}</p>

          {ticket.categoryLabel && (
            <p className="text-xs font-semibold text-hegra-turquoise mb-2">{ticket.categoryLabel}</p>
          )}
          
          <p className="text-xs text-gray-500 mb-3">Event: <span className="font-medium text-gray-600">{ticket.eventName}</span></p>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tipe Tiket</span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ticketTypeStyle}`}>
                {ticketType}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tiket Dibeli</span>
              <span>{ticketsPurchased}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Jumlah Tersedia</span>
              <span>{ticket.maxQuantity !== undefined ? ticket.maxQuantity : 'Tidak Terbatas'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ketersediaan</span>
              <span className={`text-xs ${derivedStatusColor}`}>
                {derivedStatusText}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-100 mt-auto bg-gray-50/50">
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center">
              <Globe size={14} className="mr-1.5 text-gray-400 flex-shrink-0"/>
              <span className="text-gray-500">Jadwal Berlaku: {useEventSched ? 'Mengikuti Jadwal Event' : 'Jadwal Khusus'}</span>
            </div>
            {!useEventSched && (
              <div className="pl-5 text-gray-600">
                <p>Tgl: {displayTicketDate}</p>
                <p>Waktu: {formatEventTime(ticketTimeDisplayValue, ticketTzValue)}</p>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-md font-semibold text-hegra-deep-navy">Harga</span>
            <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(ticket.price)}</span>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={ticket.name}
        itemType="Tiket"
      />
    </>
  );
};

export default TicketItemCardDB;