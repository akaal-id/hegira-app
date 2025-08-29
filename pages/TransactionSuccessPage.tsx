/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { TransactionData, PageName, formatEventTime, formatDisplayDate } from '../HegiraApp'; // Renamed import
import { CheckCircle, QrCode, Mail, MessageCircle as WhatsAppIcon, Phone, CalendarDays, MapPin, User, Info, Download, Home as HomeIcon, X, Ticket, Eye, Clock, CalendarPlus } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// --- ICS Generation Helpers ---
const getMonthNumber = (monthName: string): number | null => {
    const map: { [key: string]: number } = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    const lowerMonthName = monthName.toLowerCase();
    return map[lowerMonthName] !== undefined ? map[lowerMonthName] : null;
};

const parseDateString = (dateDisplay: string): { day: number, month: number, year: number } | null => {
    // Try parsing YYYY/MM/DD format first
    const ymdParts = dateDisplay.split(' - ')[0].split('/'); // take start date for single event
    if (ymdParts.length === 3) {
        const year = parseInt(ymdParts[0], 10);
        const month = parseInt(ymdParts[1], 10) - 1; // JS month is 0-indexed
        const day = parseInt(ymdParts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return { day, month, year };
        }
    }

    const dateRegex = /(?:[A-Za-z]+,\s*)?(?:(\d{1,2})-)?(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/;
    const match = dateDisplay.match(dateRegex);
    if (match) {
        const day = parseInt(match[2], 10);
        const monthName = match[3];
        const year = parseInt(match[4], 10);
        const month = getMonthNumber(monthName);
        if (month !== null && !isNaN(day) && !isNaN(year)) {
            return { day, month, year };
        }
    }
    console.warn("ICS: Failed to parse date string:", dateDisplay);
    return null;
};

const parseTimeString = (timeDisplay: string, eventDate: {day: number, month: number, year: number}, timezone?: string): { startDateUTC: Date, endDateUTC: Date } | null => {
    let tzOffsetHours = 7; // Default WIB
    if (timezone?.toUpperCase() === 'WITA' || timeDisplay.includes('WITA')) tzOffsetHours = 8;
    else if (timezone?.toUpperCase() === 'WIT' || timeDisplay.includes('WIT')) tzOffsetHours = 9;


    const cleanedTime = timeDisplay.replace(/\(([^)]+)\)/g, '').replace(/(WIB|WITA|WIT)/i, '').replace(/^Mulai\s+/i, '').trim();
    
    const timeRegexSimple = /(\d{1,2}):(\d{2})/;
    const timeRangeRegex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;

    let startH: number | null = null, startM: number | null = null, endH: number | null = null, endM: number | null = null;

    const rangeMatch = cleanedTime.match(timeRangeRegex);
    if (rangeMatch) {
        startH = parseInt(rangeMatch[1]); startM = parseInt(rangeMatch[2]);
        endH = parseInt(rangeMatch[3]); endM = parseInt(rangeMatch[4]);
    } else {
        const singleMatch = cleanedTime.match(timeRegexSimple);
        if (singleMatch) {
            startH = parseInt(singleMatch[1]); startM = parseInt(singleMatch[2]);
            if (cleanedTime.toLowerCase().includes('selesai') || cleanedTime.match(/^\d{1,2}:\d{2}$/)) {
                endH = startH + 2; 
                endM = startM;
                if (endH >= 24) { endH = 23; endM = 59; }
            } else {
                 console.warn("ICS: Time format recognized but seems incomplete for duration (e.g. 'Sesuai Jadwal'):", timeDisplay);
                 return null; // Cannot determine a clear start/end time
            }
        } else {
             console.warn("ICS: Failed to parse time string:", timeDisplay);
            return null;
        }
    }
    
    if (startH === null || startM === null || endH === null || endM === null || isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      console.warn("ICS: Parsed time components are invalid.");
      return null;
    }

    const { year, month, day } = eventDate;
    
    const startDateUTC = new Date(Date.UTC(year, month, day, startH, startM, 0));
    startDateUTC.setTime(startDateUTC.getTime() - tzOffsetHours * 60 * 60 * 1000);

    const endDateUTC = new Date(Date.UTC(year, month, day, endH, endM, 0));
    endDateUTC.setTime(endDateUTC.getTime() - tzOffsetHours * 60 * 60 * 1000);

    if (endDateUTC.getTime() <= startDateUTC.getTime()) {
        endDateUTC.setUTCDate(endDateUTC.getUTCDate() + 1);
    }

    return { startDateUTC, endDateUTC };
};

