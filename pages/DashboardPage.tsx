/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, PageName, EventData, TicketCategory } from '../HegiraApp'; 
import { Bookmark, Ticket as TicketIconLucide, BarChart2, Settings, PlusCircle, LogOut, LayoutDashboard, Edit3, Users, Info, FileText, UserCircle, ClipboardList, Briefcase, ArrowLeft, ShoppingCart, Search as SearchIcon, UserCog, DollarSign as DollarSignIcon } from 'lucide-react'; 
import EventCard from '../components/EventCard';
import EventListPageDB from './dashboard/EventListPageDB'; 
import CreateEventPageDB from './dashboard/CreateEventPageDB'; 
import EditEventPageDB from './dashboard/EditEventPageDB'; 
import EventDetailPageDB from './dashboard/EventDetailPageDB'; 
import TicketManagementPage from './dashboard/TicketManagementPage'; // New
import CouponManagementPage from './dashboard/CouponManagementPage'; // New
import PesananDB from './dashboard/PesananDB'; 
import PengunjungDB from './dashboard/PengunjungDB'; 
import AccountInfoDB from './dashboard/AccountInfoDB'; 
import DashboardLayout from '../components/dashboard/DashboardLayout'; 
import EventSelectorCardDB from '../components/dashboard/EventSelectorCardDB';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import ManajemenCrewPageDB from './dashboard/ManajemenCrewPageDB';
import PendapatanDB from './dashboard/PendapatanDB'; 

const sampleSavedEvents: EventData[] = [ 
  {
    id: 10, category: 'B2C', name: 'Global Harmony Fest 2025',
    location: 'ICE BSD, Tangerang', posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/10/25 - 2025/10/26', timeDisplay: '14:00 - 23:30', timezone: 'WIB',
    fullDescription: 'Festival musik internasional terbesar tahun ini! Menampilkan headliner kelas dunia dan talenta lokal terbaik.',
    ticketCategories: [{ id: 'ga-2day', name: 'GA - Terusan 2 Hari', price: 1500000, availabilityStatus: 'almost-sold', maxQuantity: 5000 }], displayPrice: 'Mulai Rp 850.000',
    organizerName: 'InterStage Productions', summary: 'Festival musik internasional dengan artis papan atas.', googleMapsQuery: 'ICE BSD City',
    status: 'Aktif', theme: 'Festival Musik', address: 'ICE BSD, Tangerang',
  },
  {
    id: 11, category: 'B2B', name: 'Indonesia Future Tech Summit',
    location: 'Hotel Mulia Senayan, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/11/12 - 2025/11/13', timeDisplay: '09:00 - 18:00', timezone: 'WIB',
    fullDescription: 'Konferensi teknologi terdepan di Indonesia, mempertemukan para inovator, investor, dan pemimpin industri.',
    ticketCategories: [{ id: 'delegate', name: 'Delegate Pass', price: 1800000, availabilityStatus: 'available', maxQuantity: 500 }], displayPrice: 'Mulai Rp 1.800.000',
    organizerName: 'Organisasi Hegira', summary: 'Konferensi teknologi, inovasi, dan investasi B2B.', googleMapsQuery: 'Hotel Mulia Senayan Jakarta',
    status: 'Aktif', theme: 'Konferensi Teknologi', address: 'Hotel Mulia Senayan, Jakarta',
  },
];
const sampleTicketHistory = [ 
  { id: 'TRX001', eventName: 'Local Soundscape: Indie Music Night', date: '28 Juni 2025', price: 'Rp 75.000', ticketCode: 'HGR-LSN1-A001', status: 'Confirmed' },
  { id: 'TRX002', eventName: 'Konser Populer Akhir Pekan', date: '05 Juli 2025', price: 'Rp 150.000', ticketCode: 'HGR-KPA2-B015', status: 'Used' },
];

export interface CreatorAccountData {
  fullName: string;
  email: string;
  gender: 'Laki-laki' | 'Perempuan' | 'Lainnya' | '';
  dateOfBirth: string; 
  phoneNumber: string | null;
  profilePictureUrl?: string;
  currentPassword?: string; 
}


export type DashboardViewId = 
  'daftarEvent' | 'ticketManagement' | 'couponManagement' | 'pesanan' | 'pengunjung' | 
  'accountInfo' | 
  'createEventView' | 'editEventView' | 'detailEventView' | 
  'savedEvents' | 'ticketHistory' | 'manajemenCrew' | 'pendapatan';

// Default sidebar for Creator/Organization
export const sidebarSectionsCreatorDefault: { title: string; items: { id: DashboardViewId; label: string; icon: React.ElementType; path: string; }[] }[] = [
    {
      title: 'Manajemen Event',
      items: [
        { id: 'daftarEvent', label: 'Daftar Event', icon: ClipboardList, path: '/dashboard/events' },
      ],
    },
    {
      title: 'Akun Penyelenggara',
      items: [
        { id: 'accountInfo', label: 'Informasi Akun', icon: UserCircle, path: '/dashboard/account' },
      ],
    },
];

// Visitor sidebar (simplified)
export const sidebarSectionsVisitor: { title: string; items: { id: DashboardViewId; label: string; icon: React.ElementType; path: string; }[] }[] = [
  {
    title: 'Aktivitas Saya',
    items: [
      { id: 'savedEvents', label: 'Event Tersimpan', icon: Bookmark, path: '/dashboard/saved-events' },
      { id: 'ticketHistory', label: 'Riwayat Tiket', icon: TicketIconLucide, path: '/dashboard/ticket-history' },
    ],
  },
  {
    title: 'Akun Saya',
    items: [
      { id: 'accountInfo', label: 'Informasi Akun', icon: UserCircle, path: '/dashboard/account' },
    ],
  },
];


interface DashboardPageProps {
  userRole: UserRole; 
  userName: string; 
  onNavigate: (page: PageName, data?: any) => void;
  onLogout: () => void;
  allEvents: EventData[]; 
  onAddNewEvent: (newEvent: EventData) => void; 
  eventBeingEdited: EventData | null; 
  onSetEventForEditing: (event: EventData | null) => void; 
  onUpdateExistingEvent: (updatedEvent: EventData) => void; 
  onOpenRoleSwitchModal: () => void; 
}

