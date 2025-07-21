/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { PageName, EventData, formatEventTime } from '../../HegiraApp'; // Assuming EventData and PageName are here
import OrderDetailModal from '../../components/dashboard/modals/OrderDetailModal'; 
import EditOrderStatusModal from '../../components/dashboard/modals/EditOrderStatusModal'; // New Modal
import { ShoppingCart, TrendingUp, Users, Percent, Search, Edit2, ChevronDown, ChevronLeft, ChevronRight, Download, ArrowLeft as ArrowLeftIcon } from 'lucide-react'; // Added ArrowLeftIcon

export interface OrderItem { // Added export keyword
  id: string; // Order ID
  transactionId: string;
  eventId: number;
  eventName: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  eventLocation: string;
  eventTimezone?: string;
  booker: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender?: 'Laki-laki' | 'Perempuan' | 'Lainnya';
    dateOfBirth?: string; // YYYY-MM-DD
  };
  tickets: Array<{
    categoryId: string;
    categoryName: string;
    quantity: number;
    pricePerTicket: number;
  }>;
  coupon?: {
    code: string;
    name: string;
    discountAmount: number;
  };
  totalPrice: number;
  originalPrice: number;
  totalTickets: number;
  status: 'Berhasil' | 'Pending' | 'Dibatalkan';
  orderTimestamp: string; // ISO string or formatted "YYYY-MM-DD HH:mm"
  additionalTicketHolders?: Array<{
    fullName: string;
    whatsAppNumber: string;
  }>;
}

// Sample Data - Updated to align with new EventData
export const sampleOrders: OrderItem[] = [
  {
    id: 'ORD-2024001', transactionId: 'TRX-HEGIRA-A1B2C3D4', eventId: 1, eventName: 'Local Soundscape: Indie Music Night',
    eventDateDisplay: '2025/06/28 - 2025/06/29', eventTimeDisplay: '15:00 - 22:00', eventTimezone: 'WIB', eventLocation: 'Rooftop ITC Depok',
    booker: { fullName: 'Budi Santoso', email: 'budi.s@example.com', phoneNumber: '+6281234567890', gender: 'Laki-laki', dateOfBirth: '1990-05-15' },
    tickets: [{ categoryId: '1', categoryName: 'Regular', quantity: 2, pricePerTicket: 75000 }],
    coupon: { code: 'HEMAT10', name: 'Diskon Awal Pekan', discountAmount: 15000 },
    totalPrice: 135000, originalPrice: 150000, totalTickets: 2, status: 'Berhasil', orderTimestamp: '2024-07-27 10:30',
    additionalTicketHolders: [{ fullName: 'Siti Aminah', whatsAppNumber: '+6281234567891' }, { fullName: 'Agus Setiawan', whatsAppNumber: '+6281234567892' }]
  },
  { 
    id: 'ORD-2024002', transactionId: 'TRX-HEGIRA-E5F6G7H8', eventId: 2, eventName: 'Creator Connect 2025', // Kreator Hegira Event
    eventDateDisplay: '2025/07/19', eventTimeDisplay: '09:00 - 17:00', eventTimezone: 'WIB', eventLocation: 'Margo City Depok',
    booker: { fullName: 'Citra Lestari', email: 'citra.l@example.com', phoneNumber: '+6285511223344', gender: 'Perempuan' },
    tickets: [
      { categoryId: 'creator-pass', categoryName: 'Creator Pass', quantity: 1, pricePerTicket: 250000 }
    ],
    totalPrice: 250000, originalPrice: 250000, totalTickets: 1, status: 'Pending', orderTimestamp: '2024-07-28 14:00',
    additionalTicketHolders: [{ fullName: 'Dewi Anggraini', whatsAppNumber: '+6285511223345' }]
  },
  { 
    id: 'ORD-2024003', transactionId: 'TRX-HEGIRA-I9J0K1L2', eventId: 11, eventName: 'Indonesia Future Tech Summit', // Organisasi Hegira Event
    eventDateDisplay: '2025/11/12 - 2025/11/13', eventTimeDisplay: '09:00 - 18:00', eventTimezone: 'WIB', eventLocation: 'Hotel Mulia Senayan, Jakarta',
    booker: { fullName: 'Andi Wijaya', email: 'andi.w@example.net', phoneNumber: '+6287788990011' }, 
    tickets: [{ categoryId: 'delegate', categoryName: 'Delegate Pass', quantity: 1, pricePerTicket: 1800000 }],
    totalPrice: 1800000, originalPrice: 1800000, totalTickets: 1, status: 'Dibatalkan', orderTimestamp: '2024-07-29 09:15'
  },
  {
    id: 'ORD-2024004', transactionId: 'TRX-HEGIRA-M3N4O5P6', eventId: 14, eventName: 'Cita Rasa Nusantara Food Festival',
    eventDateDisplay: '2025/09/20 - 2025/09/22', eventTimeDisplay: '11:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'Lapangan Banteng, Jakarta',
    booker: { fullName: 'Rina Permata', email: 'rina.p@foodies.com', phoneNumber: '+628135550011', gender: 'Perempuan', dateOfBirth: '1988-11-20'},
    tickets: [{ categoryId: 'entry-voucher-100k', categoryName: 'Voucher Masuk + Kuliner Rp 100.000', quantity: 3, pricePerTicket: 90000 }],
    totalPrice: 270000, originalPrice: 270000, totalTickets: 3, status: 'Berhasil', orderTimestamp: '2024-08-01 11:45',
    additionalTicketHolders: [
        { fullName: 'Rina Permata', whatsAppNumber: '+628135550011' },
        { fullName: 'Kevin Sanjaya', whatsAppNumber: '+628135550012' },
        { fullName: 'Laura Basuki', whatsAppNumber: '+628135550013' },
    ]
  },
  { 
    id: 'ORD-2024005', transactionId: 'TRX-HEGIRA-Q7R8S9T0', eventId: 15, eventName: 'Hegira E-Champions Cup 2025', // Kreator Hegira Event
    eventDateDisplay: '2025/12/01 - 2025/12/15', eventTimeDisplay: 'Sesuai Jadwal Pertandingan', eventTimezone: 'WIB', eventLocation: 'Online & BritAma Arena, Jakarta',
    booker: { fullName: 'Tim Esport Jaya', email: 'manager@esportjaya.team', phoneNumber: '+6289912345678', gender: 'Lainnya'},
    tickets: [{ categoryId: 'player-reg', categoryName: 'Registrasi Pemain (per tim)', quantity: 1, pricePerTicket: 250000 }],
    totalPrice: 250000, originalPrice: 250000, totalTickets: 1, status: 'Berhasil', orderTimestamp: '2024-08-02 18:20',
  },
  { 
    id: 'ORD-2024006', transactionId: 'TRX-HEGIRA-K4B5C6D7', eventId: 12, eventName: 'Karya Anak Bangsa Expo 2025', // Organisasi Hegira Event
    eventDateDisplay: '2026/03/10 - 2026/03/14', eventTimeDisplay: '10:00 - 20:00', eventTimezone: 'WIB', eventLocation: 'JIExpo Kemayoran, Jakarta',
    booker: { fullName: 'Pemda XYZ', email: 'info@pemdaxyz.go.id', phoneNumber: '+62219876543', gender: 'Lainnya'},
    tickets: [{ categoryId: 'free-entry', categoryName: 'Registrasi Pengunjung Umum', quantity: 5, pricePerTicket: 0 }],
    totalPrice: 0, originalPrice: 0, totalTickets: 5, status: 'Berhasil', orderTimestamp: '2024-08-03 10:00',
  },
  ...Array.from({ length: 14 }, (_, i) => { 
    const eventOptions = [
        {id: 1, name: 'Local Soundscape: Indie Music Night', date: '2025/06/28 - 2025/06/29', time: '15:00 - 22:00', loc: 'Rooftop ITC Depok', ticketCat: 'Regular', price: 75000},
        {id: 101, name: 'Jakarta Culinary Expo 2025', date: '2025/11/01 - 2025/11/03', time: '10:00 - 21:00', loc: 'JIExpo Kemayoran', ticketCat: 'Daily Pass', price: 75000}, // Corrected eventId to 101
        {id: 14, name: 'Cita Rasa Nusantara Food Festival', date: '2025/09/20 - 2025/09/22', time: '11:00 - 21:00', loc: 'Lapangan Banteng, Jakarta', ticketCat: 'Voucher Masuk + Kuliner Rp 50.000', price: 50000},
        {id: 2, name: 'Creator Connect 2025', date: '2025/07/19', time: '09:00 - 17:00', loc: 'Margo City Depok', ticketCat: 'Business Pass', price: 500000}, 
        {id: 102, name: 'ASEAN Startup Summit 2026', date: '2026/03/15 - 2026/03/17', time: '09:00 - 18:00', loc: 'Bali International Convention Centre', ticketCat: 'Startup Delegate', price: 1500000}, // Corrected eventId to 102
        {id: 15, name: 'Hegira E-Champions Cup 2025', date: '2025/12/01 - 2025/12/15', time: 'Sesuai Jadwal Pertandingan', loc: 'Online & BritAma Arena, Jakarta', ticketCat: 'Spectator-venue-gf', price: 100000},
        {id: 103, name: 'Bandung Creative Week 2025', date: '2025/09/10 - 2025/09/14', time: '10:00 - 22:00', loc: 'Trans Studio Mall Bandung', ticketCat: 'Free Entry (Registrasi)', price: 0}, // Corrected eventId to 103
    ];
    const chosenEvent = eventOptions[i % eventOptions.length];
    const quantity = (i % 3) + 1;
    const hasCoupon = i % 5 === 0;
    const discountAmount = hasCoupon ? Math.floor((chosenEvent.price * quantity * 0.1) / 1000) * 1000 : 0; // 10% discount rounded

    return {
        id: `ORD-202400${i + 7}`, transactionId: `TRX-HEGIRA-U${i}V${i+1}W${i+2}X${i+3}`,
        eventId: chosenEvent.id, 
        eventName: chosenEvent.name,
        eventDateDisplay: chosenEvent.date,
        eventTimeDisplay: chosenEvent.time,
        eventTimezone: 'WIB',
        eventLocation: chosenEvent.loc,
        booker: { 
          fullName: `Pemesan Contoh ${i + 7}`, 
          email: `pemesanc${i+7}@mail.com`, 
          phoneNumber: `+62812000000${String(i+7).padStart(2,'0')}`, 
          gender: (i % 3 === 0 ? 'Laki-laki' : (i % 3 === 1 ? 'Perempuan' : 'Lainnya')) as 'Laki-laki' | 'Perempuan' | 'Lainnya'
        },
        tickets: [{ categoryId: chosenEvent.ticketCat.toLowerCase().replace(/\s/g,'-'), categoryName: chosenEvent.ticketCat, quantity: quantity, pricePerTicket: chosenEvent.price}],
        coupon: hasCoupon ? { code: `DISKONLOOP${i+1}`, name: `Kupon Loop ${i+1}`, discountAmount: discountAmount } : undefined,
        totalPrice: (chosenEvent.price * quantity) - discountAmount,
        originalPrice: chosenEvent.price * quantity,
        totalTickets: quantity,
        status: (i % 4 === 0 ? 'Berhasil' : (i % 4 === 1 ? 'Pending' : (i % 4 === 2 ? 'Dibatalkan' : 'Berhasil'))) as 'Berhasil' | 'Pending' | 'Dibatalkan',
        orderTimestamp: `2024-08-${String(4 + (i % 20)).padStart(2,'0')} ${String(9 + (i%12)).padStart(2,'0')}:${String(i%60).padStart(2,'0')}`,
    };
  }),
  // Start of 20 new sample orders
  {
    id: 'ORD-2024021', transactionId: 'TRX-HEGIRA-NEW00001', eventId: 101, eventName: 'Jakarta Culinary Expo 2025',
    eventDateDisplay: '2025/11/01 - 2025/11/03', eventTimeDisplay: '10:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'JIExpo Kemayoran',
    booker: { fullName: 'Ahmad Zulkarnain', email: 'ahmad.zulk@example.com', phoneNumber: '+6281122334455', gender: 'Laki-laki', dateOfBirth: '1985-03-10' },
    tickets: [{ categoryId: 'daily-pass-jce', categoryName: 'Daily Pass', quantity: 3, pricePerTicket: 75000 }],
    totalPrice: 225000, originalPrice: 225000, totalTickets: 3, status: 'Berhasil', orderTimestamp: '2024-08-21 09:15',
    additionalTicketHolders: [{ fullName: 'Ahmad Zulkarnain', whatsAppNumber: '+6281122334455' }, { fullName: 'Zulaikha Putri', whatsAppNumber: '+6281122334456' }, { fullName: 'Zulfikar Ahmad', whatsAppNumber: '+6281122334457' }]
  },
  {
    id: 'ORD-2024022', transactionId: 'TRX-HEGIRA-NEW00002', eventId: 105, eventName: 'Surabaya Marathon 2025',
    eventDateDisplay: '2025/08/17', eventTimeDisplay: '05:00 - 10:00', eventTimezone: 'WIB', eventLocation: 'Balai Kota Surabaya',
    booker: { fullName: 'Maria Selena', email: 'maria.selena@runner.id', phoneNumber: '+6287654321098', gender: 'Perempuan', dateOfBirth: '1992-07-22' },
    tickets: [{ categoryId: 'full-marathon-sbm', categoryName: 'Full Marathon', quantity: 1, pricePerTicket: 450000 }],
    coupon: { code: 'RUNNERUP', name: 'Diskon Pelari', discountAmount: 45000 },
    totalPrice: 405000, originalPrice: 450000, totalTickets: 1, status: 'Berhasil', orderTimestamp: '2024-08-22 11:30'
  },
  {
    id: 'ORD-2024023', transactionId: 'TRX-HEGIRA-NEW00003', eventId: 1, eventName: 'Local Soundscape: Indie Music Night',
    eventDateDisplay: '2025/06/28 - 2025/06/29', eventTimeDisplay: '15:00 - 22:00', eventTimezone: 'WIB', eventLocation: 'Rooftop ITC Depok',
    booker: { fullName: 'Kevin Ardian', email: 'kevin.ard@musiclover.com', phoneNumber: '+6281298765432', gender: 'Laki-laki', dateOfBirth: '1998-12-01' },
    tickets: [{ categoryId: 'vip', categoryName: 'VIP', quantity: 2, pricePerTicket: 150000 }],
    totalPrice: 300000, originalPrice: 300000, totalTickets: 2, status: 'Pending', orderTimestamp: '2024-08-23 16:45',
    additionalTicketHolders: [{ fullName: 'Laura Pitaloka', whatsAppNumber: '+6281298765433' }]
  },
  {
    id: 'ORD-2024024', transactionId: 'TRX-HEGIRA-NEW00004', eventId: 107, eventName: 'Anime & Cosplay Festival "Nippon Vibes"',
    eventDateDisplay: '2025/12/06 - 2025/12/07', eventTimeDisplay: '11:00 - 20:00', eventTimezone: 'WIB', eventLocation: 'Mall @ Alam Sutera, Tangerang',
    booker: { fullName: 'Sakura Hanami', email: 'sakura.h@otaku.jp', phoneNumber: '+6285711112222', gender: 'Perempuan', dateOfBirth: '2003-04-03' },
    tickets: [{ categoryId: '2day-pass-nv', categoryName: '2-Day Pass', quantity: 1, pricePerTicket: 200000 }],
    totalPrice: 200000, originalPrice: 200000, totalTickets: 1, status: 'Berhasil', orderTimestamp: '2024-08-24 10:00'
  },
  {
    id: 'ORD-2024025', transactionId: 'TRX-HEGIRA-NEW00005', eventId: 4, eventName: 'Pameran Seni Kontemporer "RuangRupa"',
    eventDateDisplay: '2025/09/05 - 2025/09/15', eventTimeDisplay: '10:00 - 19:00', eventTimezone: 'WIB', eventLocation: 'Galeri Nasional Indonesia, Jakarta',
    booker: { fullName: 'Prof. Dr. Artanto', email: 'artanto.gallery@seni.ac.id', phoneNumber: '+6281567890123', gender: 'Laki-laki', dateOfBirth: '1965-01-15' },
    tickets: [{ categoryId: 'general-admission', categoryName: 'Umum', quantity: 5, pricePerTicket: 50000 }],
    totalPrice: 250000, originalPrice: 250000, totalTickets: 5, status: 'Dibatalkan', orderTimestamp: '2024-08-25 13:20'
  },
  {
    id: 'ORD-2024026', transactionId: 'TRX-HEGIRA-NEW00006', eventId: 102, eventName: 'ASEAN Startup Summit 2026',
    eventDateDisplay: '2026/03/15 - 2026/03/17', eventTimeDisplay: '09:00 - 18:00', eventTimezone: 'WITA', eventLocation: 'Bali International Convention Centre',
    booker: { fullName: 'Tech Investor Group', email: 'contact@techinvest.asia', phoneNumber: '+6591234567', gender: 'Lainnya' },
    tickets: [{ categoryId: 'investor-pass-asean', categoryName: 'Investor Pass', quantity: 2, pricePerTicket: 3000000 }],
    totalPrice: 6000000, originalPrice: 6000000, totalTickets: 2, status: 'Berhasil', orderTimestamp: '2024-08-26 17:00'
  },
  {
    id: 'ORD-2024027', transactionId: 'TRX-HEGIRA-NEW00007', eventId: 14, eventName: 'Cita Rasa Nusantara Food Festival',
    eventDateDisplay: '2025/09/20 - 2025/09/22', eventTimeDisplay: '11:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'Lapangan Banteng, Jakarta',
    booker: { fullName: 'Keluarga Bahagia', email: 'keluarga.bahagia@mail.com', phoneNumber: '+6281800001111', gender: 'Lainnya' },
    tickets: [{ categoryId: 'entry-voucher-50k', categoryName: 'Voucher Masuk + Kuliner Rp 50.000', quantity: 4, pricePerTicket: 50000 }],
    totalPrice: 200000, originalPrice: 200000, totalTickets: 4, status: 'Berhasil', orderTimestamp: '2024-08-27 12:10',
    additionalTicketHolders: [{fullName: "Ayah", whatsAppNumber: "+6281800001111"}, {fullName: "Ibu", whatsAppNumber: "+6281800001111"}, {fullName: "Anak 1", whatsAppNumber: "+6281800001111"}, {fullName: "Anak 2", whatsAppNumber: "+6281800001111"}]
  },
  {
    id: 'ORD-2024028', transactionId: 'TRX-HEGIRA-NEW00008', eventId: 103, eventName: 'Bandung Creative Week 2025',
    eventDateDisplay: '2025/09/10 - 2025/09/14', eventTimeDisplay: '10:00 - 22:00', eventTimezone: 'WIB', eventLocation: 'Trans Studio Mall Bandung',
    booker: { fullName: 'Mahasiswa Desain Unpar', email: 'mahasiswa@unpar.ac.id', phoneNumber: '+6282123456789', gender: 'Lainnya' },
    tickets: [{ categoryId: 'free-entry-bcw', categoryName: 'Free Entry (Registrasi)', quantity: 10, pricePerTicket: 0 }],
    totalPrice: 0, originalPrice: 0, totalTickets: 10, status: 'Berhasil', orderTimestamp: '2024-08-28 08:55'
  },
  {
    id: 'ORD-2024029', transactionId: 'TRX-HEGIRA-NEW00009', eventId: 1, eventName: 'Local Soundscape: Indie Music Night',
    eventDateDisplay: '2025/06/28 - 2025/06/29', eventTimeDisplay: '15:00 - 22:00', eventTimezone: 'WIB', eventLocation: 'Rooftop ITC Depok',
    booker: { fullName: 'Rara Sekar Laras', email: 'rara.sekar@indiefan.com', phoneNumber: '+6281987654321', gender: 'Perempuan', dateOfBirth: '2000-10-10' },
    tickets: [{ categoryId: 'regular', categoryName: 'Regular', quantity: 1, pricePerTicket: 75000 }],
    totalPrice: 75000, originalPrice: 75000, totalTickets: 1, status: 'Pending', orderTimestamp: '2024-08-29 19:05'
  },
  {
    id: 'ORD-2024030', transactionId: 'TRX-HEGIRA-NEW00010', eventId: 101, eventName: 'Jakarta Culinary Expo 2025',
    eventDateDisplay: '2025/11/01 - 2025/11/03', eventTimeDisplay: '10:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'JIExpo Kemayoran',
    booker: { fullName: 'Chef Junaidi', email: 'chef.juna@culinary.pro', phoneNumber: '+6281765432109', gender: 'Laki-laki', dateOfBirth: '1975-07-20' },
    tickets: [{ categoryId: 'daily-pass-jce', categoryName: 'Daily Pass', quantity: 1, pricePerTicket: 75000 }],
    coupon: { code: 'FOODIEAPP', name: 'Diskon Aplikasi Makanan', discountAmount: 7500 },
    totalPrice: 67500, originalPrice: 75000, totalTickets: 1, status: 'Berhasil', orderTimestamp: '2024-08-30 14:00'
  },
  {
    id: 'ORD-2024031', transactionId: 'TRX-HEGIRA-NEW00011', eventId: 105, eventName: 'Surabaya Marathon 2025',
    eventDateDisplay: '2025/08/17', eventTimeDisplay: '05:00 - 10:00', eventTimezone: 'WIB', eventLocation: 'Balai Kota Surabaya',
    booker: { fullName: 'Pelari Pagi Club', email: 'admin@pelaripagi.org', phoneNumber: '+6281212121212', gender: 'Lainnya'},
    tickets: [{ categoryId: '5k-sbm', categoryName: '5K Run', quantity: 5, pricePerTicket: 150000 }],
    totalPrice: 750000, originalPrice: 750000, totalTickets: 5, status: 'Berhasil', orderTimestamp: '2024-08-31 07:30'
  },
  {
    id: 'ORD-2024032', transactionId: 'TRX-HEGIRA-NEW00012', eventId: 15, eventName: 'Hegira E-Champions Cup 2025',
    eventDateDisplay: '2025/12/01 - 2025/12/15', eventTimeDisplay: 'Sesuai Jadwal Pertandingan', eventTimezone: 'WIB', eventLocation: 'Online & BritAma Arena, Jakarta',
    booker: { fullName: 'Gamer Pro Player', email: 'pro@gamer.tv', phoneNumber: '+6289612345678', gender: 'Laki-laki', dateOfBirth: '1999-09-09' },
    tickets: [{ categoryId: 'spectator-venue-gf', categoryName: 'Tiket Nonton Grand Final (Venue)', quantity: 2, pricePerTicket: 100000 }],
    totalPrice: 200000, originalPrice: 200000, totalTickets: 2, status: 'Pending', orderTimestamp: '2024-09-01 18:00'
  },
  {
    id: 'ORD-2024033', transactionId: 'TRX-HEGIRA-NEW00013', eventId: 4, eventName: 'Pameran Seni Kontemporer "RuangRupa"',
    eventDateDisplay: '2025/09/05 - 2025/09/15', eventTimeDisplay: '10:00 - 19:00', eventTimezone: 'WIB', eventLocation: 'Galeri Nasional Indonesia, Jakarta',
    booker: { fullName: 'Mahasiswa Seni Rupa ITB', email: 'fsrd@itb.ac.id', phoneNumber: '+6282233445566', gender: 'Lainnya'},
    tickets: [{ categoryId: 'student-pass', categoryName: 'Pelajar/Mahasiswa', quantity: 15, pricePerTicket: 25000 }],
    totalPrice: 375000, originalPrice: 375000, totalTickets: 15, status: 'Berhasil', orderTimestamp: '2024-09-02 10:15'
  },
   {
    id: 'ORD-2024034', transactionId: 'TRX-HEGIRA-NEW00014', eventId: 101, eventName: 'Jakarta Culinary Expo 2025',
    eventDateDisplay: '2025/11/01 - 2025/11/03', eventTimeDisplay: '10:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'JIExpo Kemayoran',
    booker: { fullName: 'Diana Food Blogger', email: 'diana.food@blogger.com', phoneNumber: '+6281399887766', gender: 'Perempuan', dateOfBirth: '1993-02-25' },
    tickets: [{ categoryId: 'daily-pass-jce', categoryName: 'Daily Pass', quantity: 1, pricePerTicket: 75000 }],
    totalPrice: 75000, originalPrice: 75000, totalTickets: 1, status: 'Dibatalkan', orderTimestamp: '2024-09-03 15:00'
  },
  {
    id: 'ORD-2024035', transactionId: 'TRX-HEGIRA-NEW00015', eventId: 107, eventName: 'Anime & Cosplay Festival "Nippon Vibes"',
    eventDateDisplay: '2025/12/06 - 2025/12/07', eventTimeDisplay: '11:00 - 20:00', eventTimezone: 'WIB', eventLocation: 'Mall @ Alam Sutera, Tangerang',
    booker: { fullName: 'Cosplayer Community', email: 'coscom@community.org', phoneNumber: '+6285678901234', gender: 'Lainnya'},
    tickets: [{ categoryId: '1day-pass-nv', categoryName: '1-Day Pass', quantity: 8, pricePerTicket: 120000 }],
    totalPrice: 960000, originalPrice: 960000, totalTickets: 8, status: 'Berhasil', orderTimestamp: '2024-09-04 11:20'
  },
  {
    id: 'ORD-2024036', transactionId: 'TRX-HEGIRA-NEW00016', eventId: 1, eventName: 'Local Soundscape: Indie Music Night',
    eventDateDisplay: '2025/06/28 - 2025/06/29', eventTimeDisplay: '15:00 - 22:00', eventTimezone: 'WIB', eventLocation: 'Rooftop ITC Depok',
    booker: { fullName: 'Andre Tauladan', email: 'andre.t@musisi.net', phoneNumber: '+6281232109876', gender: 'Laki-laki', dateOfBirth: '1980-08-17' },
    tickets: [{ categoryId: 'regular', categoryName: 'Regular', quantity: 4, pricePerTicket: 75000 }],
    coupon: { code: 'GROUPDEAL', name: 'Diskon Rombongan', discountAmount: 30000 },
    totalPrice: 270000, originalPrice: 300000, totalTickets: 4, status: 'Berhasil', orderTimestamp: '2024-09-05 09:45'
  },
  {
    id: 'ORD-2024037', transactionId: 'TRX-HEGIRA-NEW00017', eventId: 102, eventName: 'ASEAN Startup Summit 2026',
    eventDateDisplay: '2026/03/15 - 2026/03/17', eventTimeDisplay: '09:00 - 18:00', eventTimezone: 'WITA', eventLocation: 'Bali International Convention Centre',
    booker: { fullName: 'Startup Unicorn XYZ', email: 'ceo@unicornxyz.io', phoneNumber: '+14155550199', gender: 'Lainnya'},
    tickets: [{ categoryId: 'startup-delegate', categoryName: 'Startup Delegate', quantity: 3, pricePerTicket: 1500000 }],
    totalPrice: 4500000, originalPrice: 4500000, totalTickets: 3, status: 'Pending', orderTimestamp: '2024-09-06 16:00'
  },
  {
    id: 'ORD-2024038', transactionId: 'TRX-HEGIRA-NEW00018', eventId: 105, eventName: 'Surabaya Marathon 2025',
    eventDateDisplay: '2025/08/17', eventTimeDisplay: '05:00 - 10:00', eventTimezone: 'WIB', eventLocation: 'Balai Kota Surabaya',
    booker: { fullName: 'Komunitas Lari Sehat SBY', email: 'kls.sby@runclub.or.id', phoneNumber: '+6287712345678', gender: 'Lainnya'},
    tickets: [{ categoryId: '5k-sbm', categoryName: '5K Run', quantity: 10, pricePerTicket: 150000 }, { categoryId: 'full-marathon-sbm', categoryName: 'Full Marathon', quantity: 2, pricePerTicket: 450000 }],
    totalPrice: 2400000, originalPrice: 2400000, totalTickets: 12, status: 'Berhasil', orderTimestamp: '2024-09-07 12:30'
  },
  {
    id: 'ORD-2024039', transactionId: 'TRX-HEGIRA-NEW00019', eventId: 14, eventName: 'Cita Rasa Nusantara Food Festival',
    eventDateDisplay: '2025/09/20 - 2025/09/22', eventTimeDisplay: '11:00 - 21:00', eventTimezone: 'WIB', eventLocation: 'Lapangan Banteng, Jakarta',
    booker: { fullName: 'Yulia Koki Cilik', email: 'yulia.koki@gmail.com', phoneNumber: '+6281698765432', gender: 'Perempuan', dateOfBirth: '2005-05-05' },
    tickets: [{ categoryId: 'entry-voucher-50k', categoryName: 'Voucher Masuk + Kuliner Rp 50.000', quantity: 2, pricePerTicket: 50000 }],
    totalPrice: 100000, originalPrice: 100000, totalTickets: 2, status: 'Berhasil', orderTimestamp: '2024-09-08 10:50'
  },
  {
    id: 'ORD-2024040', transactionId: 'TRX-HEGIRA-NEW00020', eventId: 4, eventName: 'Pameran Seni Kontemporer "RuangRupa"',
    eventDateDisplay: '2025/09/05 - 2025/09/15', eventTimeDisplay: '10:00 - 19:00', eventTimezone: 'WIB', eventLocation: 'Galeri Nasional Indonesia, Jakarta',
    booker: { fullName: 'Seniwati Galeri', email: 'seniwati@galeri-kita.com', phoneNumber: '+6281187654321', gender: 'Perempuan', dateOfBirth: '1978-11-11' },
    tickets: [{ categoryId: 'general-admission', categoryName: 'Umum', quantity: 1, pricePerTicket: 50000 }],
    totalPrice: 50000, originalPrice: 50000, totalTickets: 1, status: 'Berhasil', orderTimestamp: '2024-09-09 17:15'
  },
  // End of 20 new sample orders
];