const formatDateToICS = (date: Date): string => {
  return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
};

const escapeICSString = (str: string = ""): string => {
  return str.replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
};
// --- End ICS Generation Helpers ---

const FALLBACK_POSTER_URL = 'https://via.placeholder.com/640x240/cccccc/888888?text=Event+Poster';
const ERROR_POSTER_URL = 'https://via.placeholder.com/640x240/f0f0f0/969696?text=Image+Error';

interface TransactionSuccessPageProps {
  transactionData: TransactionData;
  onNavigate: (page: PageName, data?: any) => void;
}

const TransactionSuccessPage: React.FC<TransactionSuccessPageProps> = ({ transactionData, onNavigate }) => {
  const { checkoutInfo, formData, transactionId, orderId } = transactionData;
  const { event, selectedTickets, totalPrice } = checkoutInfo;

  const [showSuccessToast, setShowSuccessToast] = useState(true);
  const [toastOpacity, setToastOpacity] = useState(0);
  const [canAddToCalendar, setCanAddToCalendar] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    let hideTimer: number;
    const fadeInTimer = setTimeout(() => {
      setToastOpacity(1);
      hideTimer = window.setTimeout(() => {
        setToastOpacity(0);
        setTimeout(() => setShowSuccessToast(false), 300);
      }, 5000); // Show toast for 5 seconds
    }, 100); 

    return () => {
      clearTimeout(fadeInTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const parsedDate = parseDateString(event.dateDisplay);
    if (parsedDate) {
      const parsedTimes = parseTimeString(event.timeDisplay, parsedDate, event.timezone);
      setCanAddToCalendar(parsedTimes !== null);
    } else {
      setCanAddToCalendar(false);
    }
    
    // Generate main QR code
    const generateMainQR = async () => {
      try {
        const qrCanvas = document.getElementById('mainQrCode') as HTMLCanvasElement;
        if (qrCanvas) {
          await QRCode.toCanvas(qrCanvas, `${transactionId} | ${event.name} | ${formData.fullName}`, {
            width: 128,
            margin: 2,
            color: {
              dark: '#18093B',
              light: '#FFFFFF'
            }
          });
        }
      } catch (error) {
        console.error('Error generating main QR code:', error);
      }
    };
    
    // Wait for DOM to be ready
    setTimeout(generateMainQR, 100);
  }, [event.dateDisplay, event.timeDisplay, event.timezone, transactionId, event.name, formData.fullName]);

  const handleAddToCalendar = () => {
    const parsedDate = parseDateString(event.dateDisplay);
    if (!parsedDate) {
              alert("Cannot process event date for calendar.");
      return;
    }
    const parsedTimes = parseTimeString(event.timeDisplay, parsedDate, event.timezone);
    if (!parsedTimes) {
              alert("Cannot process event time for calendar.");
      return;
    }

    const { startDateUTC, endDateUTC } = parsedTimes;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hegira//Event Calendar//EN', // Hegira
      'BEGIN:VEVENT',
      `UID:${event.id}-${orderId}@hegira.com`, // hegira.com
      `DTSTAMP:${formatDateToICS(new Date())}`,
      `DTSTART:${formatDateToICS(startDateUTC)}`,
      `DTEND:${formatDateToICS(endDateUTC)}`,
      `SUMMARY:${escapeICSString(event.name)}`,
      `DESCRIPTION:${escapeICSString(event.summary || `Detail untuk event ${event.name}`)}`,
      `LOCATION:${escapeICSString(event.location)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const eventFileName = event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `Hegira_Event_${eventFileName}.ics`; // Hegira
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


      const handleSendToEmail = () => alert('The "Send to Email" function has not been implemented yet. Tickets will be sent to: ' + formData.email);
    const handleSendToWhatsApp = () => alert('The "Send to WhatsApp" function has not been implemented yet. Tickets will be sent to: ' + formData.phoneNumber);
      const handleContactCreatorPhone = () => alert('Contacting Event Creator via phone (placeholder).');
    const handleContactCreatorEmail = () => alert('Contacting Event Creator via email (placeholder).');
      const handleDownloadTicket = () => alert('The "Download Ticket" function has not been implemented yet. Use the "View My Tickets" button to display tickets.');
  
  const totalTicketsPurchased = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  const handleViewMyTickets = async () => {
    setIsGeneratingPDF(true);
    // Generate PDF and open in new tab
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Create a temporary container for the ticket
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.height = '297mm';
    tempContainer.style.padding = '8mm';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
    tempContainer.style.color = '#18093b';
    tempContainer.style.display = 'flex';
    tempContainer.style.flexDirection = 'column';
    
    // Add ticket content
    tempContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 6mm; margin-bottom: 6mm; border-bottom: 0.5px solid #e5e7eb;">
        <div>
          <img src="/image/hegiralogo.png" alt="Hegira Logo" style="height: 56px; width: auto;" />
          <p style="font-size: 9pt; color: #4b5563; margin-top: 1.5mm;">Tiket Resmi Diterbitkan oleh Hegira</p>
        </div>
        <div style="text-align: right; max-width: 60%;">
          <h1 style="font-size: 18pt; font-weight: bold; line-height: 1.2; color: #18093b; margin-bottom: 1mm;">${event.name}</h1>
          ${event.summary ? `<p style="font-size: 9pt; color: #4b5563; word-break: break-word;">${event.summary}</p>` : ''}
        </div>
      </div>
      
      <div style="flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm;">
        <div style="display: flex; flex-direction: column;">
          <div style="text-align: center; padding: 3mm; border: 0.5px solid #d1d5db; border-radius: 3mm; background-color: #f9fafb;">
            <div style="margin: 0 auto; width: 38mm; height: 38mm; display: flex; align-items: center; justify-content: center; background-color: white; border-radius: 2mm; border: 0.5px solid #ccc;">
              <canvas id="qrCanvas" style="width: 100%; height: 100%;"></canvas>
            </div>
            <p style="font-size: 8pt; color: #6b7280; margin-top: 2mm; text-transform: uppercase;">Nomor Tiket</p>
            <p style="font-size: 11pt; font-weight: 600; letter-spacing: 0.03em; word-break: break-all; color: #18093b;">${orderId}</p>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 3mm;">
          <div style="padding: 3mm; border: 1px solid #4b998e; border-radius: 3mm; background-color: rgba(75,153,142,0.05);">
            <p style="font-size: 8pt; color: #4b998e; font-weight: 500; text-transform: uppercase; margin-bottom: 1mm;">Kategori Tiket</p>
            <p style="font-size: 14pt; font-weight: bold; color: #4b998e; margin-bottom: 1mm;">${selectedTickets.map(t => t.categoryName).join(', ')}</p>
          </div>
          
          <div>
            <h3 style="font-size: 10pt; font-weight: 600; color: #18093b; margin-bottom: 1.5mm; border-bottom: 0.5px solid #eee; padding-bottom: 1mm;">Data Pemesan</h3>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Nama:</span>
              <span style="color: #18093b;">${formData.fullName}</span>
            </div>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Email:</span>
              <span style="color: #18093b;">${formData.email}</span>
            </div>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Telepon:</span>
              <span style="color: #18093b;">${formData.phoneNumber}</span>
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 10pt; font-weight: 600; color: #18093b; margin-bottom: 1.5mm; border-bottom: 0.5px solid #eee; padding-bottom: 1mm;">Informasi Event</h3>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Tanggal:</span>
              <span style="color: #18093b;">${formatDisplayDate(event.dateDisplay)}</span>
            </div>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Waktu:</span>
              <span style="color: #18093b;">${formatEventTime(event.timeDisplay, event.timezone)}</span>
            </div>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">Lokasi:</span>
              <span style="color: #18093b;">${event.location}</span>
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 10pt; font-weight: 600; color: #18093b; margin-bottom: 1.5mm; border-bottom: 0.5px solid #eee; padding-bottom: 1mm;">Detail Pesanan</h3>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">ID Pesanan:</span>
              <span style="color: #18093b;">${orderId}</span>
            </div>
            <div style="font-size: 9pt; margin-bottom: 1.5mm;">
              <span style="font-weight: 500; color: #374151; margin-right: 1mm;">ID Transaksi:</span>
              <span style="color: #18093b;">${transactionId}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: auto; padding-top: 6mm; border-top: 0.5px solid #e5e7eb; font-size: 7.5pt; color: #6b7280; text-align: center;">
        <p>E-tiket ini adalah bukti sah untuk memasuki event. Harap simpan dengan baik. Dilarang menggandakan tiket ini. Syarat dan ketentuan berlaku.</p>
        <p style="margin-top: 1mm;">&copy; ${new Date().getFullYear()} Hegira Event Platform. Info lebih lanjut: www.hegira.id</p>
        ${event.organizerName ? `<p style="margin-top: 0.5mm;">Diselenggarakan oleh: ${event.organizerName}</p>` : ''}
      </div>
    `;
    
    document.body.appendChild(tempContainer);
    
    // Generate QR code for the ticket
    try {
      const qrCanvas = tempContainer.querySelector('#qrCanvas') as HTMLCanvasElement;
      if (qrCanvas) {
        await QRCode.toCanvas(qrCanvas, `${orderId} | ${event.name} | ${formData.fullName}`, {
          width: 120,
          margin: 2,
          color: {
            dark: '#18093B',
            light: '#FFFFFF'
          }
        });
      }
    } catch (qrError) {
      console.error('Error generating QR code:', qrError);
    }
    
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgProps = pdf.getImageProperties(imgData);
      const aspectRatio = imgProps.width / imgProps.height;
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      let imgWidth = pdfWidth;
      let imgHeight = imgWidth / aspectRatio;
      
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * aspectRatio;
      }
      
      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
      
      // Open PDF in new tab
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      // Clean up the URL object after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      // Clean up temporary container
      document.body.removeChild(tempContainer);
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      {showSuccessToast && (
        <div 
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[1001] w-11/12 max-w-lg bg-green-500 text-white p-4 rounded-lg shadow-xl flex items-start transition-opacity duration-300 ease-in-out"
          style={{ opacity: toastOpacity }}
          role="alert"
          aria-live="assertive"
        >
          <CheckCircle className="h-6 w-6 text-white mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
                          <p className="font-bold">Transaction Complete & Successful!</p>
            <p className="text-sm mt-0.5">
                              Your e-tickets have been issued and sent to email ({formData.email}) & WhatsApp ({formData.phoneNumber}).
            </p>
                          <p className="text-sm mt-0.5">Thank you for transacting with Hegira.</p>
          </div>
          <button 
            onClick={() => {
              setToastOpacity(0); 
              setTimeout(() => setShowSuccessToast(false), 300); 
            }}
            className="ml-2 p-1 -mr-1 -mt-1 text-white hover:bg-green-600 rounded-full focus:outline-none"
            aria-label="Tutup notifikasi"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-gray-50 min-h-screen py-8 md:py-12 pb-48 lg:pb-12"> {/* Increased mobile bottom padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-2/3 bg-white p-6 md:p-8 rounded-xl border border-hegra-navy/10 mb-8 lg:mb-0">
              <h2 className="text-2xl font-jakarta font-bold text-hegra-navy mb-6 border-b pb-3">Detail E-Tiket Anda</h2>

              <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                                  <h3 className="text-lg font-jakarta font-medium text-hegra-navy mb-2">Scan to Enter Event</h3>
                <canvas id="mainQrCode" className="mx-auto my-4" style={{ width: '128px', height: '128px' }} />
                <p className="text-xs text-gray-500">Show this code when entering the event area. Ticket details can be viewed in "View My Tickets".</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
                <div>
                  <strong className="block text-gray-500">Nomor Transaksi:</strong>
                  <span className="text-hegra-navy font-medium">{transactionId}</span>
                </div>
                <div>
                  <strong className="block text-gray-500">ID Pesanan:</strong>
                  <span className="text-hegra-navy font-medium">{orderId}</span>
                </div>
              </div>

              <div className="mb-6 border-t pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-jakarta font-semibold text-hegra-navy">Informasi Event</h3>
                    <p className="text-xl font-medium font-jakarta text-hegra-turquoise mt-1">{event.name}</p>
                  </div>
                  <button
                    onClick={handleAddToCalendar}
                    disabled={!canAddToCalendar}
                    className="flex items-center justify-center gap-1.5 text-xs bg-hegra-turquoise text-white font-semibold py-2 px-3 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    title={canAddToCalendar ? "Tambahkan ke Kalender" : "Info tanggal/waktu tidak lengkap untuk kalender"}
                  >
                    <CalendarPlus size={14} /> Tambahkan ke Kalender
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <CalendarDays size={16} className="mr-2 flex-shrink-0" /> {formatDisplayDate(event.dateDisplay)}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock size={16} className="mr-2 flex-shrink-0" /> {formatEventTime(event.timeDisplay, event.timezone)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 flex-shrink-0" /> 
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.googleMapsQuery || event.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-hegra-turquoise hover:underline"
                  >
                    {event.location}
                  </a>
                </div>
              </div>

              <div className="mb-6 border-t pt-4">
                <h3 className="text-lg font-jakarta font-semibold text-hegra-navy mb-3">Data Pemesan</h3>
                <div className="space-y-1 text-sm">
                  <p><strong className="text-gray-500 w-24 inline-block">Nama:</strong> {formData.fullName}</p>
                  <p><strong className="text-gray-500 w-24 inline-block">Email:</strong> {formData.email}</p>
                  <p><strong className="text-gray-500 w-24 inline-block">Telepon:</strong> {formData.phoneNumber}</p>
                </div>
              </div>

              {totalTicketsPurchased > 0 && formData.additionalTicketHolders && formData.additionalTicketHolders.length > 0 && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="text-lg font-jakarta font-semibold text-hegra-navy mb-4 flex items-center">
                    <Ticket size={20} className="mr-2 text-hegra-turquoise" />
                    Detail Pemegang Tiket ({totalTicketsPurchased} Tiket)
                  </h3>
                  <div className="space-y-4">
                    {formData.additionalTicketHolders.map((holder, index) => {
                      const ticketNumber = `TICKET-${orderId.split('-')[1]}-${String(index + 1).padStart(3, '0')}`;
                                            
                      return (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm">
                          <p className="font-semibold font-jakarta text-hegra-navy">Tiket #{index + 1}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">Nomor Tiket:</strong> {ticketNumber}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">Nama Pemegang:</strong> {holder.fullName}</p>
                          <p><strong className="text-gray-500 w-32 inline-block">No. WhatsApp:</strong> {holder.whatsAppNumber}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-lg font-jakarta font-semibold text-hegra-navy mb-3 flex items-center">
                  <Info size={20} className="mr-2 text-hegra-turquoise" /> Syarat & Ketentuan Penting
                </h3>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 pl-2">
                  <li>E-tiket ini bersifat rahasia. Jangan bagikan kode QR atau detail tiket kepada pihak yang tidak berkepentingan.</li>
                  <li>Satu tiket berlaku untuk satu orang, kecuali tertera lain.</li>
                  <li>Pemegang tiket dianggap telah menyetujui seluruh syarat dan ketentuan yang ditetapkan oleh penyelenggara event.</li>
                  <li>Dilarang membawa senjata tajam, minuman keras, dan obat-obatan terlarang.</li>
                  <li>Penyelenggara berhak menolak masuk atau mengeluarkan pengunjung yang tidak mematuhi aturan.</li>
                </ul>
              </div>
            </div>

            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-24 bg-white rounded-xl border border-hegra-navy/10 overflow-hidden">
                 {/* Event Poster Image */}
                <div className="relative w-full" style={{ paddingTop: '37.5%' /* 16:6 aspect ratio */ }}>
                  <img
                    src={event.coverImageUrl || event.posterUrl || FALLBACK_POSTER_URL}
                    alt={`Poster ${event.name}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = ERROR_POSTER_URL)}
                  />
                </div>
                {/* Original Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-jakarta font-semibold text-hegra-navy mb-4">Detail Pesanan</h3>
                  <div className="space-y-2 mb-4 text-sm">
                    {selectedTickets.map(ticket => (
                      <div key={ticket.categoryId} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                        <div>
                            <p className="font-medium text-gray-800">{ticket.categoryName} (x{ticket.quantity})</p>
                            <p className="text-xs text-gray-500">{formatCurrency(ticket.pricePerTicket)} / tiket</p>
                        </div>
                        <p className="font-semibold text-gray-800">{formatCurrency(ticket.quantity * ticket.pricePerTicket)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                      <span className="text-base font-semibold text-hegra-navy">Total Dibayar</span>
                      <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <button
                      onClick={handleViewMyTickets}
                      disabled={isGeneratingPDF}
                      className="w-full flex items-center justify-center gap-2 bg-hegra-yellow text-hegra-navy font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-hegra-navy"></div>
                          Membuat PDF...
                        </>
                      ) : (
                        <>
                          <Eye size={18} /> View My Tickets (PDF)
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadTicket} 
                      className="w-full flex items-center justify-center gap-2 bg-hegra-turquoise text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <Download size={18} /> Unduh Tiket (Simulasi)
                    </button>
                    <button
                      onClick={handleSendToEmail}
                      className="w-full flex items-center justify-center gap-2 bg-hegra-navy text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                                              <Mail size={18} /> Send to My Email
                    </button>
                    <button
                      onClick={handleSendToWhatsApp}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                                              <WhatsAppIcon size={18} /> Send to My WhatsApp
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm font-jakarta font-semibold text-hegra-navy mb-2 text-center">Butuh Bantuan terkait Event?</p>
                    <p className="text-xs text-gray-500 mb-3 text-center">Hubungi langsung penyelenggara event:</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleContactCreatorEmail}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Mail size={14} /> Email Creator
                      </button>
                      <button
                        onClick={handleContactCreatorPhone}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Phone size={14} /> Telepon Creator
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('landing')}
                    className="mt-8 w-full text-center text-sm text-hegra-turquoise hover:underline"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-3 border-t border-gray-200 shadow-lg space-y-2">
          <div className="flex justify-between items-center">
              <div>
                  <p className="text-xs text-gray-500">Total Dibayar</p>
                  <p className="text-lg font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</p>
              </div>
              <button
                  onClick={handleViewMyTickets}
                  disabled={isGeneratingPDF}
                  className="bg-hegra-yellow text-hegra-navy font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-hegra-navy"></div>
                      Membuat PDF...
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> View My Tickets (PDF)
                    </>
                  )}
              </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleDownloadTicket}
                className="w-full flex items-center justify-center gap-1 bg-hegra-turquoise text-white font-medium py-2 px-2 rounded-md hover:bg-opacity-80 transition-colors"
              >
                <Download size={14} /> Unduh (Simulasi)
              </button>
              <button
                onClick={handleSendToEmail}
                className="w-full flex items-center justify-center gap-1 bg-hegra-navy text-white font-medium py-2 px-2 rounded-md hover:bg-opacity-80 transition-colors"
              >
                <Mail size={14} /> Kirim Email
              </button>
              <button
                onClick={handleSendToWhatsApp}
                className="w-full flex items-center justify-center gap-1 bg-green-500 text-white font-medium py-2 px-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon size={14} /> Kirim WhatsApp
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <HomeIcon size={14} /> Ke Beranda
              </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleContactCreatorEmail}
              className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Mail size={14} /> Email Creator
            </button>
            <button
              onClick={handleContactCreatorPhone}
              className="w-full flex items-center justify-center gap-1 bg-gray-100 text-hegra-navy font-medium py-2 px-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Phone size={14} /> Telepon Creator
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionSuccessPage;