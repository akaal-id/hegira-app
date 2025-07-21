/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Tag, Edit3, Trash2 } from 'lucide-react';
import { TicketCategory } from '../../HegiraApp'; // Import TicketCategory
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

export interface CouponData {
  id: string;
  name: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  quantity?: number; // Max uses
  resetsDaily?: boolean; // New field
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  minPurchase?: number; // Minimum purchase amount
  applicableTicketIds?: string[]; // New field
}

interface CouponItemCardDBProps {
  coupon: CouponData;
  eventTickets: TicketCategory[]; // New prop
  eventName: string; // Added prop
  onEdit: () => void;
  onDelete: () => void;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    // This handles both "20 Feb 2020" and "YYYY-MM-DD" by letting new Date() parse it
    return new Date(dateString.includes('-') ? dateString + 'T00:00:00' : dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateString; 
  }
};

const CouponItemCardDB: React.FC<CouponItemCardDBProps> = ({ coupon, eventTickets, eventName, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const discountDisplay = coupon.discountType === 'percentage' 
    ? `${coupon.discountValue}%` 
    : formatCurrency(coupon.discountValue);

  const applicableTicketNames = coupon.applicableTicketIds && coupon.applicableTicketIds.length > 0
    ? coupon.applicableTicketIds.map(id => {
        const ticket = eventTickets.find(t => t.id === id);
        return ticket ? ticket.name : `ID: ${id}`; // Fallback if ticket not found
    }).join(', ')
    : 'Semua Tiket';

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
        <div className="p-5 flex flex-col flex-grow">
          
          {/* Title and Action Buttons */}
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center mr-2 flex-grow min-w-0">
              <Tag size={20} className="text-hegra-turquoise mr-2 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-hegra-deep-navy leading-tight truncate" title={coupon.name}>
                {coupon.name}
              </h3>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-1.5">
              <button 
                onClick={onEdit} 
                className="text-blue-500 hover:text-blue-700 p-1"
                aria-label={`Edit kupon ${coupon.name}`}
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={handleDeleteClick} 
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Hapus kupon ${coupon.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* ID and Event Name */}
          <p className="text-xs text-gray-400 font-mono mb-2" title={`ID Kupon: ${coupon.id}`}>ID: {coupon.id}</p>
          <p className="text-xs text-gray-500 mb-4">Event: <span className="font-medium text-gray-600">{eventName}</span></p>


          <div className="space-y-3 text-xs text-gray-600 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Jenis Diskon</span>
              <span className="font-medium">{coupon.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Nilai Diskon</span>
              <span className="font-medium text-hegra-turquoise">{discountDisplay}</span>
            </div>
            {coupon.quantity !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{coupon.resetsDaily ? "Tersedia per Hari" : "Jumlah Tersedia"}</span>
                <span className="font-medium">{coupon.quantity}</span>
              </div>
            )}
            {(coupon.startDate || coupon.endDate) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Validitas</span>
                <span className="font-medium text-right">
                  {formatDate(coupon.startDate)} {coupon.endDate ? `- ${formatDate(coupon.endDate)}` : '(selamanya)'}
                </span>
              </div>
            )}
            {coupon.minPurchase !== undefined && coupon.minPurchase > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Min. Pembelian</span>
                <span className="font-medium">{formatCurrency(coupon.minPurchase)}</span>
              </div>
            )}
            <div className="flex justify-between items-start pt-2 border-t border-gray-100">
              <span className="text-gray-500 pt-0.5">Berlaku untuk</span>
              <span className="font-medium text-right max-w-[60%] truncate" title={applicableTicketNames}>
                  {applicableTicketNames}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline pt-3 mt-4 border-t border-gray-100">
            <span className="text-lg text-hegra-deep-navy">Kode Kupon</span>
            <span className="text-xl font-bold text-hegra-yellow tracking-wider font-sans">{coupon.code}</span>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={coupon.name}
        itemType="Kupon"
      />
    </>
  );
};

export default CouponItemCardDB;