/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventPage from './pages/EventPage';
import BusinessMatchingPage from './pages/BusinessMatchingPage';
import HelpPage from './pages/HelpPage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BusinessMatchingDashboardPage, { DashboardViewIdBM } from './pages/dashboard-bm/BusinessMatchingDashboardPage'; // New BM Dashboard
import EventDetailPage from './pages/EventDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentLoadingPage from './pages/PaymentLoadingPage';
import TransactionSuccessPage from './pages/TransactionSuccessPage';
import TicketDisplayPage from './pages/TicketDisplayPage';
import CreateEventInfoPage from './pages/CreateEventInfoPage';
import ArticleListPage from './pages/ArticleListPage';
import ConfirmationModal from './components/ConfirmationModal';
import SubscriptionModal from './components/SubscriptionModal';
import FloatingHelpButton from './components/FloatingHelpButton';
import AuthSelectionModal from './components/auth/AuthSelectionModal';
import CreatorAuthPage from './pages/CreatorAuthPage';
import OtpInputPage from './pages/OtpInputPage';
import OtpInputModal from './components/OtpInputModal'; // New OTP Modal
import Home from './Home';
import FullScreenLoader from './components/FullScreenLoader';
import { BusinessMatchingCardData } from './components/BusinessMatchingCard';
import CompanyDetailPage from './pages/business-matching/CompanyDetailPage';
import RoleSwitchModal from './components/RoleSwitchModal';
import OrganizationVerificationModal from './components/auth/OrganizationVerificationModal';
import { ShoppingCart, Users, UserCog, PlusCircle, AlertTriangle } from 'lucide-react';


// Define core data types here or import from a types file
export interface TicketCategory {
  id: string;
  name: string;
  categoryLabel?: string;
  price: number;
  description?: string;
  maxQuantity: number; // Changed from number | undefined
  ticketsPurchased?: number;
  availabilityStatus?: 'sold-out' | 'almost-sold' | 'available';
  useEventSchedule?: boolean;
  ticketStartDate?: string;
  ticketEndDate?: string;
  ticketStartTime?: string;
  ticketEndTime?: string;
  ticketIsTimeRange?: boolean;
  ticketTimezone?: 'WIB' | 'WITA' | 'WIT' | '';
}

export interface TicketCategoryWithEventInfo extends TicketCategory {
  eventId: number;
  eventName: string;
  eventDateDisplay: string; // Main event date
  eventTimeDisplay: string; // Main event time
  eventTimezone?: string; // Main event timezone
}

export interface EventData {
  id: number;
  category: 'B2C' | 'B2B' | 'B2G';
  name:string;
  location: string;
  posterUrl?: string;
  coverImageUrl?: string;
  summary?: string;
  googleMapsQuery?: string;
  dateDisplay: string;
  timeDisplay: string;
  timezone?: string;
  parkingAvailable?: boolean;
  ageRestriction?: string;
  arrivalInfo?: string;
  fullDescription: string;
  ticketCategories: TicketCategory[];
  displayPrice: string;
  organizerName?: string;
  organizerLogoUrl?: string;
  termsAndConditions?: string;
  status: 'Draf' | 'Aktif' | 'Selesai';
  theme: string;
  address: string;
  eventSlug?: string;
  narahubungName?: string;
  narahubungPhone?: string;
  narahubungEmail?: string;
  quotaProgress?: number;
  discountedPrice?: string;
}


export interface SelectedTicket {
  categoryId: string;
  categoryName: string;
  quantity: number;
  pricePerTicket: number;
}

export interface CheckoutInfo {
  event: EventData;
  selectedTickets: SelectedTicket[];
  totalPrice: number;
}

export interface TransactionFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  dateOfBirth?: string;
  additionalTicketHolders?: Array<{
    fullName: string;
    whatsAppNumber: string;
  }>;
}

export interface TransactionData {
  checkoutInfo: CheckoutInfo;
  formData: TransactionFormData;
  transactionId: string;
  orderId: string;
}


export type PageName =
  'landing' | 'events' | 'business' | 'help' |
  'login' | 'signup' | 'otpInput' | 'creatorAuth' |
  'dashboard' |
  'eventDetail' | 'checkout' |
  'paymentLoading' | 'transactionSuccess' | 'ticketDisplay' |
  'createEventInfo' |
  'articlesPage' |
  'businessDetail' |
  'home';

export type UserRole = 'visitor' | 'creator' | 'organization' | null;
export type AuthRoleType = "Event Visitor" | "Event Creator" | "Organization";

export const mapAuthRoleToUserRole = (authRole: AuthRoleType | UserRole): UserRole => {
  if (authRole === 'visitor' || authRole === 'creator' || authRole === 'organization') {
    return authRole;
  }
  switch (authRole) {
    case "Event Visitor": return "visitor";
    case "Event Creator": return "creator";
    case "Organization": return "organization";
    default: return null;
  }
};

interface PendingNavigationTarget {
  page: PageName;
  data?: any;
  resetCallback?: () => void;
}