const ITEMS_PER_PAGE_EVENT_SELECTION = 6;

// Larger dataset for creator/organization dashboard event list
const manyCreatorDashboardEvents = (creatorName: string): EventData[] => [
  // Original events for creator/org can be included or new ones. Let's assume new ones for more volume.
  // We'll make organizerName dynamic based on loggedInUserName
  {
    id: 101, category: 'B2C', name: 'Jakarta Culinary Expo 2025',
    location: 'JIExpo Kemayoran', posterUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2025/11/01 - 2025/11/03', timeDisplay: '10:00 - 21:00', timezone: 'WIB',
    fullDescription: 'Pameran kuliner terbesar se-Asia Tenggara. Menampilkan chef ternama, workshop memasak, dan ratusan tenant makanan lezat.',
    ticketCategories: [{ id: 'daily-pass-jce', name: 'Daily Pass', price: 75000, availabilityStatus: 'available', maxQuantity: 5000 }], displayPrice: 'Rp 75.000',
    organizerName: creatorName, summary: 'Pameran kuliner akbar dengan chef internasional.', googleMapsQuery: 'JIExpo Kemayoran',
    parkingAvailable: true, ageRestriction: 'Semua Umur', arrivalInfo: 'Gunakan pintu masuk Hall C.',
    status: 'Draf', theme: 'Pameran Kuliner', address: 'JIExpo Kemayoran, Jakarta Pusat',
    termsAndConditions: 'Dilarang membawa makanan dari luar. Voucher makanan tersedia.', eventSlug: 'jakarta-culinary-expo-2025', narahubungName: creatorName, narahubungEmail:'info@jce.com', narahubungPhone:'+62812FOODFEST'
  },
  {
    id: 102, category: 'B2B', name: 'ASEAN Startup Summit 2026',
    location: 'Bali International Convention Centre', posterUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    coverImageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80',
    dateDisplay: '2026/03/15 - 2026/03/17', timeDisplay: '09:00 - 18:00', timezone: 'WITA',
    fullDescription: 'Pertemuan para pendiri startup, investor, dan mentor dari seluruh ASEAN. Pitching session, networking, dan diskusi panel.',
    ticketCategories: [
        { id: 'startup-delegate', name: 'Startup Delegate', price: 1500000, availabilityStatus: 'available', maxQuantity: 300 }, 
        {id: 'investor-pass-asean', name: 'Investor Pass', price: 3000000, availabilityStatus: 'available', maxQuantity: 100 }
    ], displayPrice: 'Mulai Rp 1.500.000',
    organizerName: creatorName, summary: 'Konferensi startup dan investor tingkat ASEAN.', googleMapsQuery: 'Bali International Convention Centre',
    parkingAvailable: true, ageRestriction: 'Professional Only', arrivalInfo: 'Registrasi di lobi utama BICC.',
    status: 'Aktif', theme: 'Konferensi Startup', address: 'Kawasan Pariwisata Nusa Dua, Lot NW/1, Benoa, Badung Regency, Bali',
    termsAndConditions: 'Dress code: Business Casual. Bawa kartu nama Anda.', eventSlug: 'asean-startup-summit-2026', narahubungName: creatorName, narahubungEmail:'contact@aseansummit.org', narahubungPhone:'+62812ASEANUP'
  },
  // Add 18 more unique events...
  {
    id: 103, category: 'B2C', name: 'Bandung Creative Week 2025',
    location: 'Trans Studio Mall Bandung', posterUrl: 'https://images.unsplash.com/photo-1517457373958-7ce8b7104698?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/09/10 - 2025/09/14', timeDisplay: '10:00 - 22:00', timezone: 'WIB',
    fullDescription: 'Pekan kreatif Bandung menampilkan desainer lokal, workshop seni, pertunjukan musik, dan bazaar produk unik.',
    ticketCategories: [{ id: 'free-entry-bcw', name: 'Free Entry (Registrasi)', price: 0, availabilityStatus: 'available', maxQuantity: 10000 }], displayPrice: 'Gratis',
    organizerName: creatorName, summary: 'Pekan kreatif dengan bazaar dan workshop di Bandung.', googleMapsQuery: 'Trans Studio Mall Bandung',
    status: 'Aktif', theme: 'Festival Kreatif', address: 'Jl. Gatot Subroto No.289, Cibangkong, Bandung', eventSlug: 'bandung-creative-week-2025', narahubungName: creatorName
  },
  {
    id: 104, category: 'B2G', name: 'Indonesia Infrastructure Forum 2025',
    location: 'Hotel Indonesia Kempinski Jakarta', posterUrl: 'https://images.unsplash.com/photo-1560250056-07ba64664864?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/05/20 - 2025/05/21', timeDisplay: '08:30 - 17:30', timezone: 'WIB',
    fullDescription: 'Forum diskusi tingkat tinggi antara pemerintah dan sektor swasta untuk percepatan pembangunan infrastruktur di Indonesia.',
    ticketCategories: [
        { id: 'gov-delegate-iif', name: 'Government Delegate', price: 0, availabilityStatus: 'available', maxQuantity: 300 }, 
        { id: 'private-sector-iif', name: 'Private Sector Pass', price: 2500000, availabilityStatus: 'available', maxQuantity: 200 }
    ], displayPrice: 'Invitation / Rp 2.500.000',
    organizerName: creatorName, summary: 'Forum infrastruktur pemerintah dan swasta.', googleMapsQuery: 'Hotel Indonesia Kempinski Jakarta',
    status: 'Draf', theme: 'Forum Pemerintah', address: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat', eventSlug: 'indonesia-infra-forum-2025', narahubungName: creatorName
  },
  {
    id: 105, category: 'B2C', name: 'Surabaya Marathon 2025',
    location: 'Balai Kota Surabaya', posterUrl: 'https://images.unsplash.com/photo-1475771553025-88559b5a4148?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/08/17', timeDisplay: '05:00 - 10:00', timezone: 'WIB',
    fullDescription: 'Ajang lari marathon tahunan di Surabaya. Kategori 5K, 10K, Half Marathon, dan Full Marathon.',
    ticketCategories: [
        { id: '5k-sbm', name: '5K Run', price: 150000, availabilityStatus: 'available', maxQuantity: 2000 }, 
        { id: 'full-marathon-sbm', name: 'Full Marathon', price: 450000, availabilityStatus: 'almost-sold', maxQuantity: 500 }
    ], displayPrice: 'Mulai Rp 150.000',
    organizerName: creatorName, summary: 'Event lari marathon di Surabaya untuk semua level.', googleMapsQuery: 'Balai Kota Surabaya',
    status: 'Aktif', theme: 'Olahraga', address: 'Jl. Taman Surya No.1, Ketabang, Genteng, Surabaya', eventSlug: 'surabaya-marathon-2025', narahubungName: creatorName
  },
   {
    id: 106, category: 'B2B', name: 'Fintech Innovation Expo',
    location: 'The Ritz-Carlton Jakarta, Pacific Place', posterUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/10/01 - 2025/10/02', timeDisplay: '09:00 - 17:00', timezone: 'WIB',
    fullDescription: 'Pameran dan konferensi teknologi finansial terkemuka. Showcase produk, diskusi tren, dan networking.',
    ticketCategories: [{ id: 'expo-visitor-fintech', name: 'Expo Visitor Pass', price: 500000, availabilityStatus: 'available', maxQuantity: 500 }], displayPrice: 'Rp 500.000',
    organizerName: creatorName, summary: 'Pameran inovasi fintech dan konferensi.', googleMapsQuery: 'Ritz-Carlton Pacific Place Jakarta',
    status: 'Draf', theme: 'Pameran Teknologi', address: 'SCBD, Jl. Jend. Sudirman Kav. 52-53, Jakarta', eventSlug: 'fintech-innovation-expo', narahubungName: creatorName
  },
  {
    id: 107, category: 'B2C', name: 'Anime & Cosplay Festival "Nippon Vibes"',
    location: 'Mall @ Alam Sutera, Tangerang', posterUrl: 'https://images.unsplash.com/photo-1580584126903-9c469379969e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/12/06 - 2025/12/07', timeDisplay: '11:00 - 20:00', timezone: 'WIB',
    fullDescription: 'Festival budaya pop Jepang terbesar! Kompetisi cosplay, meet & greet dengan guest star, bazaar merchandise, dan pertunjukan J-Pop.',
    ticketCategories: [
        { id: '1day-pass-nv', name: '1-Day Pass', price: 120000, availabilityStatus: 'available', maxQuantity: 1500 }, 
        { id: '2day-pass-nv', name: '2-Day Pass', price: 200000, availabilityStatus: 'available', maxQuantity: 1000 }
    ], displayPrice: 'Mulai Rp 120.000',
    organizerName: creatorName, summary: 'Festival anime, cosplay, dan budaya Jepang.', googleMapsQuery: 'Mall @ Alam Sutera',
    status: 'Aktif', theme: 'Festival Budaya Pop', address: 'Jl. Jalur Sutera Barat Kav. 16, Alam Sutera, Tangerang', eventSlug: 'nippon-vibes-fest', narahubungName: creatorName
  },
  {
    id: 108, category: 'B2B', name: 'Human Capital Development Conference',
    location: 'Shangri-La Hotel Jakarta', posterUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2026/02/18 - 2026/02/19', timeDisplay: '08:00 - 17:00', timezone: 'WIB',
    fullDescription: 'Konferensi untuk para profesional HR. Pembahasan tren terbaru dalam pengembangan SDM, talent management, dan leadership.',
    ticketCategories: [{ id: 'hr-pro-pass', name: 'HR Professional Pass', price: 2200000, availabilityStatus: 'available', maxQuantity: 250 }], displayPrice: 'Rp 2.200.000',
    organizerName: creatorName, summary: 'Konferensi HR tentang pengembangan SDM.', googleMapsQuery: 'Shangri-La Hotel Jakarta',
    status: 'Draf', theme: 'Konferensi HR', address: 'Kota BNI, Jl. Jend. Sudirman Kav. 1, Jakarta', eventSlug: 'hc-dev-conf-2026', narahubungName: creatorName
  },
  {
    id: 109, category: 'B2C', name: 'Workshop Barista Profesional',
    location: 'Kopi Studio Hegira, Kemang', posterUrl: 'https://images.unsplash.com/photo-1511920183318-afa7a848f096?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/07/26', timeDisplay: '09:00 - 15:00', timezone: 'WIB',
    fullDescription: 'Pelatihan intensif menjadi barista profesional. Materi meliputi pengenalan biji kopi, teknik brewing, latte art, dan manajemen kafe.',
    ticketCategories: [{ id: 'barista-ws', name: 'Peserta Workshop', price: 850000, availabilityStatus: 'available', maxQuantity: 20 }], displayPrice: 'Rp 850.000',
    organizerName: creatorName, summary: 'Pelatihan barista dari dasar hingga mahir.', googleMapsQuery: 'Kemang Jakarta Selatan',
    status: 'Aktif', theme: 'Workshop Kopi', address: 'Jl. Kemang Raya No. 10, Jakarta Selatan', eventSlug: 'workshop-barista-kemang', narahubungName: creatorName
  },
  {
    id: 110, category: 'B2C', name: 'Pameran Pernikahan Tradisional & Modern',
    location: 'Balai Kartini Jakarta', posterUrl: 'https://images.unsplash.com/photo-1591015605894-908f709d8134?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/11/22 - 2025/11/23', timeDisplay: '10:00 - 21:00', timezone: 'WIB',
    fullDescription: 'Pameran pernikahan terlengkap dengan vendor gaun, katering, dekorasi, fotografi, dan lainnya. Diskon spesial selama pameran.',
    ticketCategories: [{ id: 'wedding-expo-entry', name: 'Tiket Masuk Pameran', price: 25000, availabilityStatus: 'available', maxQuantity: 3000 }], displayPrice: 'Rp 25.000',
    organizerName: creatorName, summary: 'Pameran vendor pernikahan lengkap.', googleMapsQuery: 'Balai Kartini Jakarta',
    status: 'Aktif', theme: 'Pameran Pernikahan', address: 'Jl. Gatot Subroto Kav. 37, Jakarta Selatan', eventSlug: 'wedding-expo-balkar', narahubungName: creatorName
  },
  // Adding 10 more
  {
    id: 111, category: 'B2C', name: 'Yoga & Wellness Retreat Bali',
    location: 'Ubud, Bali', posterUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2026/04/10 - 2026/04/13', timeDisplay: 'Full Day Program', timezone: 'WITA',
    fullDescription: 'Retret yoga dan kesehatan selama 4 hari 3 malam di tengah keindahan alam Ubud. Sesi yoga, meditasi, healthy cooking class, dan spa.',
    ticketCategories: [{ id: 'retreat-package', name: 'Paket Retret (All-in)', price: 5500000, availabilityStatus: 'available', maxQuantity: 15 }], displayPrice: 'Rp 5.500.000',
    organizerName: creatorName, summary: 'Retret yoga dan kesehatan di Ubud.', googleMapsQuery: 'Ubud Bali',
    status: 'Draf', theme: 'Retret Kesehatan', address: 'Salah satu vila di Ubud (detail menyusul)', eventSlug: 'bali-yoga-retreat-2026', narahubungName: creatorName
  },
  {
    id: 112, category: 'B2B', name: 'Supply Chain & Logistics Conference Asia',
    location: 'Marina Bay Sands, Singapore', posterUrl: 'https://images.unsplash.com/photo-1577415124269-fc1148050993?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2026/01/15 - 2026/01/16', timeDisplay: '09:00 - 17:00', timezone: 'SGT',
    fullDescription: 'Konferensi internasional membahas inovasi dan tantangan dalam rantai pasok dan logistik di Asia. Untuk profesional logistik dan supply chain.',
    ticketCategories: [{ id: 'delegate-asia-log', name: 'Delegate Pass', price: 3500000, availabilityStatus: 'available', maxQuantity: 400 }], displayPrice: 'Rp 3.500.000 (approx)',
    organizerName: creatorName, summary: 'Konferensi rantai pasok dan logistik Asia.', googleMapsQuery: 'Marina Bay Sands Singapore',
    status: 'Draf', theme: 'Konferensi Logistik', address: '10 Bayfront Ave, Singapore', eventSlug: 'asia-logistics-conf-2026', narahubungName: creatorName
  },
  {
    id: 113, category: 'B2C', name: 'Kompetisi Fotografi Urban Jakarta',
    location: 'Area Kota Tua & SCBD Jakarta', posterUrl: 'https://images.unsplash.com/photo-1518002171503-807377329fd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/08/01 - 2025/08/31', timeDisplay: 'Periode Lomba', timezone: 'WIB',
    fullDescription: 'Kompetisi fotografi dengan tema "Wajah Urban Jakarta". Submit karya terbaikmu dan menangkan hadiah menarik. Kategori: Street, Architecture, Human Interest.',
    ticketCategories: [{ id: 'reg-photocomp', name: 'Registrasi Peserta', price: 50000, availabilityStatus: 'available', maxQuantity: 500 }], displayPrice: 'Rp 50.000',
    organizerName: creatorName, summary: 'Kompetisi fotografi urban di Jakarta.', googleMapsQuery: 'Kota Tua Jakarta',
    status: 'Aktif', theme: 'Kompetisi Foto', address: 'Jakarta', eventSlug: 'jakarta-urban-photo-2025', narahubungName: creatorName
  },
  {
    id: 114, category: 'B2C', name: 'Festival Film Independen Nusantara',
    location: 'Kineforum Jakarta & Online Streaming', posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/11/05 - 2025/11/10', timeDisplay: 'Sesuai Jadwal Pemutaran', timezone: 'WIB',
    fullDescription: 'Festival pemutaran film-film independen karya sineas muda Indonesia. Diskusi film, workshop, dan malam penghargaan.',
    ticketCategories: [
        { id: 'all-access-ffn', name: 'All Access Pass (Online & Offline)', price: 250000, availabilityStatus: 'available', maxQuantity: 300 }, 
        { id: 'single-screening', name: 'Single Screening Ticket', price: 35000, availabilityStatus: 'available', maxQuantity: 2000 }
    ], displayPrice: 'Mulai Rp 35.000',
    organizerName: creatorName, summary: 'Festival film independen Indonesia.', googleMapsQuery: 'Kineforum TIM Jakarta',
    status: 'Draf', theme: 'Festival Film', address: 'Taman Ismail Marzuki, Cikini, Jakarta', eventSlug: 'ffn-2025', narahubungName: creatorName
  },
  {
    id: 115, category: 'B2B', name: 'Green Technology & Sustainability Expo',
    location: 'Grand City Convex Surabaya', posterUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2026/05/12 - 2026/05/14', timeDisplay: '10:00 - 18:00', timezone: 'WIB',
    fullDescription: 'Pameran teknologi hijau dan solusi keberlanjutan untuk industri. Forum diskusi, presentasi inovasi, dan business matching.',
    ticketCategories: [{ id: 'trade-visitor-green', name: 'Trade Visitor', price: 100000, availabilityStatus: 'available', maxQuantity: 1000 }], displayPrice: 'Rp 100.000',
    organizerName: creatorName, summary: 'Pameran teknologi hijau dan keberlanjutan.', googleMapsQuery: 'Grand City Convex Surabaya',
    status: 'Draf', theme: 'Pameran B2B', address: 'Jl. Walikota Mustajab No.1, Ketabang, Genteng, Surabaya', eventSlug: 'green-tech-expo-sby', narahubungName: creatorName
  },
  {
    id: 116, category: 'B2C', name: 'Book Fair & Writers Festival Jogja',
    location: 'Jogja Expo Center (JEC)', posterUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/09/25 - 2025/09/29', timeDisplay: '10:00 - 21:00', timezone: 'WIB',
    fullDescription: 'Pesta buku terbesar di Yogyakarta! Diskon buku, meet & greet penulis, workshop menulis, dan diskusi literasi.',
    ticketCategories: [{ id: 'entry-bookfair', name: 'Tiket Masuk Harian', price: 15000, availabilityStatus: 'available', maxQuantity: 10000 }], displayPrice: 'Rp 15.000',
    organizerName: creatorName, summary: 'Pameran buku dan festival penulis di Yogyakarta.', googleMapsQuery: 'Jogja Expo Center',
    status: 'Aktif', theme: 'Pameran Buku', address: 'Jl. Raya Janti, Banguntapan, Bantul, Yogyakarta', eventSlug: 'jogja-bookfair-2025', narahubungName: creatorName
  },
  {
    id: 117, category: 'B2C', name: 'Stand Up Comedy Special: "Tertawa Itu Sehat"',
    location: 'Usmar Ismail Hall Jakarta', posterUrl: 'https://images.unsplash.com/photo-1576075409408-9c708d490372?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/10/18', timeDisplay: '19:30 - Selesai', timezone: 'WIB',
    fullDescription: 'Malam penuh tawa bersama komika-komika papan atas Indonesia. Pertunjukan spesial yang mengocok perut dan menyegarkan pikiran.',
    ticketCategories: [
        { id: 'regular-standup', name: 'Regular Seat', price: 175000, availabilityStatus: 'available', maxQuantity: 300 }, 
        {id: 'vip-standup', name: 'VIP Seat (Front Row)', price: 300000, availabilityStatus: 'almost-sold', maxQuantity: 50 }
    ], displayPrice: 'Mulai Rp 175.000',
    organizerName: creatorName, summary: 'Pertunjukan spesial stand up comedy.', googleMapsQuery: 'Usmar Ismail Hall Kuningan Jakarta',
    status: 'Aktif', theme: 'Pertunjukan Komedi', address: 'Jl. H.R. Rasuna Said Kav. C-22, Kuningan, Jakarta Selatan', eventSlug: 'standup-special-sehat', narahubungName: creatorName
  },
  {
    id: 118, category: 'B2B', name: 'Digital Transformation Workshop for SMEs',
    location: 'Online via Zoom', posterUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/07/15 - 2025/07/17', timeDisplay: '09:00 - 12:00 (3 Sesi)', timezone: 'WIB',
    fullDescription: 'Workshop online 3 hari untuk membantu UMKM bertransformasi digital. Materi meliputi pemasaran digital, e-commerce, dan efisiensi operasional.',
    ticketCategories: [{ id: 'sme-workshop-online', name: 'Peserta Workshop Online', price: 450000, availabilityStatus: 'available', maxQuantity: 100 }], displayPrice: 'Rp 450.000',
    organizerName: creatorName, summary: 'Workshop transformasi digital untuk UMKM.', googleMapsQuery: 'Online',
    status: 'Draf', theme: 'Workshop Online B2B', address: 'Online', eventSlug: 'workshop-sme-digital', narahubungName: creatorName
  },
  {
    id: 119, category: 'B2C', name: 'Kids Science Fair & Expo',
    location: 'Scientia Square Park, Gading Serpong', posterUrl: 'https://images.unsplash.com/photo-1576769490440-98cb416c0586?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/08/02 - 2025/08/03', timeDisplay: '09:00 - 17:00', timezone: 'WIB',
    fullDescription: 'Pameran sains interaktif untuk anak-anak. Eksperimen seru, demo sains, workshop robotik, dan planetarium mini.',
    ticketCategories: [
        { id: 'kids-entry-science', name: 'Tiket Anak (3-12 thn)', price: 75000, availabilityStatus: 'available', maxQuantity: 1000 }, 
        { id: 'adult-entry-science', name: 'Tiket Pendamping (13+ thn)', price: 50000, availabilityStatus: 'available', maxQuantity: 1000 }
    ], displayPrice: 'Mulai Rp 50.000',
    organizerName: creatorName, summary: 'Pameran sains interaktif untuk anak-anak.', googleMapsQuery: 'Scientia Square Park Gading Serpong',
    status: 'Aktif', theme: 'Pameran Edukasi Anak', address: 'Jl. Scientia Boulevard, Gading Serpong, Tangerang', eventSlug: 'kids-science-fair-2025', narahubungName: creatorName
  },
  {
    id: 120, category: 'B2C', name: 'Classic Car Show & Community Meetup',
    location: 'Parkir Timur Senayan, Jakarta', posterUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    dateDisplay: '2025/09/07', timeDisplay: '08:00 - 15:00', timezone: 'WIB',
    fullDescription: 'Pameran mobil klasik dari berbagai era dan merek. Kumpul komunitas pecinta mobil klasik, kontes modifikasi, dan bazaar spare part langka.',
    ticketCategories: [
        { id: 'visitor-carshow', name: 'Tiket Pengunjung', price: 30000, availabilityStatus: 'available', maxQuantity: 2000 }, 
        {id: 'display-car-reg', name: 'Registrasi Mobil Display', price: 150000, availabilityStatus: 'available', maxQuantity: 150 }
    ], displayPrice: 'Mulai Rp 30.000',
    organizerName: creatorName, summary: 'Pameran mobil klasik dan kumpul komunitas.', googleMapsQuery: 'Parkir Timur Senayan Jakarta',
    status: 'Aktif', theme: 'Pameran Otomotif', address: 'Area Parkir Timur Senayan, Jakarta Pusat', eventSlug: 'classic-car-show-jkt', narahubungName: creatorName
  }
];


