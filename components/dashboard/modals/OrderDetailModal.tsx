/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, ShoppingCart, CalendarDays, Clock, MapPin, User, Mail, Phone, Tag, Ticket as TicketIcon, Users as UsersIcon, Info, Eye } from 'lucide-react';
import { OrderItem } from '../../../pages/dashboard/PesananDB'; // Ensure OrderItem is exported
import { EventData, PageName, TransactionData, formatEventTime, formatDisplayDate } from '../../../HegiraApp';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem;
  fullEventData: EventData | null; // Added prop
  onNavigate: (page: PageName, data?: any) => void; // Added prop
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';
const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const DetailItem: React.FC<{ label: string; value?: string | number; icon?: React.ElementType; className?: string }> = ({ label, value, icon: Icon, className }) => (
  <div className={`flex items-start ${className}`}>
    {Icon && <Icon size={14} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />}
    <span className="text-xs text-gray-500 w-28 sm:w-32 flex-shrink-0">{label}:</span>
    <span className="text-xs text-hegra-deep-navy font-medium break-words flex-grow">{value || '-'}</span>
  </div>
);

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, fullEventData, onNavigate }) => {
  if (!isOpen) return null;

  const statusText = { Berhasil: 'Pembayaran Berhasil', Pending: 'Menunggu Pembayaran', Dibatalkan: 'Pesanan Dibatalkan' };
  const statusColor = { Berhasil: 'text-green-600 bg-green-100', Pending: 'text-yellow-600 bg-yellow-100', Dibatalkan: 'text-red-600 bg-red-100' };
  
  const handleViewTickets = () => {
    if (!fullEventData) {
        alert("Data event tidak lengkap untuk menampilkan tiket.");
        return;
    }
    const transactionForDisplay: TransactionData = {
      checkoutInfo: {
        event: fullEventData, // Use the full event data
        selectedTickets: order.tickets.map(t => ({
            categoryId: t.categoryId,
            categoryName: t.categoryName,
            quantity: t.quantity,
            pricePerTicket: t.pricePerTicket,
        })),
        totalPrice: order.totalPrice,
      },
      formData: {
        fullName: order.booker.fullName,
        email: order.booker.email,
        phoneNumber: order.booker.phoneNumber,
        gender: order.booker.gender,
        dateOfBirth: order.booker.dateOfBirth,
        additionalTicketHolders: order.additionalTicketHolders,
      },
      transactionId: order.transactionId,
      orderId: order.id,
    };
    onNavigate('ticketDisplay', transactionForDisplay);
    onClose(); // Close modal after initiating navigation
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-hegra-navy p-5 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xl lg:max-w-2xl relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 id="order-detail-modal-title" className="text-lg sm:text-xl font-semibold text-hegra-deep-navy flex items-center">
            <ShoppingCart size={22} className="mr-2.5 text-hegra-turquoise" /> Detail Pesanan #{order.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hegra-turquoise transition-colors" aria-label="Tutup modal">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar-modal flex-grow pr-1">
          {/* Transaction and Order Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <DetailItem label="ID Transaksi" value={order.transactionId} icon={Info} className="font-mono"/>
              <DetailItem label="Status Pesanan" value={statusText[order.status]} className={`font-semibold ${statusColor[order.status]} px-2 py-0.5 rounded-full inline-block mt-0.5`} />
              <DetailItem label="Tanggal Pesan" value={formatTimestamp(order.orderTimestamp)} icon={CalendarDays}/>
          </div>
          
          {/* Event Details */}
          <section className="mb-4">
            <h3 className="text-md font-semibold text-hegra-navy mb-2">Detail Event</h3>
            <div className="space-y-1.5 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-md font-medium text-blue-700">{order.eventName}</p>
              <DetailItem label="Tanggal" value={formatDisplayDate(order.eventDateDisplay)} icon={CalendarDays} />
              <DetailItem label="Waktu" value={formatEventTime(order.eventTimeDisplay, order.eventTimezone)} icon={Clock} />
              <DetailItem label="Lokasi" value={order.eventLocation} icon={MapPin} />
            </div>
          </section>

          {/* Booker Details */}
          <section className="mb-4">
            <h3 className="text-md font-semibold text-hegra-navy mb-2">Detail Pemesan</h3>
            <div className="space-y-1.5 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <DetailItem label="Nama Lengkap" value={order.booker.fullName} icon={User}/>
              <DetailItem label="Email" value={order.booker.email} icon={Mail}/>
              <DetailItem label="No. Telepon" value={order.booker.phoneNumber} icon={Phone}/>
              {order.booker.gender && <DetailItem label="Jenis Kelamin" value={order.booker.gender} icon={UsersIcon}/>}
              {order.booker.dateOfBirth && <DetailItem label="Tgl. Lahir" value={formatDate(order.booker.dateOfBirth)} icon={CalendarDays}/>}
            </div>
          </section>

          {/* Ticket Details */}
          <section className="mb-4">
            <h3 className="text-md font-semibold text-hegra-navy mb-2">Rincian Tiket</h3>
            <div className="space-y-2">
              {order.tickets.map((ticket, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">{ticket.categoryName} (x{ticket.quantity})</p>
                  <DetailItem label="Harga/tiket" value={formatCurrency(ticket.pricePerTicket)} icon={TicketIcon}/>
                  <DetailItem label="Subtotal" value={formatCurrency(ticket.quantity * ticket.pricePerTicket)} className="font-semibold"/>
                </div>
              ))}
            </div>
          </section>

          {/* Coupon and Total */}
          {(order.coupon || order.originalPrice !== order.totalPrice) && (
            <section className="mb-4">
              <h3 className="text-md font-semibold text-hegra-navy mb-2">Diskon & Total</h3>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 space-y-1.5">
                <DetailItem label="Subtotal Asli" value={formatCurrency(order.originalPrice)} />
                {order.coupon && (
                  <>
                    <DetailItem label="Kupon Digunakan" value={`${order.coupon.name} (${order.coupon.code})`} icon={Tag}/>
                    <DetailItem label="Diskon Kupon" value={`- ${formatCurrency(order.coupon.discountAmount)}`} />
                  </>
                )}
              </div>
            </section>
          )}
           <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-md font-bold text-hegra-deep-navy">Total Pembayaran</span>
                <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(order.totalPrice)}</span>
            </div>


          {/* Additional Ticket Holders */}
          {order.additionalTicketHolders && order.additionalTicketHolders.length > 0 && (
            <section className="mt-4 pt-4 border-t">
              <h3 className="text-md font-semibold text-hegra-navy mb-2">Data Pemegang Tiket Tambahan</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar-modal pr-1">
                {order.additionalTicketHolders.map((holder, index) => (
                  <div key={index} className="p-2.5 bg-purple-50 rounded-lg border border-purple-200 text-xs">
                    <p className="font-medium text-purple-700">Tiket {index + 1}</p>
                    <DetailItem label="Nama" value={holder.fullName} icon={User}/>
                    <DetailItem label="WhatsApp" value={holder.whatsAppNumber} icon={Phone}/>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto justify-center inline-flex items-center px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
          >
            Tutup
          </button>
          {order.tickets && order.tickets.length > 0 && fullEventData && (
             <button
                onClick={handleViewTickets}
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-hegra-turquoise hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow transition-colors"
             >
                <Eye size={16} /> Lihat Tiket Pesanan Ini
             </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;