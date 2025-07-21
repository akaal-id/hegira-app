/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { EventData, TransactionFormData, formatEventTime } from '../HegiraApp';
import Logo from './Logo'; // Assuming Logo can accept className for sizing
import { QrCode, CalendarDays, Clock, MapPin, User, Mail, Phone, Ticket as TicketIcon, Info as InfoIconLucide } from 'lucide-react'; // Renamed Info to InfoIconLucide to avoid conflict

interface PrintableTicketProps {
  ticketNumber: string;
  categoryName: string;
  holderName: string;
  holderWhatsApp: string; 
  event: EventData;
  orderId: string;
  transactionId: string;
  qrCodeValue: string;
  bookerData: Omit<TransactionFormData, 'additionalTicketHolders'>;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatDateFull = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    // Handles "YYYY/MM/DD" or "YYYY/MM/DD - YYYY/MM/DD"
    const parts = dateString.split(' - ');
    const formatDatePart = (part: string) => {
        const dateParts = part.split('/');
        if (dateParts.length === 3) {
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
            const day = parseInt(dateParts[2], 10);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return new Date(year, month, day).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        }
        return part; // Fallback for unparseable part
    };

    if (parts.length === 1) {
        return formatDatePart(parts[0]);
    } else if (parts.length === 2) {
        return `${formatDatePart(parts[0])} - ${formatDatePart(parts[1])}`;
    }
    return dateString; // Fallback for unexpected format
};

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | null; isLink?: boolean; href?: string }> = ({ icon: Icon, label, value, isLink, href }) => {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    
    const content = isLink && href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4b998e', textDecoration: 'underline' }}>{String(value)}</a>
    ) : (
      String(value)
    );

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5mm', fontSize: '9pt' }}>
        <div style={{ marginRight: '2mm', flexShrink: 0, width: '4.5mm', display: 'flex', justifyContent: 'center', paddingTop: '0.5mm' }}>
          <Icon size={13} style={{ color: '#4B5563' }} />
        </div>
        <div style={{ minWidth: '25mm', marginRight: '1mm', fontWeight: 500, color: '#374151', flexShrink: 0 }}>{label}</div>
        <div style={{ flexGrow: 1, wordBreak: 'break-word', overflowWrap: 'break-word', color: '#18093B', textAlign: 'left' }}>
          {content}
        </div>
      </div>
    );
};


