/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EventData, PageName, SelectedTicket, TicketCategory, CheckoutInfo, formatEventTime, formatDisplayDate } from '../HegiraApp'; // Renamed import
import Breadcrumbs from '../components/Breadcrumbs'; // New
import TermsAndConditionsModal from '../components/TermsAndConditionsModal'; // New
import { Share2, Link as LinkIcon, MapPin, CalendarDays, Clock, Users, ParkingCircle, Info, Ticket, ShoppingCart, Minus, Plus, Instagram, Facebook, Twitter, Linkedin, MessageCircle as WhatsAppIcon, ChevronDown, ChevronUp, CheckCircle, Award, Phone, Mail as MailIcon, Briefcase } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// Utility function to format description with lists
const formatDescriptionWithLists = (description: string | undefined): string => {
  if (!description) return '<p>Informasi detail mengenai event ini akan segera tersedia.</p>';

  const lines = description.split('\n');
  const outputLines: string[] = [];
  let listType: 'ol' | 'ul' | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const olMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
    const ulMatch = trimmedLine.match(/^[-*]\s+(.*)/);

    if (olMatch) {
      if (listType !== 'ol') {
        if (listType === 'ul') outputLines.push('</ul>');
        outputLines.push('<ol class="list-decimal pl-5 space-y-1">');
        listType = 'ol';
      }
      outputLines.push(`  <li>${olMatch[2]}</li>`);
    } else if (ulMatch) {
      if (listType !== 'ul') {
        if (listType === 'ol') outputLines.push('</ol>');
        outputLines.push('<ul class="list-disc pl-5 space-y-1">');
        listType = 'ul';
      }
      outputLines.push(`  <li>${ulMatch[1]}</li>`);
    } else {
      if (listType) {
        outputLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        listType = null;
      }
      if (trimmedLine) {
        outputLines.push(`<p class="my-2">${trimmedLine}</p>`);
      } else if (outputLines.length > 0 && !outputLines[outputLines.length - 1].match(/<\/(ul|ol)>/) && !outputLines[outputLines.length - 1].match(/<\/p>$/)) {
        // Add a visual break if it's a blank line between paragraphs, but not after lists or if the last line was also a paragraph
        // outputLines.push('<br />'); // Or handle with CSS margins on <p>
      }
    }
  }
  if (listType) { // Close any open list
    outputLines.push(listType === 'ol' ? '</ol>' : '</ul>');
  }
  return outputLines.join('\n');
};

interface TicketCategoryCardProps {
  category: TicketCategory;
  quantity: number;
  onQuantityChange: (categoryId: string, newQuantity: number) => void;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  eventTimezone?: string;
}