export function formatEventTime(timeDisplay: string | undefined, timezone?: string | undefined): string {
  if (!timeDisplay || typeof timeDisplay !== 'string') return 'Informasi waktu tidak tersedia';

  const originalTimeDisplay = timeDisplay;
  let processedTimeDisplay = timeDisplay.replace(/^Mulai\s+/i, '').trim();
  let tzSuffix = timezone ? ` ${timezone.toUpperCase()}` : '';

  const timezoneRegex = /\b(WIB|WITA|WIT)\b/i;
  const tzMatch = processedTimeDisplay.match(timezoneRegex);
  if (tzMatch) {
    tzSuffix = ` ${tzMatch[0].toUpperCase()}`;
    processedTimeDisplay = processedTimeDisplay.replace(timezoneRegex, '').trim();
  }

  const extraInfoRegex = /\s*\(([^)]+)\)\s*$/;
  let extraInfo = '';
  const extraMatch = processedTimeDisplay.match(extraInfoRegex);
  if (extraMatch) {
    extraInfo = ` (${extraMatch[1].trim()})`;
    processedTimeDisplay = processedTimeDisplay.replace(extraInfoRegex, '').trim();
  }

  const timePattern = /(\d{1,2}:\d{2})/;

  if (processedTimeDisplay.includes(' - ')) {
    const parts = processedTimeDisplay.split(/\s+-\s+/);
    const startTimeMatch = parts[0].match(timePattern);

    if (startTimeMatch) {
      const startTime = startTimeMatch[0];
      let endTimeStr = parts[1].trim();

      if (endTimeStr.match(timePattern)) {
        return `${startTime} - ${endTimeStr}${tzSuffix}${extraInfo}`;
      } else if (endTimeStr.toLowerCase() === 'selesai') {
        return `${startTime} - Selesai${tzSuffix}${extraInfo}`;
      } else {
        return `${startTime} - Selesai${tzSuffix}${extraInfo}`;
      }
    }
  } else {
    const singleTimeMatch = processedTimeDisplay.match(timePattern);
    if (singleTimeMatch && processedTimeDisplay.trim() === singleTimeMatch[0]) {
      return `${singleTimeMatch[0]} - Selesai${tzSuffix}${extraInfo}`;
    }
  }
  return `${originalTimeDisplay}`;
}