const ITEMS_PER_PAGE = 10;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

interface PesananDBProps {
  allCreatorEvents: EventData[]; 
  selectedEvent: EventData; 
  onBackToEventList: () => void; 
  onNavigate: (page: PageName, data?: any) => void;
}

const PesananDB: React.FC<PesananDBProps> = ({ allCreatorEvents, selectedEvent, onBackToEventList, onNavigate }) => {
  const [orders, setOrders] = useState<OrderItem[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterDate, setFilterDate] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<OrderItem | null>(null);

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [orderForStatusEdit, setOrderForStatusEdit] = useState<OrderItem | null>(null);

   const summaryBaseOrders = useMemo(() => {
    if (!selectedEvent) return []; // Guard against null selectedEvent
    return orders.filter(order => {
      if (order.eventId !== selectedEvent.id) return false; 
      
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTermLower === '' ||
        order.id.toLowerCase().includes(searchTermLower) ||
        order.booker.fullName.toLowerCase().includes(searchTermLower) ||
        order.booker.email.toLowerCase().includes(searchTermLower);
      
      return matchesSearch; 
    });
  }, [orders, searchTerm, selectedEvent, filterDate]);


  const filteredOrdersForTable = useMemo(() => {
    return summaryBaseOrders.filter(order => {
      const matchesStatus = filterStatus === '' || order.status === filterStatus;
      const matchesGender = filterGender === '' || order.booker.gender === filterGender;
      return matchesStatus && matchesGender;
    });
  }, [summaryBaseOrders, filterStatus, filterGender]);


  const totalPages = Math.ceil(filteredOrdersForTable.length / ITEMS_PER_PAGE);
  const currentDisplayOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrdersForTable.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrdersForTable, currentPage]);

  const totalPesananCount = useMemo(() => summaryBaseOrders.length, [summaryBaseOrders]); 
  const totalPembayaranValue = useMemo(() => summaryBaseOrders.filter(o => o.status === 'Berhasil').reduce((sum, order) => sum + order.totalPrice, 0), [summaryBaseOrders]);
  const totalPengunjung = useMemo(() => summaryBaseOrders.filter(o => o.status === 'Berhasil').reduce((sum, order) => sum + order.totalTickets, 0), [summaryBaseOrders]);
  const totalKuponTerpakai = useMemo(() => summaryBaseOrders.filter(o => o.status === 'Berhasil' && o.coupon).length, [summaryBaseOrders]);


  const summaryCards = [
    { title: 'Total Pesanan', value: totalPesananCount.toLocaleString('id-ID'), dotColor: 'bg-blue-500' },
    { title: 'Total Pembayaran', value: formatCurrency(totalPembayaranValue), dotColor: 'bg-green-500' },
    { title: 'Total Pengunjung', value: totalPengunjung.toLocaleString('id-ID'), dotColor: 'bg-indigo-500' },
    { title: 'Total Kupon Terpakai', value: totalKuponTerpakai.toLocaleString('id-ID'), dotColor: 'bg-yellow-500' },
  ];

  const handleOpenEditStatusModal = (order: OrderItem) => {
    setOrderForStatusEdit(order);
    setIsEditStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    setIsEditStatusModalOpen(false);
    setOrderForStatusEdit(null);
  };


  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["ID Pesanan", "Event", "Nama Pemesan", "Email", "No. Telepon", "Kupon", "Total Tiket", "Status", "Jenis Kelamin", "Waktu/Tanggal Pemesanan", "ID Transaksi"];
    csvContent += headers.join(",") + "\r\n";

    filteredOrdersForTable.forEach(order => { 
      const row = [
        order.id,
        `"${order.eventName.replace(/"/g, '""')}"`,
        `"${order.booker.fullName.replace(/"/g, '""')}"`,
        order.booker.email,
        order.booker.phoneNumber,
        order.coupon ? `"${order.coupon.name} (${order.coupon.code})"` : "Tidak Ada",
        order.totalTickets,
        order.status,
        order.booker.gender || "N/A",
        `"${new Date(order.orderTimestamp).toLocaleString('id-ID')}"`,
        order.transactionId,
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daftar_pesanan_event_${selectedEvent.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push('...');
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pageNumbers.push(i);
      }
      if (currentPage < totalPages - 3) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return (
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-white p-4 rounded-b-lg border-t border-gray-200">
        <p className="mb-2 sm:mb-0">
          Menampilkan {currentDisplayOrders.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrdersForTable.length)} dari {filteredOrdersForTable.length} pesanan
        </p>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((number, index) =>
            typeof number === 'string' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-500">...</span>
            ) : (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1.5 rounded-md transition-colors border focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
                  ${currentPage === number 
                    ? 'bg-hegra-turquoise text-white font-semibold border-hegra-turquoise' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
                aria-label={`Ke Halaman ${number}`}
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
            aria-label="Halaman Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (!selectedEvent) {
    return (
      <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full space-y-6 text-center">
        <ArrowLeftIcon
          size={48}
          className="mx-auto text-gray-400 my-6 cursor-pointer hover:text-hegra-turquoise"
          onClick={onBackToEventList}
          aria-label="Kembali ke daftar event"
          role="button"
        />
        <h1 className="text-xl font-semibold text-hegra-deep-navy">Pilih Event Terlebih Dahulu</h1>
        <p className="text-gray-600 mb-6">Untuk melihat daftar pesanan, silakan pilih event dari daftar event utama.</p>
        <button
            onClick={onBackToEventList}
            className="bg-hegra-turquoise text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 mx-auto"
        >
            <ArrowLeftIcon size={18} /> Kembali ke Daftar Event
        </button>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Daftar Pesanan</h1>
            <p className="text-sm text-gray-600 mt-1">
              Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong>
            </p>
        </div>
        <button
            onClick={onBackToEventList}
            className="text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors group flex items-center mt-3 sm:mt-0"
        >
            <ArrowLeftIcon size={16} className="mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Pilih Event Lain
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map(card => (
          <div key={card.title} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span className={`h-2 w-2 ${card.dotColor} rounded-full mr-2`}></span>
              {card.title}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-order" className="block text-xs font-medium text-gray-600 mb-1">Cari Pesanan</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="search-order" placeholder="ID, Nama, Email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise bg-white"/>
            </div>
          </div>
          <div>
            <label htmlFor="filter-status" className="block text-xs font-medium text-gray-600 mb-1">Status Pesanan</label>
            <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">
              <option value="">Semua Status</option>
              <option value="Berhasil">Berhasil</option>
              <option value="Pending">Pending</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
           <div>
            <label htmlFor="filter-gender-order" className="block text-xs font-medium text-gray-600 mb-1">Jenis Kelamin Pemesan</label>
            <select id="filter-gender-order" value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">
              <option value="">Semua</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          {/* Date filter input can be added here if needed */}
          <div className="flex justify-end items-center lg:col-start-4">
            <button
                onClick={handleDownloadCSV}
                className="p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                title="Download Data Pesanan (CSV)"
                aria-label="Download Data Pesanan CSV"
            >
                <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID Pesanan", "Pemesan", "Email", "Total Tiket", "Total Bayar", "Status", "Tgl. Pesan", "Aksi"].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDisplayOrders.length > 0 ? currentDisplayOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-blue-600 whitespace-nowrap hover:underline" onClick={() => { setSelectedOrderForModal(order); setShowOrderDetailModal(true); }}>{order.id}</td>
                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap max-w-[150px] truncate" title={order.booker.fullName}>{order.booker.fullName}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap max-w-[150px] truncate" title={order.booker.email}>{order.booker.email}</td>
                <td className="px-4 py-3 text-xs text-gray-700 text-center whitespace-nowrap">{order.totalTickets}</td>
                <td className="px-4 py-3 text-xs text-gray-700 font-semibold whitespace-nowrap">{formatCurrency(order.totalPrice)}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Berhasil' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{order.status}</span></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(order.orderTimestamp).toLocaleDateString('id-ID', {day:'2-digit',month:'short',year:'numeric'})}</td>
                <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                    <button onClick={() => handleOpenEditStatusModal(order)} className="text-gray-400 hover:text-hegra-turquoise p-1" aria-label="Edit Status Pesanan">
                        <Edit2 size={14} />
                    </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500"><Search size={32} className="mx-auto mb-2 text-gray-400"/>Tidak ada data pesanan yang cocok.</td></tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
      
      {showOrderDetailModal && selectedOrderForModal && (
        <OrderDetailModal
          isOpen={showOrderDetailModal}
          onClose={() => setShowOrderDetailModal(false)}
          order={selectedOrderForModal}
          fullEventData={selectedEvent} // Pass selectedEvent as fullEventData
          onNavigate={onNavigate} // Pass onNavigate
        />
      )}

      {isEditStatusModalOpen && orderForStatusEdit && (
        <EditOrderStatusModal
          isOpen={isEditStatusModalOpen}
          onClose={() => setIsEditStatusModalOpen(false)}
          orderId={orderForStatusEdit.id}
          currentStatus={orderForStatusEdit.status}
          onUpdateStatus={handleConfirmStatusUpdate}
        />
      )}
    </div>
  );
};
export default PesananDB;