const TicketCategoryCard: React.FC<TicketCategoryCardProps> = ({ category, quantity, onQuantityChange, eventDateDisplay, eventTimeDisplay, eventTimezone }) => {
  const increment = () => onQuantityChange(category.id, quantity + 1);
  const decrement = () => onQuantityChange(category.id, Math.max(0, quantity - 1));

  const statusStyles = {
    'available': { text: 'Tersedia', chip: 'bg-green-100 text-green-700' },
    'almost-sold': { text: 'Hampir Habis', chip: 'bg-yellow-100 text-yellow-700' },
    'sold-out': { text: 'Habis Terjual', chip: 'bg-red-100 text-red-700' },
  };

  const currentStatus = category.availabilityStatus ? statusStyles[category.availabilityStatus] : null;

  return (
    <div 
      className={`bg-white p-4 rounded-lg border transition-all duration-300 ${
        quantity > 0 ? 'border-hegra-turquoise/40' : 'border-hegra-navy/10'
      } flex flex-col justify-between min-h-[160px]`} // Added min-h and flex for layout
    >
      <div>
        <div className="flex justify-between items-start mb-4"> {/* Gap: Title to Date/Time = 16px (was mb-6) */}
          <h4 className="text-lg font-jakarta font-semibold text-hegra-navy">{category.name}</h4>
          {currentStatus && (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${currentStatus.chip}`}>
              {currentStatus.text}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2 gap-x-4 sm:gap-x-6 gap-y-1"> {/* Gap: Date/Time to Description = 8px (was mb-3) */}
          <div className="flex items-center">
            <CalendarDays size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span>{formatDisplayDate(eventDateDisplay)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5 text-hegra-turquoise flex-shrink-0" />
            <span>{formatEventTime(eventTimeDisplay, eventTimezone)}</span>
          </div>
        </div>
        
        {category.description && (
          <p className="text-xs text-gray-500 mb-4 truncate" title={category.description}> {/* Gap: Description to Price/Counter = 16px (was mb-6) */}
            {category.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2"> {/* Ensure this section is at the bottom */}
        <p className="text-2xl font-bold text-hegra-turquoise">{formatCurrency(category.price)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={decrement}
            disabled={quantity === 0 || category.availabilityStatus === 'sold-out'}
            className="p-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Kurangi jumlah tiket ${category.name}`}
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-medium w-8 text-center" aria-live="polite">{quantity}</span>
          <button
            onClick={increment}
            disabled={category.availabilityStatus === 'sold-out'}
            className="p-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Tambah jumlah tiket ${category.name}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


interface EventDetailPageProps {
  event: EventData;
  onNavigate: (page: PageName, data?: any) => void;
  onNavigateRequestWithConfirmation: (targetPage: PageName, targetData?: any, resetCallback?: () => void) => void;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onNavigate, onNavigateRequestWithConfirmation }) => {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({}); // { categoryId: quantity }
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showTnCModal, setShowTnCModal] = useState(false); // New state for TnC Modal
  const [selectedDate, setSelectedDate] = useState<string>('all'); // 'all' or 'YYYY-MM-DD'


  // Logic to determine if event is multi-day and get dates
  const getEventDates = (dateDisplay: string): string[] => {
    if (!dateDisplay.includes(' - ')) {
      // Single day event, return just that day in YYYY-MM-DD
      try {
        const singleDate = new Date(dateDisplay.replace(/\//g, '-'));
        if (!isNaN(singleDate.getTime())) {
          return [singleDate.toISOString().split('T')[0]];
        }
      } catch (e) { return []; }
      return [];
    }
    const [startStr, endStr] = dateDisplay.split(' - ');
    const startDate = new Date(startStr.replace(/\//g, '-'));
    const endDate = new Date(endStr.replace(/\//g, '-'));
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    
    // Add time to avoid timezone issues with date comparisons
    currentDate.setUTCHours(0,0,0,0);
    endDate.setUTCHours(0,0,0,0);


    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const eventDates = useMemo(() => getEventDates(event.dateDisplay), [event.dateDisplay]);
  const isMultiDay = eventDates.length > 1;

  // Reset selected tickets if event changes
  useEffect(() => {
    setSelectedTickets({});
    setIsDescriptionExpanded(false); // Reset description expansion state as well
    setShowTnCModal(false); // Ensure TnC modal is closed on event change
    setSelectedDate('all'); // Reset selected date on event change
  }, [event.id]);

  const handleQuantityChange = (categoryId: string, newQuantity: number) => {
    const category = event.ticketCategories.find(cat => cat.id === categoryId);
    if (category?.availabilityStatus === 'sold-out' && newQuantity > 0) {
      return; // Prevent increasing quantity if sold out
    }
    setSelectedTickets(prev => ({ ...prev, [categoryId]: newQuantity }));
  };

  const currentEventUrl = `${window.location.origin}/event/${event.id}`; // More specific URL

  const shareActions = {
    copyLink: () => navigator.clipboard.writeText(currentEventUrl).then(() => alert('Link event disalin!')),
    whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(event.name + ' - ' + currentEventUrl)}`, '_blank'),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentEventUrl)}`, '_blank'),
    twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentEventUrl)}&text=${encodeURIComponent(event.name)}`, '_blank'),
    linkedin: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentEventUrl)}&title=${encodeURIComponent(event.name)}&summary=${encodeURIComponent(event.summary || '')}`, '_blank'),
    instagram: () => alert('Bagikan di Instagram melalui aplikasi mobile Anda! Salin link dan buka Instagram.'), // Simplified
  };


  const totalSelectedQuantity = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  }, [selectedTickets]);

  const totalPrice = useMemo(() => {
    return event.ticketCategories.reduce((total, category) => {
      const quantity = selectedTickets[category.id] || 0;
      return total + (quantity * category.price);
    }, 0);
  }, [selectedTickets, event.ticketCategories]);

  const handlePrimaryAction = () => {
    if (totalSelectedQuantity > 0) {
      setShowTnCModal(true); // Show TnC modal instead of navigating directly
    } else {
      // Scroll to ticket section
      const ticketSection = document.getElementById('ticket-section');
      if (ticketSection) {
        ticketSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const handleAcceptTnCAndProceed = () => {
    setShowTnCModal(false);
    const ticketsToCheckout: SelectedTicket[] = event.ticketCategories
      .filter(cat => (selectedTickets[cat.id] || 0) > 0)
      .map(cat => ({
        categoryId: cat.id,
        categoryName: cat.name,
        quantity: selectedTickets[cat.id],
        pricePerTicket: cat.price,
      }));

    const checkoutData: CheckoutInfo = {
      event,
      selectedTickets: ticketsToCheckout,
      totalPrice,
    };
    onNavigate('checkout', checkoutData);
  };

  const handleDeclineTnC = () => {
    setShowTnCModal(false);
  };

  const heroImageStyle: React.CSSProperties = event.coverImageUrl ? {
    backgroundImage: `url(${event.coverImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `${(6 / 16) * 100}%`, // Aspect ratio 16:6
  } : (event.posterUrl ? {
    backgroundImage: `url(${event.posterUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `${(6 / 16) * 100}%`,
  } : {});


  const handleBreadcrumbNavigate = useCallback((targetPage: PageName) => {
    if (totalSelectedQuantity > 0) {
      // Pass a callback to reset local state if navigation is confirmed
      onNavigateRequestWithConfirmation(targetPage, undefined, () => setSelectedTickets({}));
    } else {
      onNavigate(targetPage);
    }
  }, [totalSelectedQuantity, onNavigate, onNavigateRequestWithConfirmation]);

  const buttonText = totalSelectedQuantity > 0 ? 'Pesan Sekarang' : 'Pilih Tiket';
  const buttonIcon = <ShoppingCart size={totalSelectedQuantity > 0 ? 20 : 18} />;

  const filteredTicketCategories = useMemo(() => {
    if (!isMultiDay || selectedDate === 'all') {
      return event.ticketCategories;
    }

    const selectedDateObj = new Date(selectedDate + 'T00:00:00');

    return event.ticketCategories.filter(ticket => {
      const useEventSchedule = ticket.useEventSchedule === undefined ? true : ticket.useEventSchedule;

      if (useEventSchedule) {
        // Ticket follows main event schedule, so it's always valid on any of the event's days
        return true;
      } else {
        // Ticket has its own schedule
        if (!ticket.ticketStartDate) return false; // No start date, invalid

        const ticketStartDateObj = new Date(ticket.ticketStartDate + 'T00:00:00');
        
        // If there's an end date, check if selected date is within the range
        if (ticket.ticketEndDate) {
          const ticketEndDateObj = new Date(ticket.ticketEndDate + 'T23:59:59');
          return selectedDateObj >= ticketStartDateObj && selectedDateObj <= ticketEndDateObj;
        }
        
        // If only start date, it's valid only on that day
        return selectedDateObj.getTime() === ticketStartDateObj.getTime();
      }
    });
  }, [selectedDate, event.ticketCategories, isMultiDay]);


  // Determine which description to use
  let descriptionHtml;
  if (event.name === "AI FUTURE FEST - Menuju Indonesia 5.0") {
    // Hardcoded HTML for "AI FUTURE FEST"
    descriptionHtml = `
      <p class="mb-4">Bersiaplah untuk menyongsong era baru dengan AI FUTURE FEST - Menuju Indonesia 5.0, festival teknologi AI terbesar di Indonesia! Acara ini menghadirkan berbagai inovasi terkini dalam kecerdasan buatan, dari otomatisasi industri hingga AI dalam kehidupan sehari-hari.</p>
      <p class="mb-4">Dengan mengusung visi "Membangun Ekosistem AI yang Inklusif dan Berkelanjutan", AI FUTURE FEST menghadirkan para pakar, startup AI, pelaku industri, serta pemerintah untuk bersama-sama mendukung transformasi digital menuju Indonesia 5.0.</p>
      <h3 class="text-lg font-jakarta font-semibold text-hegra-navy mt-6 mb-3">Apa yang Bisa Anda Dapatkan?</h3>
      <ul class="space-y-2 list-none p-0">
        <li class="flex items-start"><span class="text-green-500 mr-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Keynote Speech dari pakar AI global & pemimpin industri</li>
        <li class="flex items-start"><span class="text-green-500 mr-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Panel Diskusi & Talkshow tentang tren AI & implementasinya di Indonesia</li>
        <li class="flex items-start"><span class="text-green-500 mr-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Workshop & Masterclass untuk meningkatkan keterampilan AI</li>
        <li class="flex items-start"><span class="text-green-500 mr-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Startup & Tech Showcase menampilkan inovasi AI terbaru</li>
        <li class="flex items-start"><span class="text-green-500 mr-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Networking & Hiring Session bagi profesional dan pencari kerja di bidang AI</li>
      </ul>
      <p class="mt-6">Jangan lewatkan kesempatan emas ini untuk menjadi bagian dari revolusi AI di Indonesia!</p>
      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-jakarta font-semibold text-hegra-navy mb-3">Daftar & Informasi Kontak</h3>
        <p class="flex items-center text-gray-700 mb-1.5"><span class="text-hegra-turquoise mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg></span>Daftar sekarang di: <a href="https://www.aifuturefest.com" target="_blank" rel="noopener noreferrer" class="text-hegra-turquoise hover:underline ml-1">www.aifuturefest.com</a></p>
        <p class="flex items-center text-gray-700"><span class="text-hegra-turquoise mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span>Kontak: (+62) 812-3456-7890 | <span class="text-hegra-turquoise mr-1 ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></span><a href="mailto:info@aifuturefest.com" class="text-hegra-turquoise hover:underline">info@aifuturefest.com</a></p>
      </div>
    `;
  } else {
    descriptionHtml = formatDescriptionWithLists(event.fullDescription);
  }

  const cleanPhoneNumber = (phone: string | undefined) => phone ? phone.replace(/\D/g, '') : '';

  return (
    <div className="bg-gray-50 pb-28 lg:pb-0"> {/* Added bottom padding for mobile sticky bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
         <Breadcrumbs eventName={event.name} onNavigate={handleBreadcrumbNavigate} />
      </div>
      {/* Hero Banner */}
      <div 
        className={`w-full bg-gray-300 relative ${!(event.coverImageUrl || event.posterUrl) && 'h-48 md:h-64 lg:h-80'}`}
        style={heroImageStyle}
        role="img"
        aria-label={`Poster event ${event.name}`}
      >
        {!(event.coverImageUrl || event.posterUrl) && <div className="absolute inset-0 flex items-center justify-center text-gray-500">Poster Event</div>}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            {/* Island Card for Core Info */}
            <section aria-labelledby="event-main-info" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8 -mt-16 lg:-mt-24 relative z-10">
              <h1 id="event-main-info" className="text-3xl md:text-4xl font-bold font-jakarta text-hegra-navy mb-3">{event.name}</h1>
              {event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && event.summary && (
                <p className="text-gray-700 mb-6 text-lg">{event.summary}</p>
              )}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
                <div className="flex items-start">
                  <CalendarDays size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-hegra-navy">Tanggal & Waktu</strong>
                    <span>{formatDisplayDate(event.dateDisplay)}</span>
                    <span className="block text-gray-600 text-sm mt-0.5">{formatEventTime(event.timeDisplay, event.timezone)}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-hegra-navy">Lokasi</strong>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.googleMapsQuery || event.location)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-hegra-turquoise"
                    >
                      {event.location}
                    </a>
                  </div>
                </div>
                {event.parkingAvailable !== undefined && event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
                  <div className="flex items-start">
                    <ParkingCircle size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Parkir:</strong> {event.parkingAvailable ? 'Tersedia' : 'Terbatas/Tidak Tersedia'}</div>
                  </div>
                )}
                {event.ageRestriction && event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
                  <div className="flex items-start">
                    <Users size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Batasan Usia:</strong> {event.ageRestriction}</div>
                  </div>
                )}
                {event.arrivalInfo && event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
                  <div className="flex items-start md:col-span-2">
                    <Clock size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                    <div><strong className="text-hegra-navy">Info Kedatangan:</strong> {event.arrivalInfo}</div>
                  </div>
                )}
              </div>
              
              {/* Event Creator Profile Section */}
              {(event.organizerName || event.narahubungPhone || event.narahubungEmail) && (
                 <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-md font-jakarta font-semibold text-gray-700 mb-3">Diselenggarakan oleh:</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {event.organizerLogoUrl ? (
                                <img src={event.organizerLogoUrl} alt={event.organizerName} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-hegra-turquoise/20 text-hegra-turquoise flex items-center justify-center text-lg font-semibold mr-3">
                                    {event.organizerName ? event.organizerName.charAt(0).toUpperCase() : <Briefcase size={20}/>}
                                </div>
                            )}
                            <span className="text-sm font-medium text-hegra-navy">{event.organizerName || 'Penyelenggara Event'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {event.narahubungPhone && (
                                <a 
                                    href={`https://wa.me/${cleanPhoneNumber(event.narahubungPhone)}`} 
                                    target="_blank" rel="noopener noreferrer" 
                                    className="p-2 text-gray-500 hover:text-green-500 bg-gray-100 hover:bg-green-50 rounded-full transition-colors"
                                    title={`WhatsApp ${event.narahubungName || event.organizerName}`}
                                    aria-label="Hubungi via WhatsApp"
                                >
                                    <WhatsAppIcon size={18} />
                                </a>
                            )}
                            {event.narahubungEmail && (
                                <a 
                                    href={`mailto:${event.narahubungEmail}`} 
                                    className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full transition-colors"
                                    title={`Email ${event.narahubungName || event.organizerName}`}
                                    aria-label="Hubungi via Email"
                                >
                                    <MailIcon size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                 </div>
              )}

              <hr className="my-6 border-gray-100"/>
              
              <div className="relative w-full">
                <button 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="w-full flex items-center justify-center gap-2 text-hegra-turquoise hover:text-hegra-navy font-semibold py-2.5 px-4 border border-hegra-turquoise rounded-lg transition-colors"
                  aria-expanded={showShareOptions}
                  aria-controls="share-options-menu"
                >
                  <Share2 size={18} /> Bagikan Event Ini
                </button>
                {showShareOptions && (
                  <div id="share-options-menu" className="absolute left-0 right-0 bottom-full mb-2 w-full bg-white border rounded-md shadow-lg z-20 p-2 space-y-1">
                    <button onClick={shareActions.copyLink} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      <LinkIcon size={16} /> Salin Link
                    </button>
                    <button onClick={shareActions.whatsapp} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <WhatsAppIcon size={16}/> WhatsApp
                    </button>
                     <button onClick={shareActions.facebook} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Facebook size={16}/> Facebook
                    </button>
                    <button onClick={shareActions.twitter} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Twitter size={16}/> Twitter
                    </button>
                    <button onClick={shareActions.linkedin} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Linkedin size={16}/> LinkedIn
                    </button>
                     <button onClick={shareActions.instagram} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                       <Instagram size={16}/> Instagram
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Full Event Description */}
            <section aria-labelledby="event-description-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 id="event-description-heading" className="text-2xl font-jakarta font-bold text-hegra-navy">Deskripsi Event</h2>
                {event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors"
                    aria-expanded={isDescriptionExpanded}
                  >
                    {isDescriptionExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                    {isDescriptionExpanded ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
                  </button>
                )}
              </div>
              <div 
                className={`prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 
                  ${event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && !isDescriptionExpanded ? 'line-clamp-3' : ''}`}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
              />
            </section>

            {/* Ticket Section */}
            {event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
              <section id="ticket-section" aria-labelledby="ticket-options-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10">
                <div className="flex items-center gap-3 mb-6">
                  <Ticket size={28} className="text-hegra-turquoise" />
                  <h2 id="ticket-options-heading" className="text-2xl font-jakarta font-bold text-hegra-navy">Pilih Tiket Anda</h2>
                </div>
                
                {isMultiDay && (
                  <div className="mb-6">
                    <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4 horizontal-event-scroll">
                      <button
                        onClick={() => setSelectedDate('all')}
                        className={`flex-shrink-0 w-[120px] h-[120px] flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 focus:outline-none ${selectedDate === 'all' ? 'bg-hegra-turquoise/20 border-hegra-turquoise text-hegra-turquoise shadow-lg' : 'bg-white border-gray-200 text-hegra-navy hover:border-hegra-turquoise hover:bg-hegra-turquoise/5'}`}
                      >
                        <CalendarDays size={32} />
                        <span className="mt-2 font-semibold">Semua</span>
                      </button>
                      {eventDates.map(dateStr => {
                          const dateObj = new Date(dateStr + 'T00:00:00'); // Use UTC context
                          const day = dateObj.toLocaleDateString('id-ID', { day: '2-digit' });
                          const month = dateObj.toLocaleDateString('id-ID', { month: 'short' });
                          return (
                              <button
                                  key={dateStr}
                                  onClick={() => setSelectedDate(dateStr)}
                                  className={`flex-shrink-0 w-[120px] h-[120px] flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 focus:outline-none ${selectedDate === dateStr ? 'bg-hegra-turquoise/20 border-hegra-turquoise text-hegra-turquoise shadow-lg' : 'bg-white border-gray-200 text-hegra-navy hover:border-hegra-turquoise hover:bg-hegra-turquoise/5'}`}
                              >
                                  <span className="text-3xl font-bold">{day}</span>
                                  <span className="mt-1 font-semibold">{month}</span>
                              </button>
                          );
                      })}
                    </div>
                  </div>
                )}
                
                {filteredTicketCategories && filteredTicketCategories.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTicketCategories.map(category => (
                      <TicketCategoryCard 
                        key={category.id}
                        category={category}
                        quantity={selectedTickets[category.id] || 0}
                        onQuantityChange={handleQuantityChange}
                        eventDateDisplay={event.dateDisplay}
                        eventTimeDisplay={event.timeDisplay}
                        eventTimezone={event.timezone}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8 bg-gray-100 rounded-lg">
                    Tidak ada tiket yang tersedia untuk tanggal yang dipilih.
                  </p>
                )}
              </section>
            )}
          </div>

          {/* Floating/Sticky Booking Card Area (Right Side on LG+) - DESKTOP */}
          {event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
            <div className="hidden lg:block lg:w-1/3 mt-8 lg:mt-0">
              <div className="sticky top-24 bg-white p-6 rounded-xl border border-hegra-navy/10">
                <h3 className="text-xl font-jakarta font-bold text-hegra-navy mb-4">Ringkasan Pesanan</h3>
                {totalSelectedQuantity > 0 ? (
                  <div className="space-y-2 mb-4 text-sm">
                    {event.ticketCategories.map(cat => {
                      const qty = selectedTickets[cat.id] || 0;
                      if (qty === 0) return null;
                      return (
                        <div key={cat.id} className="flex justify-between items-center">
                          <span className="text-gray-700">{cat.name} (x{qty})</span>
                          <span className="font-medium text-gray-800">{formatCurrency(qty * cat.price)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 mt-2 flex justify-between items-center">
                      <span className="text-base font-semibold text-hegra-navy">Total</span>
                      <span className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">Pilih jenis dan jumlah tiket yang ingin Anda beli dari daftar di sebelah kiri.</p>
                )}

                <button 
                  onClick={handlePrimaryAction}
                  className="w-full bg-hegra-yellow text-hegra-navy font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                  disabled={totalSelectedQuantity > 0 && event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0)}
                >
                  {buttonIcon}
                  {buttonText}
                </button>
                {event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0) && (
                  <p className="text-xs text-red-600 mt-2 text-center">Beberapa tiket yang dipilih sudah habis.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      {event.name !== "AI FUTURE FEST - Menuju Indonesia 5.0" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-4 border-t border-gray-200 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Pesanan</p>
              <p className="text-xl font-bold text-hegra-yellow">{formatCurrency(totalPrice)}</p>
            </div>
            <button
              onClick={handlePrimaryAction}
              className="bg-hegra-yellow text-hegra-navy font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm"
              disabled={totalSelectedQuantity > 0 && event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0)}
            >
              {buttonIcon}
              {buttonText}
            </button>
          </div>
          {event.ticketCategories.some(cat => cat.availabilityStatus === 'sold-out' && (selectedTickets[cat.id] || 0) > 0) && (
              <p className="text-xs text-red-600 mt-1 text-center">Beberapa tiket yang dipilih sudah habis.</p>
          )}
        </div>
      )}

      {showTnCModal && (
        <TermsAndConditionsModal
          isOpen={showTnCModal}
          onConfirm={handleAcceptTnCAndProceed}
          onCancel={handleDeclineTnC}
          eventName={event.name}
        />
      )}
    </div>
  );
};

export default EventDetailPage;