export const formatDisplayDate = (dateDisplayString: string | undefined): string => {
  if (!dateDisplayString) return 'Tanggal tidak tersedia';

  const parts = dateDisplayString.split(' - ');

  const formatDatePart = (part: string): Date | null => {
    // Handles YYYY/MM/DD and YYYY-MM-DD
    const cleanedPart = part.replace(/\//g, '-');
    const dateParts = cleanedPart.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  if (parts.length === 1) {
    const date = formatDatePart(parts[0]);
    return date ? date.toLocaleDateString('id-ID', options) : dateDisplayString;
  } else if (parts.length === 2) {
    const startDate = formatDatePart(parts[0]);
    const endDate = formatDatePart(parts[1]);

    if (startDate && endDate) {
      if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endDate.toLocaleDateString('id-ID', options)}`;
      } else if (startDate.getFullYear() === endDate.getFullYear()) {
        const startOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
        return `${startDate.toLocaleDateString('id-ID', startOptions)} - ${endDate.toLocaleDateString('id-ID', options)}`;
      } else {
        return `${startDate.toLocaleDateString('id-ID', options)} - ${endDate.toLocaleDateString('id-ID', options)}`;
      }
    }
  }
  return dateDisplayString; // Fallback
};

const sampleEventsInitial: (Omit<EventData, 'ticketCategories'> & { ticketCategories: Array<Partial<TicketCategory> & {id: string; name: string; price: number; maxQuantity?:number}> })[] = [
  {
    id: 1, category: 'B2C', name: 'Local Soundscape: Indie Music Night',
    location: 'Rooftop ITC Depok', posterUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/06/28 - 2025/06/29', timeDisplay: '15:00 - 22:00', timezone: 'WIB',
    fullDescription: 'Nikmati malam penuh alunan musik indie dari band-band lokal berbakat di Depok. Suasana rooftop yang cozy dengan city view menawan. Tersedia berbagai tenant makanan dan minuman.',
    ticketCategories: [
      { id: 'regular', name: 'Regular', price: 75000, description: 'Akses masuk reguler.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 200, ticketsPurchased: 25 },
      { id: 'vip', name: 'VIP', price: 150000, description: 'Akses VIP, free drink, dan merchandise.', availabilityStatus: 'almost-sold', useEventSchedule: true, maxQuantity: 50, ticketsPurchased: 48 }
    ],
    displayPrice: 'Rp 75.000',
    organizerName: 'Kolektif Musik Depok',
    organizerLogoUrl: 'https://picsum.photos/seed/kmd/50/50',
    summary: 'Konser musik indie dengan suasana rooftop dan pemandangan kota.',
    googleMapsQuery: 'ITC Depok, Jawa Barat',
    parkingAvailable: true, ageRestriction: '18+', arrivalInfo: 'Pintu masuk dari Lobby Utara ITC Depok, naik lift ke lantai paling atas.',
    status: 'Aktif', theme: 'Konser Musik', address: 'Jl. Margonda Raya No.56, Depok, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16431',
    termsAndConditions: 'Dilarang membawa makanan dan minuman dari luar. Dilarang membawa senjata tajam dan obat-obatan terlarang. Tiket yang sudah dibeli tidak dapat dikembalikan.',
    eventSlug: 'local-soundscape-depok', narahubungName: 'Panitia Soundscape', narahubungPhone: '081200001111', narahubungEmail: 'info@localsound.id'
  },
  {
    id: 2, category: 'B2B', name: 'Creator Connect 2025',
    location: 'Margo City Depok', posterUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/07/19', timeDisplay: '09:00 - 17:00', timezone: 'WIB',
    fullDescription: 'Konferensi tahunan untuk para content creator, influencer, dan agensi. Sesi networking, workshop, dan diskusi panel dengan para ahli di industri kreatif digital.',
    ticketCategories: [
      { id: 'early-bird-creator', name: 'Early Bird Creator Pass', price: 200000, description: 'Akses semua sesi, berlaku hingga 30 Juni.', availabilityStatus: 'sold-out', useEventSchedule: true, maxQuantity: 100, ticketsPurchased: 100 },
      { id: 'creator-pass', name: 'Creator Pass', price: 250000, description: 'Akses semua sesi konferensi.', availabilityStatus: 'available', useEventSchedule: false, ticketStartDate: '2025-07-01', ticketEndDate: '2025-07-19', ticketStartTime: '08:00', ticketEndTime: '18:00', ticketIsTimeRange: true, ticketTimezone: 'WIB', maxQuantity: 300, ticketsPurchased: 5 },
      { id: 'business-pass', name: 'Business Pass', price: 500000, description: 'Akses semua sesi + area networking B2B.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 150, ticketsPurchased: 0 }
    ],
    displayPrice: 'Mulai Rp 250.000',
    organizerName: 'Hegira Event Management',
    organizerLogoUrl: '/image/hegiralogo.png',
    summary: 'Konferensi networking dan workshop untuk content creator & influencer.',
    googleMapsQuery: 'Margo City, Depok',
    parkingAvailable: true, ageRestriction: '17+', arrivalInfo: 'Registrasi di Main Atrium Margo City, lantai dasar.',
    status: 'Aktif', theme: 'Konferensi & Workshop', address: 'Jl. Margonda Raya No.358, Kemiri Muka, Kecamatan Beji, Kota Depok, Jawa Barat 16423',
    eventSlug: 'creator-connect-2025', narahubungName: 'Tim Hegira Events', narahubungPhone: '081211112222', narahubungEmail: 'events@hegira.com'
  },
  {
    id: 3, category: 'B2G', name: 'Forum Digitalisasi UMKM Nasional',
    location: 'Hotel Indonesia Kempinski, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/08/25 - 2025/08/26', timeDisplay: '08:30 - 17:00', timezone: 'WIB',
    fullDescription: 'Forum strategis yang mempertemukan perwakilan pemerintah, pelaku UMKM, dan penyedia teknologi untuk akselerasi transformasi digital UMKM di Indonesia. Diskusi kebijakan, showcase solusi, dan business matching.',
    ticketCategories: [
      { id: 'umkm-delegate', name: 'Delegasi UMKM', price: 0, description: 'Gratis untuk UMKM terpilih (perlu registrasi & seleksi).', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 500, ticketsPurchased: 120 },
      { id: 'gov-delegate', name: 'Delegasi Pemerintah', price: 0, description: 'Khusus perwakilan instansi pemerintah.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 200, ticketsPurchased: 50 },
      { id: 'tech-provider', name: 'Penyedia Teknologi/Umum', price: 750000, description: 'Akses ke semua sesi dan area pameran.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 100, ticketsPurchased: 30 }
    ],
    displayPrice: 'Gratis / Rp 750.000',
    organizerName: 'Kementerian Koperasi dan UKM & Hegira',
    organizerLogoUrl: 'https://picsum.photos/seed/kemenkop/50/50',
    summary: 'Forum pemerintah & UMKM untuk akselerasi transformasi digital.',
    googleMapsQuery: 'Hotel Indonesia Kempinski Jakarta',
    status: 'Draf', theme: 'Forum & Pameran', address: 'Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10310',
    eventSlug: 'forum-umkm-digital-2025', narahubungName: 'Sekretariat Forum', narahubungPhone: '0215550011', narahubungEmail: 'info@forumumkm.go.id'
  },
   {
    id: 4, category: 'B2C', name: 'Pameran Seni Kontemporer "RuangRupa"',
    location: 'Galeri Nasional Indonesia, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/09/05 - 2025/09/15', timeDisplay: '10:00 - 19:00', timezone: 'WIB',
    fullDescription: 'Pameran seni rupa kontemporer yang menampilkan karya-karya terbaru dari seniman muda Indonesia. Instalasi, lukisan, patung, dan seni media baru.',
    ticketCategories: [
      { id: 'student-pass', name: 'Pelajar/Mahasiswa', price: 25000, description: 'Wajib menunjukkan kartu pelajar/mahasiswa aktif.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 1000, ticketsPurchased: 250 },
      { id: 'general-admission', name: 'Umum', price: 50000, description: 'Tiket masuk reguler.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 2000, ticketsPurchased: 500 }
    ],
    displayPrice: 'Mulai Rp 25.000',
    organizerName: 'Komunitas Seniman Jakarta',
    organizerLogoUrl: 'https://picsum.photos/seed/ksj/50/50',
    summary: 'Pameran karya seni kontemporer dari seniman muda Indonesia.',
    googleMapsQuery: 'Galeri Nasional Indonesia',
    status: 'Aktif', theme: 'Pameran Seni', address: 'Jl. Medan Merdeka Tim. No.14, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110',
    eventSlug: 'ruangrupa-art-exhibition', narahubungName: 'Kurator Pameran', narahubungPhone: '085678901234', narahubungEmail: 'ruangrupa@artmail.com'
  },
  {
    id: 14, category: 'B2C', name: 'Cita Rasa Nusantara Food Festival',
    location: 'Lapangan Banteng, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/09/20 - 2025/09/22', timeDisplay: '11:00 - 21:00', timezone: 'WIB',
    fullDescription: 'Festival kuliner terbesar yang menyajikan kelezatan hidangan dari seluruh penjuru Nusantara. Lebih dari 100 tenant makanan, demo masak, dan pertunjukan budaya.',
    ticketCategories: [
      { id: 'entry-voucher-50k', name: 'Voucher Masuk + Kuliner Rp 50.000', price: 50000, description: 'Termasuk voucher makan senilai Rp 50.000.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 5000, ticketsPurchased: 1500 },
      { id: 'entry-voucher-100k', name: 'Voucher Masuk + Kuliner Rp 100.000', price: 90000, description: 'Termasuk voucher makan senilai Rp 100.000 (Hemat Rp 10.000).', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 3000, ticketsPurchased: 800 },
    ],
    displayPrice: 'Mulai Rp 50.000',
    organizerName: 'Hegira Culinary',
    organizerLogoUrl: '/image/hegiralogo.png',
    summary: 'Festival kuliner Nusantara dengan ratusan tenant dan demo masak.',
    googleMapsQuery: 'Lapangan Banteng Jakarta',
    status: 'Aktif', theme: 'Festival Kuliner', address: 'Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta',
    eventSlug: 'cita-rasa-nusantara-fest', narahubungName: 'Tim Kuliner Hegira', narahubungPhone: '081233334444', narahubungEmail: 'foodfest@hegira.com'
  },
  {
    id: 101, category: 'B2C', name: 'Jakarta Culinary Expo 2025', // Event used in dashboard examples
    location: 'JIExpo Kemayoran', posterUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/11/01 - 2025/11/03', timeDisplay: '10:00 - 21:00', timezone: 'WIB',
    fullDescription: 'Pameran kuliner terbesar se-Asia Tenggara. Menampilkan chef ternama, workshop memasak, dan ratusan tenant makanan lezat.',
    ticketCategories: [
      { id: 'daily-pass-jce', name: 'Daily Pass', price: 75000, availabilityStatus: 'available', maxQuantity: 1000, ticketsPurchased: 10 }, // Dummy purchased
      { id: '3day-pass-jce', name: '3-Day Pass', price: 200000, availabilityStatus: 'available', maxQuantity: 500, ticketsPurchased: 50 },
    ], displayPrice: 'Rp 75.000',
    organizerName: 'Creator Hegira', summary: 'Pameran kuliner akbar dengan chef internasional.', googleMapsQuery: 'JIExpo Kemayoran',
    parkingAvailable: true, ageRestriction: 'Semua Umur', arrivalInfo: 'Gunakan pintu masuk Hall C.',
    status: 'Aktif', theme: 'Pameran Kuliner', address: 'JIExpo Kemayoran, Jakarta Pusat',
    termsAndConditions: 'Dilarang membawa makanan dari luar. Voucher makanan tersedia.', eventSlug: 'jakarta-culinary-expo-2025', narahubungName: 'Creator Hegira', narahubungEmail:'info@jce.com', narahubungPhone:'+62812FOODFEST'
  },
  {
    id: 15, category: 'B2C', name: 'Hegira E-Champions Cup 2025',
    location: 'Online & BritAma Arena, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1580234810449-768879425721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1580234810449-768879425721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/12/01 - 2025/12/15', timeDisplay: 'Sesuai Jadwal Pertandingan', timezone: 'WIB',
    fullDescription: 'Turnamen e-sport bergengsi yang mempertandingkan game-game populer. Babak kualifikasi online dan grand final offline di BritAma Arena. Total hadiah ratusan juta rupiah!',
    ticketCategories: [
      { id: 'player-reg', name: 'Registrasi Pemain (per tim)', price: 250000, description: 'Untuk tim yang ingin berpartisipasi.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 128, ticketsPurchased: 60 },
      { id: 'spectator-online', name: 'Tiket Nonton Online (Kualifikasi)', price: 0, description: 'Gratis nonton babak kualifikasi via streaming.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 10000, ticketsPurchased: 5000 },
      { id: 'spectator-venue-gf', name: 'Tiket Nonton Grand Final (Venue)', price: 100000, description: 'Nonton langsung Grand Final di BritAma Arena.', availabilityStatus: 'almost-sold', useEventSchedule: true, maxQuantity: 1000, ticketsPurchased: 950 },
    ],
    displayPrice: 'Gratis / Mulai Rp 100.000',
    organizerName: 'Hegira Gaming Division',
    organizerLogoUrl: '/image/hegiralogo.png',
    summary: 'Turnamen e-sport dengan kualifikasi online dan grand final offline.',
    googleMapsQuery: 'BritAma Arena Jakarta',
    status: 'Selesai', theme: 'Turnamen E-Sport', address: 'Jl. Raya Kelapa Nias, Kelapa Gading Tim., Kec. Klp. Gading, Jkt Utara, Daerah Khusus Ibukota Jakarta 14240',
    eventSlug: 'hegira-echampions-cup-2025', narahubungName: 'Panitia E-Sport Hegira', narahubungPhone: '089988887777', narahubungEmail: 'esports@hegira.com'
  }
];

const sampleEvents: EventData[] = sampleEventsInitial.map(event => ({
  ...event,
  category: event.category as EventData['category'],
  ticketCategories: event.ticketCategories.map(tc => ({
    id: tc.id,
    name: tc.name,
    price: tc.price,
    description: tc.description,
    maxQuantity: tc.maxQuantity || 100,
    ticketsPurchased: tc.ticketsPurchased === undefined ? Math.floor(Math.random() * (tc.maxQuantity || 100)) : tc.ticketsPurchased,
    availabilityStatus: tc.availabilityStatus || 'available',
    useEventSchedule: tc.useEventSchedule === undefined ? true : tc.useEventSchedule,
    ticketStartDate: tc.ticketStartDate,
    ticketEndDate: tc.ticketEndDate,
    ticketStartTime: tc.ticketStartTime,
    ticketEndTime: tc.ticketEndTime,
    ticketIsTimeRange: tc.ticketIsTimeRange === undefined ? true : tc.ticketIsTimeRange,
    ticketTimezone: tc.ticketTimezone || '',
  }))
}));


const HegiraApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('landing');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutInfo | null>(null);
  const [transactionResult, setTransactionResult] = useState<TransactionData | null>(null);
  const [allEventsData, setAllEventsData] = useState<EventData[]>(sampleEvents);
  const [eventBeingEdited, setEventBeingEdited] = useState<EventData | null>(null);
  const [currentConfirmationTarget, setCurrentConfirmationTarget] = useState<PendingNavigationTarget | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalConfig, setConfirmationModalConfig] = useState<{ title: string; message: string; confirmText: string; cancelText: string; icon?: React.ElementType; iconColorClass?: string; confirmButtonClass?: string }>({ title: '', message: '', confirmText: 'Ya', cancelText: 'Tidak', icon: undefined, iconColorClass: undefined, confirmButtonClass: undefined });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');

  const [isAuthSelectionModalOpen, setIsAuthSelectionModalOpen] = useState(false);
  const [authPageToShow, setAuthPageToShow] = useState<'login' | 'signup' | 'otpInput' | 'creatorAuth' | null>(null);
  const [showOtpModalForVisitor, setShowOtpModalForVisitor] = useState(false);
  const [activeAuthRole, setActiveAuthRole] = useState<AuthRoleType | null>(null);
  const [userEmailForOtpContext, setUserEmailForOtpContext] = useState('');
  const [userNameForOtpContext, setUserNameForOtpContext] = useState<string | undefined>(undefined);
  const [postLoginRedirect, setPostLoginRedirect] = useState<PendingNavigationTarget | null>(null);


  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);
  const [isOrganizationVerificationModalOpen, setIsOrganizationVerificationModalOpen] = useState(false);
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<UserRole | null>(null);

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memuat...');


  const openSubscriptionModal = () => setIsSubscriptionModalOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionModalOpen(false);

  const handleAddNewEvent = (newEvent: EventData) => {
    setAllEventsData(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleUpdateExistingEvent = (updatedEvent: EventData) => {
    setAllEventsData(prevEvents =>
      prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
    if (eventBeingEdited && eventBeingEdited.id === updatedEvent.id) {
      setEventBeingEdited(updatedEvent);
    }
  };

  const handleSetEventForEditing = (event: EventData | null) => {
    setEventBeingEdited(event);
  };

  const handleNavigateRequestWithConfirmation = useCallback((targetPage: PageName, targetData?: any, resetCallback?: () => void) => {
    let modalTitle = "Konfirmasi Navigasi";
    let modalMessage = "Anda memiliki item di keranjang atau data yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan Anda akan hilang.";
    let confirmBtnText = "Ya, Tinggalkan";
    let cancelBtnText = "Tidak, Tetap di Sini";
    let icon: React.ElementType | undefined = AlertTriangle;
    let iconColor = "text-yellow-500";
    let confirmBtnClass = "bg-yellow-500 hover:bg-yellow-600 text-white";

    if (targetPage === 'checkout' && currentConfirmationTarget?.page === 'paymentLoading') {
      modalTitle = "Batalkan Pembayaran?";
      modalMessage = "Apakah Anda yakin ingin membatalkan proses pembayaran dan kembali ke halaman checkout? Pesanan Anda belum selesai.";
      confirmBtnText = "Ya, Batalkan";
      iconColor = "text-red-500";
      confirmBtnClass = "bg-red-600 hover:bg-red-700 text-white";
    }

    setConfirmationModalConfig({ title: modalTitle, message: modalMessage, confirmText: confirmBtnText, cancelText: cancelBtnText, icon: icon, iconColorClass: iconColor, confirmButtonClass: confirmBtnClass });
    setCurrentConfirmationTarget({ page: targetPage, data: targetData, resetCallback });
    setIsConfirmationModalOpen(true);
  }, [currentConfirmationTarget]);

  const handleConfirmNavigation = () => {
    if (currentConfirmationTarget) {
      if (currentConfirmationTarget.resetCallback) {
        currentConfirmationTarget.resetCallback();
      }
      navigate(currentConfirmationTarget.page, currentConfirmationTarget.data);
    }
    setIsConfirmationModalOpen(false);
    setCurrentConfirmationTarget(null);
  };

  const handleCancelNavigation = () => {
    setIsConfirmationModalOpen(false);
    setCurrentConfirmationTarget(null);
  };

  const navigate = useCallback((page: PageName, data?: any) => {
    setIsAppLoading(true);
    setLoadingMessage(page === 'landing' ? 'Kembali ke Beranda...' : `Menuju ${page}...`);

    setTimeout(() => {
      if (page === 'creatorAuth') {
        setActiveAuthRole("Event Creator");
        setAuthPageToShow('creatorAuth');
      }


      if (page === 'eventDetail' && data) {
        setSelectedEvent(data as EventData);
      } else if (page === 'checkout' && data) {
        setCheckoutData(data as CheckoutInfo);
      } else if (page === 'transactionSuccess' && transactionResult) {
        // Data is already in transactionResult
      } else if (page === 'ticketDisplay' && transactionResult) {
        // Data is already in transactionResult
      } else if (page === 'businessDetail' && data) {
        // setSelectedCompanyForDetail(data as BusinessMatchingCardData);
      }


      if (page !== 'login' && page !== 'signup' && page !== 'otpInput' && page !== 'creatorAuth' && page !== 'paymentLoading') {
        setAuthPageToShow(null);
        setIsAuthSelectionModalOpen(false);
        setShowOtpModalForVisitor(false);
      }
      
      window.scrollTo(0, 0);
      setCurrentPage(page);
      setIsAppLoading(false);
    }, 300);
  }, [transactionResult, isLoggedIn]);


  const handleLogin = (role: UserRole, name?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    const loggedInName = name || (role === 'visitor' ? 'Pengunjung Hegira' : role === 'creator' ? 'Kreator Event' : 'Organisasi Hegira');
    setUserName(loggedInName);
    // Persist email context from signup/login for the session
    const loggedInEmail = userEmailForOtpContext || `${role}@hegira.com`;
    setUserEmailForOtpContext(loggedInEmail); 

    setAuthPageToShow(null);
    setShowOtpModalForVisitor(false);
    setIsAuthSelectionModalOpen(false);
    
    if (postLoginRedirect) {
      navigate(postLoginRedirect.page, postLoginRedirect.data);
      setPostLoginRedirect(null);
    } else if (role === 'creator' || role === 'organization') {
        navigate('dashboard');
    } else {
        navigate('landing');
    }
  };

  const handleLogout = () => {
    const logoutConfig = {
      title: "Konfirmasi Logout",
      message: "Apakah Anda yakin ingin keluar dari akun Anda?",
      confirmText: "Ya, Logout",
      cancelText: "Batal",
      icon: AlertTriangle,
      iconColorClass: "text-yellow-500",
      confirmButtonClass: "bg-yellow-500 hover:bg-yellow-600 text-white"
    };
    setConfirmationModalConfig(logoutConfig);
    setCurrentConfirmationTarget({
      page: 'landing',
      resetCallback: () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName('');
        setActiveAuthRole(null);
        setAuthPageToShow(null);
        setShowOtpModalForVisitor(false);
        setIsRoleSwitchModalOpen(false);
        setIsOrganizationVerificationModalOpen(false);
        setUserEmailForOtpContext('');
      }
    });
    setIsConfirmationModalOpen(true);
  };


  const handleOpenAuthModal = (selectedAuthRole?: AuthRoleType, redirect?: PendingNavigationTarget) => {
    if (redirect) {
      setPostLoginRedirect(redirect);
    } else {
      setPostLoginRedirect(null); // Clear previous redirect if none is provided
    }

    if (selectedAuthRole) {
      setActiveAuthRole(selectedAuthRole);
      setAuthPageToShow('login');
      setIsAuthSelectionModalOpen(false);
    } else {
      setIsAuthSelectionModalOpen(true);
    }
  };

  const handleSelectRoleFromAuthModal = (role: AuthRoleType) => {
    setActiveAuthRole(role);
    setIsAuthSelectionModalOpen(false);
    if (role === "Event Creator") {
      navigate('creatorAuth');
    } else {
      setAuthPageToShow('login');
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    handleLogin(role, userNameForOtpContext || (role === 'visitor' ? "Pengunjung Baru" : (role === 'creator' ? "Kreator Baru" : "Organisasi Baru")));
    setUserNameForOtpContext(undefined);
  };

  const handleGenericSignupSuccess = (email: string, name?: string) => {
    setUserEmailForOtpContext(email);
    setUserNameForOtpContext(name);
    
    if (activeAuthRole === "Event Visitor") {
        setAuthPageToShow(null);
        setShowOtpModalForVisitor(true);
    } else {
        setAuthPageToShow('otpInput');
    }
  };

  const handleOtpVerificationSuccess = (verifiedEmail: string, verifiedName?: string) => {
    const roleToSet = activeAuthRole ? mapAuthRoleToUserRole(activeAuthRole) : 'visitor';
    handleLogin(roleToSet, verifiedName || (roleToSet === 'visitor' ? "Pengunjung Baru" : (roleToSet === 'creator' ? "Kreator Baru" : "Organisasi Baru")) );
    setShowOtpModalForVisitor(false);
    setAuthPageToShow(null);
  };
  
  const handleResendOtp = () => {
    console.log(`Resending OTP to ${userEmailForOtpContext}`);
  };

  const handleChangeEmailForOtp = () => {
    if (showOtpModalForVisitor) {
      setShowOtpModalForVisitor(false);
      setActiveAuthRole("Event Visitor");
      setAuthPageToShow('signup');
    } else {
      setAuthPageToShow('creatorAuth');
    }
  };
  
  const handleCloseAuthFlow = () => {
    setIsAuthSelectionModalOpen(false);
    setAuthPageToShow(null);
    setActiveAuthRole(null);
    setShowOtpModalForVisitor(false);
    setIsRoleSwitchModalOpen(false);
    setIsOrganizationVerificationModalOpen(false);
    setPostLoginRedirect(null); // Clear redirect on close
    navigate('landing');
  };

  const handleSwitchToSignup = () => {
    setAuthPageToShow('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthPageToShow('login');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'organization') {
      setPendingRoleSwitch(newRole);
      setIsRoleSwitchModalOpen(false);
      setIsOrganizationVerificationModalOpen(true);
    } else {
      handleLogin(newRole, newRole === 'creator' ? 'Kreator Hegira' : 'Pengunjung Hegira');
      setIsRoleSwitchModalOpen(false);
    }
  };

  const handleOrganizationVerificationSuccess = (verificationCode: string) => {
    console.log("Organization verified with code:", verificationCode);
    setIsOrganizationVerificationModalOpen(false);
    if (pendingRoleSwitch === 'organization') {
      handleLogin('organization', 'Nama Organisasi Anda');
    }
    setPendingRoleSwitch(null);
  };
  
  const handleCloseOrganizationVerification = () => {
    setIsOrganizationVerificationModalOpen(false);
    setPendingRoleSwitch(null);
  };

  const handleProcessPayment = (formData: TransactionFormData, checkoutDataWithFinalPrice: CheckoutInfo) => {
    const newTransactionId = `TRX-HEGIRA-${Date.now().toString().slice(-8)}`;
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;

    const newTransactionData: TransactionData = {
        checkoutInfo: checkoutDataWithFinalPrice,
        formData: formData,
        transactionId: newTransactionId,
        orderId: newOrderId,
    };
    setTransactionResult(newTransactionData);
    navigate('paymentLoading');
  };

  const loggedInUserEmail = userEmailForOtpContext || (isLoggedIn ? `${userRole}@hegira.com` : '');
  const loggedInUserData = isLoggedIn ? {
      fullName: userName,
      email: loggedInUserEmail,
      gender: 'Laki-laki', // Hardcoded as per sample
      dateOfBirth: '1990-01-15', // Hardcoded as per sample
  } : undefined;


  const renderPage = () => {
    if (isAppLoading && currentPage !== 'paymentLoading') return <FullScreenLoader />;
    
    switch (currentPage) {
      case 'landing': return <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal} />;
      case 'events': return <EventPage events={allEventsData.filter(e => e.status === 'Aktif')} onNavigate={navigate} />;
      case 'business': return <BusinessMatchingPage onNavigate={navigate} />;
      case 'help': return <HelpPage />;
      case 'dashboard':
        if (!isLoggedIn || !userRole) {
          navigate('landing'); return null;
        }
        if (userRole === 'organization') {
          return <BusinessMatchingDashboardPage onNavigate={navigate} onLogout={handleLogout} userName={userName} userRole={userRole} onOpenRoleSwitchModal={() => setIsRoleSwitchModalOpen(true)} />;
        } else {
          return <DashboardPage
                    userRole={userRole}
                    userName={userName}
                    onNavigate={navigate}
                    onLogout={handleLogout}
                    allEvents={allEventsData}
                    onAddNewEvent={handleAddNewEvent}
                    eventBeingEdited={eventBeingEdited}
                    onSetEventForEditing={handleSetEventForEditing}
                    onUpdateExistingEvent={handleUpdateExistingEvent}
                    onOpenRoleSwitchModal={() => setIsRoleSwitchModalOpen(true)}
                  />;
        }
      case 'eventDetail': return selectedEvent ? <EventDetailPage event={selectedEvent} onNavigate={navigate} onNavigateRequestWithConfirmation={handleNavigateRequestWithConfirmation}/> : <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal} />;
      case 'checkout': return checkoutData ? <CheckoutPage checkoutInfo={checkoutData} eventForBackNav={checkoutData.event} onNavigate={navigate} onProcessPayment={handleProcessPayment} isLoggedIn={isLoggedIn} loggedInUserData={loggedInUserData} onOpenLoginModal={(role) => handleOpenAuthModal(role, { page: 'checkout', data: checkoutData })} formatDisplayDate={formatDisplayDate} formatEventTime={formatEventTime} /> : <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal}/>;
      case 'paymentLoading': return transactionResult ? <PaymentLoadingPage onNavigate={navigate} onNavigateRequestWithConfirmation={handleNavigateRequestWithConfirmation} checkoutInfoToReturnTo={transactionResult.checkoutInfo} /> : <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal}/>;
      case 'transactionSuccess': return transactionResult ? <TransactionSuccessPage transactionData={transactionResult} onNavigate={navigate} /> : <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal}/>;
      case 'ticketDisplay': return transactionResult ? <TicketDisplayPage transactionData={transactionResult} onNavigate={navigate}/> : <LandingPage heroEvents={allEventsData.slice(0,3)} featuredEvents={allEventsData.slice(0,6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal}/>;
      case 'createEventInfo': return <CreateEventInfoPage onNavigate={navigate} onOpenAuthModal={() => handleOpenAuthModal()} isLoggedIn={isLoggedIn} userRole={userRole} />;
      case 'articlesPage': return <ArticleListPage onNavigate={navigate} />;
      case 'businessDetail': return selectedEvent ? <CompanyDetailPage company={selectedEvent as unknown as BusinessMatchingCardData} onNavigate={navigate} /> : <BusinessMatchingPage onNavigate={navigate} />;
      case 'creatorAuth':
        if (authPageToShow === 'otpInput' && activeAuthRole && activeAuthRole !== "Event Visitor") {
            return null;
        }
        return <CreatorAuthPage
                  initialMode="signup"
                  onNavigate={navigate}
                  onLoginSuccess={(name) => handleLogin('creator', name)}
                  onSignupSuccess={handleGenericSignupSuccess}
               />;
      case 'otpInput':
        if (authPageToShow !== 'otpInput' || !userEmailForOtpContext) {
          navigate('landing');
          return null;
        }
        return <OtpInputPage
                    email={userEmailForOtpContext}
                    userName={userNameForOtpContext}
                    onVerifySuccess={handleOtpVerificationSuccess}
                    onResendOtp={handleResendOtp}
                    onChangeEmail={handleChangeEmailForOtp}
                    onNavigate={navigate}
                />;
      case 'home': return <Home onNavigate={navigate} />;
      default: return <LandingPage heroEvents={allEventsData.slice(0, 3)} featuredEvents={allEventsData.slice(0, 6)} onNavigate={navigate} onOpenLoginModal={() => handleOpenAuthModal()} openSubscriptionModal={openSubscriptionModal} />;
    }
  };
  
  const pagesWithoutNavFooter: PageName[] = ['paymentLoading'];
  const dashboardPages: PageName[] = ['dashboard'];
  const authFullScreenPages: PageName[] = ['creatorAuth', 'otpInput'];
  const isFullScreenPage = pagesWithoutNavFooter.includes(currentPage) ||
                           dashboardPages.includes(currentPage) ||
                           (authFullScreenPages.includes(currentPage) && authPageToShow === currentPage);

  const hideNavbar = isFullScreenPage || (authPageToShow === 'otpInput' && currentPage === 'creatorAuth');
  const hideFooter = isFullScreenPage ||
                     currentPage === 'eventDetail' || currentPage === 'checkout' || currentPage === 'transactionSuccess' ||
                     (authPageToShow === 'otpInput' && currentPage === 'creatorAuth');

  return (
    <>
      {!hideNavbar && (
        <Navbar
          onNavigate={navigate}
          currentPage={currentPage}
          isLoggedIn={isLoggedIn}
          userRole={userRole!}
          userName={userName}
          onLogout={handleLogout}
          onOpenAuthModal={() => handleOpenAuthModal()}
          onOpenRoleSwitchModal={() => setIsRoleSwitchModalOpen(true)}
        />
      )}
      <div className={!hideNavbar ? "pt-20" : ""}>
        {renderPage()}
      </div>
      {!hideFooter && (
        <Footer onNavigate={navigate} currentPage={currentPage} />
      )}
      {!hideNavbar && <FloatingHelpButton onNavigate={navigate} />}

      {isAuthSelectionModalOpen && (
        <AuthSelectionModal
          isOpen={isAuthSelectionModalOpen}
          onClose={handleCloseAuthFlow}
          onSelectRole={handleSelectRoleFromAuthModal}
        />
      )}

      {authPageToShow === 'login' && activeAuthRole && activeAuthRole !== "Event Creator" && (
        <LoginPage
          role={activeAuthRole}
          onLoginSuccess={(role) => handleLoginSuccess(role)}
          onClose={handleCloseAuthFlow}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      
      {authPageToShow === 'signup' && activeAuthRole && activeAuthRole !== "Event Creator" && (
        <SignupPage
          role={activeAuthRole}
          onSignupSuccess={handleGenericSignupSuccess}
          setUserEmailForVerification={setUserEmailForOtpContext}
          onClose={handleCloseAuthFlow}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      
      {showOtpModalForVisitor && userEmailForOtpContext && (
        <OtpInputModal
          isOpen={showOtpModalForVisitor}
          email={userEmailForOtpContext}
          onVerifySuccess={(verifiedEmail) => handleOtpVerificationSuccess(verifiedEmail)}
          onResendOtp={handleResendOtp}
          onChangeEmail={handleChangeEmailForOtp}
          onClose={handleCloseAuthFlow}
        />
      )}

      {authPageToShow === 'otpInput' && activeAuthRole && activeAuthRole !== "Event Visitor" && userEmailForOtpContext && currentPage !== 'otpInput' && (
        <OtpInputPage
            email={userEmailForOtpContext}
            userName={userNameForOtpContext}
            onVerifySuccess={handleOtpVerificationSuccess}
            onResendOtp={handleResendOtp}
            onChangeEmail={handleChangeEmailForOtp}
            onNavigate={navigate}
        />
       )}


      {isConfirmationModalOpen && currentConfirmationTarget && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          title={confirmationModalConfig.title}
          message={confirmationModalConfig.message}
          confirmText={confirmationModalConfig.confirmText}
          cancelText={confirmationModalConfig.cancelText}
          onConfirm={handleConfirmNavigation}
          onCancel={handleCancelNavigation}
          icon={confirmationModalConfig.icon}
          iconColorClass={confirmationModalConfig.iconColorClass}
          confirmButtonClass={confirmationModalConfig.confirmButtonClass}
        />
      )}
      
      {isRoleSwitchModalOpen && (
        <RoleSwitchModal
          isOpen={isRoleSwitchModalOpen}
          currentUserRole={userRole}
          onSwitchRole={handleSwitchRole}
          onClose={() => setIsRoleSwitchModalOpen(false)}
        />
      )}

      {isOrganizationVerificationModalOpen && (
        <OrganizationVerificationModal
          isOpen={isOrganizationVerificationModalOpen}
          onClose={handleCloseOrganizationVerification}
          onVerifySuccess={handleOrganizationVerificationSuccess}
          contextText="Verifikasi untuk Akses Organisasi"
        />
      )}

      {isSubscriptionModalOpen && (
        <SubscriptionModal 
          isOpen={isSubscriptionModalOpen}
          onClose={closeSubscriptionModal}
          onSubscribe={closeSubscriptionModal} // For now, subscribe also closes
        />
      )}

       <style>{`
        body {
          background-color: #FEFFFF; /* hegra-light-bg */
          color: #18093B; /* hegra-deep-navy */
        }
      `}</style>
    </>
  );
};

export default HegiraApp;