const DashboardPage: React.FC<DashboardPageProps> = ({ 
    userRole, 
    userName, 
    onNavigate, 
    onLogout, 
    allEvents, 
    onAddNewEvent,
    eventBeingEdited, 
    onSetEventForEditing,
    onUpdateExistingEvent,
    onOpenRoleSwitchModal 
}) => {
  const isCreatorOrOrg = userRole === 'creator' || userRole === 'organization';
  const initialView: DashboardViewId = isCreatorOrOrg ? 'daftarEvent' : 'savedEvents'; 
  const [activeView, setActiveView] = useState<DashboardViewId>(initialView);
  
  const [contextualEventSelected, setContextualEventSelected] = useState<EventData | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventData | null>(null); // For EventDetailPageDB
  const [selectedEventForDataView, setSelectedEventForDataView] = useState<EventData | null>(null); // For PesananDB, PengunjungDB

  // State for EventSelectorCardDB when used standalone (not currently with new flow)
  const [searchTermForEventSelection, setSearchTermForEventSelection] = useState('');
  const [currentPageForEventSelection, setCurrentPageForEventSelection] = useState(1);


  const [creatorData, setCreatorData] = useState<CreatorAccountData>({
    fullName: userName, 
    email: userRole === 'creator' ? 'kreator@hegira.com' : (userRole === 'organization' ? 'org@hegira.com' : 'visitor@hegira.com'),
    gender: 'Laki-laki',
    dateOfBirth: '1990-01-15',
    phoneNumber: null, 
    profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    currentPassword: 'PasswordRahasia123',
  });
  
  useEffect(() => {
    if (userName !== creatorData.fullName) {
        setCreatorData(prev => ({ ...prev, fullName: userName, email: userRole === 'creator' ? 'kreator@hegira.com' : (userRole === 'organization' ? 'org@hegira.com' : 'visitor@hegira.com') }));
    }
  }, [userName, userRole, creatorData.fullName]);


  const handleUpdatePhoneNumber = (newPhoneNumber: string) => {
    setCreatorData(prev => ({ ...prev, phoneNumber: newPhoneNumber }));
    console.log(`Nomor telepon berhasil disimpan: ${newPhoneNumber}`);
    alert(`Nomor telepon berhasil disimpan: ${newPhoneNumber}`);
  };
  
  const handleUpdateProfilePicture = (newPictureUrl: string) => {
    setCreatorData(prev => ({ ...prev, profilePictureUrl: newPictureUrl }));
    console.log(`Foto profil berhasil diperbarui: ${newPictureUrl}`);
    alert(`Foto profil berhasil diperbarui.`);
  };

  const handleUpdatePassword = (oldPassword: string, newPassword: string) => {
    if (oldPassword !== creatorData.currentPassword) {
      alert("Password lama salah. Silakan coba lagi.");
      return;
    }
    setCreatorData(prev => ({ ...prev, currentPassword: newPassword }));
    alert(`Password berhasil diubah (simulasi).`);
  };

  const getSidebarSections = () => {
    if (!isCreatorOrOrg) return sidebarSectionsVisitor;

    if (contextualEventSelected) {
      const eventNameShort = contextualEventSelected.name.substring(0, 22) + (contextualEventSelected.name.length > 22 ? '...' : '');
      return [
        {
          title: `Navigasi Event`,
          items: [
            { id: 'daftarEvent' as DashboardViewId, label: 'Kembali ke Daftar Event', icon: ArrowLeft, path: '/dashboard/events' },
          ]
        },
        {
          title: eventNameShort, 
          items: [
            { id: 'detailEventView' as DashboardViewId, label: 'Detail Event', icon: Info, path: `/dashboard/event/${contextualEventSelected.id}/detail` },
            { 
              id: 'ticketsCouponsParent' as any, // Parent ID
              label: 'Tiket & Kupon', 
              icon: TicketIconLucide, 
              path: '#', // Not a real path
              subItems: [
                { id: 'ticketManagement' as DashboardViewId, label: 'Tiket', path: `/dashboard/event/${contextualEventSelected.id}/tickets` },
                { id: 'couponManagement' as DashboardViewId, label: 'Kupon', path: `/dashboard/event/${contextualEventSelected.id}/coupons` },
              ]
            },
            { id: 'pesanan' as DashboardViewId, label: 'Pesanan', icon: ShoppingCart, path: `/dashboard/event/${contextualEventSelected.id}/orders` },
            { id: 'pengunjung' as DashboardViewId, label: 'Pengunjung', icon: Users, path: `/dashboard/event/${contextualEventSelected.id}/attendees` },
            { id: 'manajemenCrew' as DashboardViewId, label: 'Manajemen Crew', icon: Briefcase, path: `/dashboard/event/${contextualEventSelected.id}/crew` },
            { id: 'pendapatan' as DashboardViewId, label: 'Pendapatan', icon: DollarSignIcon, path: `/dashboard/event/${contextualEventSelected.id}/revenue` },
          ]
        },
        {
          title: 'Akun Umum',
          items: [
            { id: 'accountInfo' as DashboardViewId, label: 'Informasi Akun', icon: UserCircle, path: '/dashboard/account' },
          ]
        }
      ];
    }
    return sidebarSectionsCreatorDefault;
  };
  
  const currentSidebarSections = getSidebarSections();

  
  const getLabelForView = (viewId: DashboardViewId): string => {
    if (viewId === 'createEventView') return 'Buat Event Baru';
    if (viewId === 'editEventView' && eventBeingEdited) return `Edit: ${eventBeingEdited.name.substring(0,25)}...`;
    
    if (contextualEventSelected) {
        const eventNameShort = contextualEventSelected.name.substring(0, 22) + (contextualEventSelected.name.length > 22 ? '...' : '');
        const allItems = currentSidebarSections.flatMap(s => s.items);
        const parentItem = allItems.find(item => item.subItems?.some(sub => sub.id === viewId));
        if(parentItem) {
          const subItem = parentItem.subItems?.find(sub => sub.id === viewId);
          if(subItem) return subItem.label;
        }
        
        const kelolaSection = currentSidebarSections.find(section => section.title === eventNameShort);
        if (kelolaSection) {
            const contextualItem = kelolaSection.items.find(item => item.id === viewId);
            if (contextualItem) return contextualItem.label;
        }
    }

    const generalItem = currentSidebarSections.flatMap(s => s.items).find(i => i.id === viewId);
    if (generalItem) return generalItem.label;
    
    if (viewId === 'detailEventView' && selectedEventForDetail) return `Detail: ${selectedEventForDetail.name.substring(0,25)}...`;
    if (viewId === 'ticketManagement' && contextualEventSelected) return `Tiket: ${contextualEventSelected.name.substring(0,20)}...`;
    if (viewId === 'couponManagement' && contextualEventSelected) return `Kupon: ${contextualEventSelected.name.substring(0,20)}...`;
    if (viewId === 'pesanan' && selectedEventForDataView) return `Pesanan: ${selectedEventForDataView.name.substring(0,20)}...`;
    if (viewId === 'pengunjung' && selectedEventForDataView) return `Pengunjung: ${selectedEventForDataView.name.substring(0,15)}...`;
    if (viewId === 'manajemenCrew' && contextualEventSelected) return `Manajemen Crew: ${contextualEventSelected.name.substring(0,15)}...`;
    if (viewId === 'pendapatan' && contextualEventSelected) return `Pendapatan: ${contextualEventSelected.name.substring(0,15)}...`;
    
    return 'Dashboard';
  }


  const handleSwitchView = (viewId: DashboardViewId, data?: any) => {
    if (viewId === 'daftarEvent') { 
        setContextualEventSelected(null);
        setSelectedEventForDetail(null);
        setSelectedEventForDataView(null);
        onSetEventForEditing(null);
    } else if (viewId === 'detailEventView' && data && !contextualEventSelected) { 
        setContextualEventSelected(data as EventData);
        setSelectedEventForDetail(data as EventData);
    } else if (contextualEventSelected) { 
        if (viewId === 'ticketManagement' || viewId === 'couponManagement' || viewId === 'manajemenCrew' || viewId === 'pendapatan') { 
            setSelectedEventForDataView(null); 
        } else if (viewId === 'pesanan' || viewId === 'pengunjung') {
            setSelectedEventForDataView(contextualEventSelected);
        } else if (viewId === 'editEventView' && data) { 
             onSetEventForEditing(data as EventData);
        } else if (viewId === 'detailEventView') { 
            setSelectedEventForDetail(contextualEventSelected);
        }
    }
    
    if (viewId === 'createEventView') {
        onSetEventForEditing(null); 
        setContextualEventSelected(null); 
    }
    
    setActiveView(viewId);
  };
  
  const handleEventSelectedForDataView = (event: EventData) => {
    setSelectedEventForDataView(event);
  };

  const handleBackToEventSelectionForDataView = () => {
    setSelectedEventForDataView(null);
  };
  
  const filteredEventsForSelectionList = useMemo(() => {
    return allEvents.filter(event =>
      event.name.toLowerCase().includes(searchTermForEventSelection.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTermForEventSelection.toLowerCase())
    );
  }, [allEvents, searchTermForEventSelection]);

  const totalPagesForEventSelection = Math.ceil(filteredEventsForSelectionList.length / ITEMS_PER_PAGE_EVENT_SELECTION);
  const currentDisplayEventsForSelection = useMemo(() => {
    const startIndex = (currentPageForEventSelection - 1) * ITEMS_PER_PAGE_EVENT_SELECTION;
    return filteredEventsForSelectionList.slice(startIndex, startIndex + ITEMS_PER_PAGE_EVENT_SELECTION);
  }, [filteredEventsForSelectionList, currentPageForEventSelection]);


  const renderVisitorDashboardContent = () => {
    switch (activeView) {
      case 'savedEvents':
        return (
          <section aria-labelledby="saved-events-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Bookmark size={28} className="text-hegra-turquoise" />
              <h2 id="saved-events-heading" className="text-2xl font-semibold text-hegra-navy">Event Tersimpan Saya</h2>
            </div>
            {sampleSavedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleSavedEvents.map(event => <EventCard key={event.id} {...event} onNavigate={onNavigate} />)}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-100 p-4 rounded-lg">Anda belum menyimpan event apapun.</p>
            )}
          </section>
        );
      case 'ticketHistory':
        return (
          <section aria-labelledby="ticket-history-heading">
            <div className="flex items-center gap-3 mb-6">
              <TicketIconLucide size={28} className="text-hegra-turquoise" />
              <h2 id="ticket-history-heading" className="text-2xl font-semibold text-hegra-navy">Riwayat Pembelian Tiket</h2>
            </div>
            {sampleTicketHistory.length > 0 ? (
              <div className="space-y-4">
                {sampleTicketHistory.map(ticket => (
                  <div key={ticket.id} className="bg-white p-4 sm:p-6 rounded-lg border border-hegra-navy/10 transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-hegra-navy">{ticket.eventName}</h3>
                      <p className="text-sm text-gray-600">Tanggal: {ticket.date} | Harga: {ticket.price}</p>
                      <p className="text-sm text-gray-500 mt-1">Kode Tiket: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-hegra-navy">{ticket.ticketCode}</span></p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ticket.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {ticket.status}
                      </span>
                      <button className="mt-2 text-sm text-hegra-turquoise hover:underline">Lihat Detail Tiket</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-100 p-4 rounded-lg">Anda belum memiliki riwayat pembelian tiket.</p>
            )}
          </section>
        );
      case 'accountInfo':
        return <AccountInfoDB 
                  creatorData={creatorData} 
                  onUpdatePhoneNumber={handleUpdatePhoneNumber}
                  onUpdateProfilePicture={handleUpdateProfilePicture} 
                  onUpdatePassword={handleUpdatePassword}
                />;
      default:
        return <div className="p-6"><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Dashboard Visitor</h2><p className="text-gray-700">Selamat datang! Pilih menu untuk melihat aktivitas Anda.</p></div>;
    }
  };

  const handleToggleEventStatus = (event: EventData, newStatus?: string) => {
    const targetStatus = newStatus || (event.status === 'Aktif' ? 'Selesai' : event.status === 'Draf' ? 'Aktif' : 'Draf'); 
    const eventToUpdate = { ...event, status: targetStatus as EventData['status'] };
    onUpdateExistingEvent(eventToUpdate); 

    if (selectedEventForDetail && selectedEventForDetail.id === event.id) {
      setSelectedEventForDetail(eventToUpdate);
    }
    if (contextualEventSelected && contextualEventSelected.id === event.id) {
      setContextualEventSelected(eventToUpdate);
    }
    alert(`Status event "${event.name}" diubah menjadi ${targetStatus}.`);
  };

  const eventsForCreatorOrgList = useMemo(() => {
    if (isCreatorOrOrg) {
        return manyCreatorDashboardEvents(userName).map(event => ({
            ...event,
            organizerName: userName, 
            narahubungName: userName, 
        }));
    }
    return allEvents; 
  }, [isCreatorOrOrg, userName, allEvents]);


  const renderCreatorOrgDashboardContent = () => {
    switch (activeView) {
      case 'daftarEvent':
        return <EventListPageDB initialEvents={eventsForCreatorOrgList} onNavigate={onNavigate} onSwitchView={handleSwitchView} />;
      case 'createEventView':
        return <CreateEventPageDB onNewEventCreated={onAddNewEvent} onCancel={handleSwitchView} />;
      case 'editEventView':
        if (eventBeingEdited) {
          return <EditEventPageDB eventToEdit={eventBeingEdited} onUpdateEvent={onUpdateExistingEvent} onCancel={handleSwitchView} />;
        }
        return <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-3">Error: Event Tidak Dipilih</h2>
                <p className="text-gray-700 mb-4">Tidak ada event yang dipilih untuk diedit. Silakan kembali ke daftar event.</p>
                <button onClick={() => handleSwitchView('daftarEvent')} className="bg-hegra-turquoise text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={18}/> Kembali ke Daftar Event
                </button>
            </div>;
      case 'detailEventView':
        if (selectedEventForDetail) { 
            return <EventDetailPageDB 
                        eventData={selectedEventForDetail} 
                        onSwitchView={handleSwitchView} 
                        onToggleEventStatus={handleToggleEventStatus} 
                        onNavigate={onNavigate}
                    />;
        }
         return <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-3">Error: Event Tidak Ditemukan</h2>
                <p className="text-gray-700 mb-4">Tidak ada event yang dipilih untuk dilihat detailnya. Silakan kembali ke daftar event.</p>
                <button onClick={() => handleSwitchView('daftarEvent')} className="bg-hegra-turquoise text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={18}/> Kembali ke Daftar Event
                </button>
            </div>;
      case 'ticketManagement':
        if (contextualEventSelected) {
          return <TicketManagementPage selectedEvent={contextualEventSelected} onUpdateEvent={onUpdateExistingEvent} />;
        }
        return <div>Pilih event untuk mengelola tiket.</div>; // Fallback
      case 'couponManagement':
        if (contextualEventSelected) {
          return <CouponManagementPage selectedEvent={contextualEventSelected} />;
        }
        return <div>Pilih event untuk mengelola kupon.</div>; // Fallback
      case 'pesanan':
        if (!selectedEventForDataView && contextualEventSelected) {
            setSelectedEventForDataView(contextualEventSelected);
        }
        return <PesananDB 
                    allCreatorEvents={eventsForCreatorOrgList} 
                    selectedEvent={selectedEventForDataView || contextualEventSelected!} 
                    onBackToEventList={() => handleSwitchView('daftarEvent')} 
                    onNavigate={onNavigate} 
                />;
      case 'pengunjung':
        if (!selectedEventForDataView && contextualEventSelected) {
            setSelectedEventForDataView(contextualEventSelected);
        }
        return <PengunjungDB 
                    allCreatorEvents={eventsForCreatorOrgList} 
                    selectedEvent={selectedEventForDataView || contextualEventSelected!}
                    onBackToEventList={() => handleSwitchView('daftarEvent')}
                />; 
      case 'manajemenCrew':
        if (contextualEventSelected) {
          return <ManajemenCrewPageDB 
                    selectedEvent={contextualEventSelected} 
                    onSwitchView={handleSwitchView} 
                  />;
        }
        return <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-3">Error: Event Tidak Dipilih</h2>
                <p className="text-gray-700 mb-4">Pilih event untuk mengelola crew.</p>
                 <button onClick={() => handleSwitchView('daftarEvent')} className="bg-hegra-turquoise text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={18}/> Kembali ke Daftar Event
                 </button>
            </div>;
      case 'pendapatan': // New Case
        if (contextualEventSelected) {
          return <PendapatanDB selectedEvent={contextualEventSelected} />;
        }
        return <div className="p-6 text-center">
                 <h2 className="text-xl font-semibold text-red-600 mb-3">Error: Event Tidak Dipilih</h2>
                 <p className="text-gray-700 mb-4">Pilih event untuk melihat data pendapatan.</p>
                 <button onClick={() => handleSwitchView('daftarEvent')} className="bg-hegra-turquoise text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={18}/> Kembali ke Daftar Event
                 </button>
               </div>;
      case 'accountInfo':
         return <AccountInfoDB 
                    creatorData={creatorData} 
                    onUpdatePhoneNumber={handleUpdatePhoneNumber}
                    onUpdateProfilePicture={handleUpdateProfilePicture} 
                    onUpdatePassword={handleUpdatePassword}
                 />;
      default: 
        if (activeView === 'savedEvents' || activeView === 'ticketHistory') return renderVisitorDashboardContent(); 
        return <EventListPageDB initialEvents={eventsForCreatorOrgList} onNavigate={onNavigate} onSwitchView={handleSwitchView} />; 
    }
  };
  
  const currentViewLabel = getLabelForView(activeView);


  return (
    <DashboardLayout
      activeViewId={activeView}
      currentViewLabel={currentViewLabel}
      sidebarSections={currentSidebarSections}
      onSelectView={handleSwitchView}
      onNavigate={onNavigate}
      onLogout={onLogout}
      userName={userName} 
      userRole={userRole} 
      onOpenRoleSwitchModal={onOpenRoleSwitchModal} 
      contextEvent={contextualEventSelected} 
    >
      {isCreatorOrOrg ? renderCreatorOrgDashboardContent() : renderVisitorDashboardContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;