const PrintableTicket: React.FC<PrintableTicketProps> = ({
  ticketNumber,
  categoryName,
  holderName,
  event,
  orderId,
  transactionId,
  qrCodeValue,
  bookerData,
}) => {
  const ticketCategoryDetails = event.ticketCategories.find(cat => cat.name === categoryName);
  const priceDisplay = ticketCategoryDetails ? formatCurrency(ticketCategoryDetails.price) : 'N/A';
  const eventPoster = event.coverImageUrl || event.posterUrl || 'https://via.placeholder.com/400x200/CCCCCC/FFFFFF?text=Event+Image';
  const logoText = event.name.substring(0, 2).toUpperCase() || "EV";

  return (
    <div 
      className="printable-ticket-a4" // This class is used as a selector in TicketDisplayPage for html2canvas
      style={{ 
        width: '210mm', 
        height: '297mm',
        padding: '8mm', // Reduced padding
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        backgroundColor: 'white',
        color: '#18093b', 
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '6mm', marginBottom: '6mm', borderBottom: '0.5px solid #e5e7eb' }}>
        <div>
          <Logo className="h-14 w-auto" /> 
          <p style={{ fontSize: '9pt', color: '#4b5563', marginTop: '1.5mm' }}>Tiket Resmi Diterbitkan oleh Hegira</p>
        </div>
        <div style={{ textAlign: 'right', maxWidth: '60%' }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 'bold', lineHeight: 1.2, color: '#18093b', marginBottom: '1mm' }}>{event.name}</h1>
          {event.summary && <p style={{ fontSize: '9pt', color: '#4b5563', wordBreak: 'break-word' }}>{event.summary}</p>}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', marginBottom: '4mm', border: '0.5px solid #d1d5db', borderRadius: '3mm', backgroundColor: '#f3f4f6' }}>
              <img src={eventPoster} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200/f0f0f0/969696?text=Image+Error')}
              />
            </div>
            <div style={{ textAlign: 'center', padding: '3mm', border: '0.5px solid #d1d5db', borderRadius: '3mm', backgroundColor: '#f9fafb' }}>
              <div style={{ margin: '0 auto', width: '38mm', height: '38mm', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '2mm', border: '0.5px solid #ccc' }}>
                   <QrCode size={100} strokeWidth={1.5} style={{color: '#18093b'}} />
              </div>
              <p style={{ fontSize: '8pt', color: '#6b7280', marginTop: '2mm', textTransform: 'uppercase' }}>Nomor Tiket</p>
              <p style={{ fontSize: '11pt', fontWeight: 600, letterSpacing: '0.03em', wordBreak: 'break-all', color: '#18093b' }}>{ticketNumber}</p>
            </div>
          </div>
           <div style={{ marginTop: 'auto', border: '1px dashed #d1d5db', borderRadius: '3mm', padding: '5mm', textAlign: 'center', backgroundColor: '#f9fafb' }}>
            <p style={{ fontSize: '10pt', fontWeight: 600, color: '#4b5563' }}>Area Sponsor Resmi</p>
            <p style={{ fontSize: '8pt', color: '#6b7280', marginTop: '1.5mm' }}>Space ini disediakan untuk logo dan informasi sponsor event.</p>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
          <div style={{ padding: '3mm', border: '1px solid #4b998e', borderRadius: '3mm', backgroundColor: 'rgba(75,153,142,0.05)' }}>
            <p style={{ fontSize: '8pt', color: '#4b998e', fontWeight: 500, textTransform: 'uppercase', marginBottom: '1mm' }}>Kategori Tiket</p>
            <p style={{ fontSize: '14pt', fontWeight: 'bold', color: '#4b998e', marginBottom: '1mm' }}>{categoryName}</p>
            <p style={{ fontSize: '10pt', fontWeight: 500, color: '#18093b' }}>Harga: {priceDisplay}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '10pt', fontWeight: 600, color: '#18093b', marginBottom: '1.5mm', borderBottom: '0.5px solid #eee', paddingBottom: '1mm' }}>Pemegang Tiket</h3>
            <DetailItem icon={User} label="Nama:" value={holderName} />
          </div>
          
          <div>
            <h3 style={{ fontSize: '10pt', fontWeight: 600, color: '#18093b', marginBottom: '1.5mm', borderBottom: '0.5px solid #eee', paddingBottom: '1mm' }}>Data Pemesan</h3>
            <DetailItem icon={User} label="Nama:" value={bookerData.fullName} />
            <DetailItem icon={Mail} label="Email:" value={bookerData.email} />
            <DetailItem icon={Phone} label="Telepon:" value={bookerData.phoneNumber} />
          </div>

          <div>
            <h3 style={{ fontSize: '10pt', fontWeight: 600, color: '#18093b', marginBottom: '1.5mm', borderBottom: '0.5px solid #eee', paddingBottom: '1mm' }}>Informasi Event</h3>
            <DetailItem icon={CalendarDays} label="Tanggal:" value={formatDateFull(event.dateDisplay)} />
            <DetailItem icon={Clock} label="Waktu:" value={formatEventTime(event.timeDisplay, event.timezone)} />
            <DetailItem icon={MapPin} label="Lokasi:" value={event.location} />
            {event.address && (<DetailItem icon={InfoIconLucide} label="Alamat:" value={event.address} />)}
          </div>
          
           <div>
            <h3 style={{ fontSize: '10pt', fontWeight: 600, color: '#18093b', marginBottom: '1.5mm', borderBottom: '0.5px solid #eee', paddingBottom: '1mm' }}>Detail Pesanan</h3>
             <DetailItem icon={TicketIcon} label="ID Pesanan:" value={orderId} />
             {transactionId && transactionId !== orderId && (<DetailItem icon={InfoIconLucide} label="ID Transaksi:" value={transactionId} />)}
            </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '6mm', borderTop: '0.5px solid #e5e7eb', fontSize: '7.5pt', color: '#6b7280', textAlign: 'center' }}>
        <p>E-tiket ini adalah bukti sah untuk memasuki event. Harap simpan dengan baik. Dilarang menggandakan tiket ini. Syarat dan ketentuan berlaku.</p>
        <p style={{ marginTop: '1mm' }}>&copy; {new Date().getFullYear()} Hegira Event Platform. Info lebih lanjut: www.hegira.id</p>
        {event.organizerName && <p style={{ marginTop: '0.5mm' }}>Diselenggarakan oleh: {event.organizerName}</p>}
      </div>
    </div>
  );
};

export default PrintableTicket;