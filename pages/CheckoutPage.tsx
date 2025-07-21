/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { CheckoutInfo, PageName, TransactionFormData, EventData, AuthRoleType } from '../HegiraApp'; // Changed import
import ConfirmationModal from '../components/ConfirmationModal'; 
import CheckoutConfirmationModal from '../components/CheckoutConfirmationModal'; // New Import
import { CalendarDays, MapPin, Ticket as TicketIcon, User, Mail, Phone, CreditCard, ShoppingCart, ArrowLeft, Tag, Users, Calendar, Clock, AlertCircle, LogIn } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

interface CountryCodeOption {
  code: string;
  name: string;
  flag: string; // Emoji
}

const countryCodeOptions: CountryCodeOption[] = [
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
];

// Validation Constants
const ALLOWED_PUBLIC_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 
  'icloud.com', 'live.com', 'msn.com', 'ymail.com', 'mail.com', 'zoho.com'
];
const DISALLOWED_EMAIL_DOMAINS = [
  'temp-mail.org', '10minutemail.com', 'mailinator.com', 'guerrillamail.com', 
  'throwawaymail.com', 'tempr.email', 'burner.email'
  // Add more disposable domains as needed
];
const MIN_PHONE_DIGITS = 9;

const FALLBACK_POSTER_URL = 'https://via.placeholder.com/640x240/cccccc/888888?text=Event+Poster';
const ERROR_POSTER_URL = 'https://via.placeholder.com/640x240/f0f0f0/969696?text=Image+Error';

interface LoggedInUserData {
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
}


interface CheckoutPageProps {
  checkoutInfo: CheckoutInfo;
  eventForBackNav: EventData; 
  onNavigate: (page: PageName, data?: any) => void;
  onProcessPayment: (formData: TransactionFormData, checkoutInfo: CheckoutInfo) => void;
  isLoggedIn: boolean;
  loggedInUserData?: LoggedInUserData;
  onOpenLoginModal: (role: AuthRoleType) => void;
  formatDisplayDate: (dateDisplay: string | undefined) => string;
  formatEventTime: (timeDisplay: string | undefined, timezone?: string | undefined) => string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  checkoutInfo, 
  eventForBackNav, 
  onNavigate, 
  onProcessPayment, 
  isLoggedIn, 
  loggedInUserData, 
  onOpenLoginModal,
  formatDisplayDate,
  formatEventTime
}) => {
  const { event, selectedTickets, totalPrice: originalTotalPrice } = checkoutInfo;
  
  const [formData, setFormData] = useState<Omit<TransactionFormData, 'additionalTicketHolders'>>({ 
    fullName: (isLoggedIn && loggedInUserData) ? loggedInUserData.fullName : '',
    email: (isLoggedIn && loggedInUserData) ? loggedInUserData.email : '',
    phoneNumber: '',
    gender: (isLoggedIn && loggedInUserData) ? loggedInUserData.gender : '',
    dateOfBirth: (isLoggedIn && loggedInUserData) ? loggedInUserData.dateOfBirth : '',
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+62");
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string>("");

  const [ticketHoldersData, setTicketHoldersData] = useState<Array<{ fullName: string; whatsAppNumber: string }>>([]);
  const [syncWithBookerFlags, setSyncWithBookerFlags] = useState<boolean[]>([]);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);
  const [backConfirmStep, setBackConfirmStep] = useState(1);
  const [backModalConfig, setBackModalConfig] = useState({ title: '', message: '', confirmText: 'Ya', cancelText: 'Tidak' });

  // New states for Checkout Confirmation Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentFullTransactionFormData, setCurrentFullTransactionFormData] = useState<TransactionFormData | null>(null);

  // Validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);


  useEffect(() => {
    setFormData(prev => ({ ...prev, phoneNumber: selectedCountryCode + localPhoneNumber }));
    if (localPhoneNumber.length > 0) { 
      validatePhoneNumber(localPhoneNumber);
    } else {
      setPhoneError(null); 
    }
  }, [selectedCountryCode, localPhoneNumber]);


  const totalTicketQuantity = useMemo(() => {
    return selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }, [selectedTickets]);

  const flatTicketCategoryNames = useMemo(() => {
    const names: string[] = [];
    selectedTickets.forEach(ticket => {
      for (let i = 0; i < ticket.quantity; i++) {
        names.push(ticket.categoryName);
      }
    });
    return names;
  }, [selectedTickets]);

  useEffect(() => {
    if (totalTicketQuantity > 0) {
      setTicketHoldersData(
        Array(totalTicketQuantity).fill(null).map(() => ({ fullName: '', whatsAppNumber: '' }))
      );
      setSyncWithBookerFlags(Array(totalTicketQuantity).fill(false)); 
    } else {
      setTicketHoldersData([]);
      setSyncWithBookerFlags([]);
    }
  }, [totalTicketQuantity]);
  
  useEffect(() => {
    const newHoldersData = ticketHoldersData.map((holder, idx) => {
      if (syncWithBookerFlags[idx]) {
        return {
          fullName: formData.fullName,
          whatsAppNumber: formData.phoneNumber,
        };
      }
      return holder;
    });
    if (JSON.stringify(newHoldersData) !== JSON.stringify(ticketHoldersData)) {
        setTicketHoldersData(newHoldersData);
    }
  }, [formData.fullName, formData.phoneNumber, syncWithBookerFlags, ticketHoldersData]);

  const isTicketHoldersDirty = useCallback(() => {
    return ticketHoldersData.some(
        (holder, index) => (holder.fullName !== '' || holder.whatsAppNumber !== '') && !syncWithBookerFlags[index]
    ) || syncWithBookerFlags.some(flag => flag);
  }, [ticketHoldersData, syncWithBookerFlags]);

  const isFormDirty = useCallback(() => {
    return formData.fullName !== '' || formData.email !== '' || localPhoneNumber !== '' || (selectedCountryCode !== "+62") || formData.gender !== '' || formData.dateOfBirth !== '' || isTicketHoldersDirty();
  }, [formData, localPhoneNumber, selectedCountryCode, isTicketHoldersDirty]);


  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email tidak boleh kosong.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Format email tidak valid.");
      return false;
    }
    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
    if (DISALLOWED_EMAIL_DOMAINS.includes(domain)) {
      setEmailError("Domain email tidak diizinkan. Harap gunakan email permanen.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePhoneNumber = (number: string): boolean => {
    if (!number) {
      setPhoneError("Nomor telepon tidak boleh kosong.");
      return false;
    }
    if (number.length < MIN_PHONE_DIGITS) {
      setPhoneError(`Nomor telepon minimal harus ${MIN_PHONE_DIGITS} digit.`);
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleMainFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleTicketHolderChange = (index: number, field: 'fullName' | 'whatsAppNumber', value: string) => {
    const updatedHolders = [...ticketHoldersData];
    updatedHolders[index] = { ...updatedHolders[index], [field]: value };
    setTicketHoldersData(updatedHolders);
  };
  
  const handleToggleSyncWithBooker = (index: number) => {
    const newFlags = [...syncWithBookerFlags];
    newFlags[index] = !newFlags[index];
    setSyncWithBookerFlags(newFlags);

    const updatedHolders = [...ticketHoldersData];
    if (newFlags[index]) { 
      updatedHolders[index] = {
        fullName: formData.fullName,
        whatsAppNumber: formData.phoneNumber,
      };
    }
    setTicketHoldersData(updatedHolders);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "diskon10") {
        const discountAmount = originalTotalPrice * 0.10;
        setDiscountedPrice(originalTotalPrice - discountAmount);
        setCouponApplied(true);
        alert("Kupon DISKON10 berhasil diterapkan! Anda mendapat diskon 10%.");
    } else if (couponCode.trim() === "") {
        setDiscountedPrice(null);
        setCouponApplied(false);
        alert("Masukkan kode kupon.");
    } else {
        setDiscountedPrice(null);
        setCouponApplied(false);
        alert("Kode kupon tidak valid.");
    }
  };
  
  const effectiveTotalPrice = discountedPrice !== null ? discountedPrice : originalTotalPrice;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isEmailValid = isLoggedIn || validateEmail(formData.email);
    const isPhoneValid = validatePhoneNumber(localPhoneNumber);

    if (!formData.fullName || !formData.email || !localPhoneNumber || !formData.gender || !formData.dateOfBirth) {
        alert("Harap lengkapi semua data pemesan.");
        return;
    }

    if (!isEmailValid || !isPhoneValid) {
      alert("Harap perbaiki error pada form sebelum melanjutkan.");
      return;
    }

    if (ticketHoldersData.some((holder, index) => !syncWithBookerFlags[index] && (!holder.fullName || !holder.whatsAppNumber))) {
        alert("Harap lengkapi semua data pemegang tiket yang tidak disinkronkan dari data pemesan.");
        return;
    }

    const fullTransactionData: TransactionFormData = {
      ...formData,
      phoneNumber: selectedCountryCode + localPhoneNumber,
      additionalTicketHolders: ticketHoldersData,
    };
    
    setCurrentFullTransactionFormData(fullTransactionData);
    setShowConfirmationModal(true);
  };

  const handleConfirmAndPay = () => {
    if (!currentFullTransactionFormData) return;

    const checkoutDataForPayment: CheckoutInfo = {
      ...checkoutInfo,
      totalPrice: effectiveTotalPrice, 
    };
    
    setShowConfirmationModal(false);
    // Call the new prop function to initiate payment processing in HegiraApp
    onProcessPayment(currentFullTransactionFormData, checkoutDataForPayment);
  };

  const handleCancelPaymentConfirmation = () => {
    setShowConfirmationModal(false);
    setCurrentFullTransactionFormData(null);
  };


  const handleBackNavigation = () => {
    if (isFormDirty()) {
      setBackConfirmStep(1);
      setBackModalConfig({
        title: "Kembali ke Detail Event?",
        message: "Data formulir yang sudah Anda isi akan hilang. Apakah Anda yakin ingin melanjutkan?",
        confirmText: "Ya, Lanjutkan",
        cancelText: "Tidak, Tetap di Sini"
      });
      setShowBackConfirmModal(true);
    } else {
      onNavigate('eventDetail', eventForBackNav); 
    }
  };

  const handleLocalConfirmForBack = () => {
    if (backConfirmStep === 1) {
      setBackConfirmStep(2);
      setBackModalConfig({
        title: "Konfirmasi Kembali Sekali Lagi",
        message: "Ini akan MENGHAPUS SEMUA data yang telah Anda masukkan dan Anda akan kembali ke halaman detail event. Apakah Anda benar-benar yakin?",
        confirmText: "Ya, Hapus & Kembali",
        cancelText: "Tidak, Batalkan"
      });
    } else if (backConfirmStep === 2) {
      setShowBackConfirmModal(false);
      setLocalPhoneNumber(""); 
      setSelectedCountryCode("+62");
      setTicketHoldersData(Array(totalTicketQuantity).fill(null).map(() => ({ fullName: '', whatsAppNumber: '' })));
      setSyncWithBookerFlags(Array(totalTicketQuantity).fill(false));
      setEmailError(null);
      setPhoneError(null);
      onNavigate('eventDetail', eventForBackNav);
    }
  };

  const handleLocalCancelForBack = () => {
    setShowBackConfirmModal(false);
    setBackConfirmStep(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12 pb-40 lg:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBackNavigation}
            className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke Detail Event
          </button>
        </div>

        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-jakarta text-hegra-navy">Konfirmasi Pesanan Anda</h1>
          <p className="mt-2 text-lg text-gray-600">Silakan periksa detail pesanan Anda dan lengkapi data diri.</p>
        </header>

        <div className="lg:flex lg:gap-8">
          <div className="hidden lg:block lg:w-1/3 bg-white rounded-xl border border-hegra-navy/10 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '37.5%' }}>
              <img
                src={event.coverImageUrl || event.posterUrl || FALLBACK_POSTER_URL}
                alt={`Poster ${event.name}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = ERROR_POSTER_URL)}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold font-jakarta text-hegra-navy mb-6 border-b pb-3 flex items-center">
                <TicketIcon size={24} className="mr-3 text-hegra-turquoise" />
                Detail Tiket
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold font-jakarta text-hegra-navy mb-2">{event.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <CalendarDays size={16} className="mr-2 text-hegra-turquoise" />
                  <span>{formatDisplayDate(event.dateDisplay)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock size={16} className="mr-2 text-hegra-turquoise" />
                  <span>{formatEventTime(event.timeDisplay, event.timezone)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-hegra-turquoise" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-md font-jakarta font-semibold text-hegra-navy">Tiket yang Dipilih:</h4>
                {selectedTickets.map(ticket => (
                  <div key={ticket.categoryId} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-800">{ticket.categoryName} (x{ticket.quantity})</p>
                      <p className="text-xs text-gray-500">{formatCurrency(ticket.pricePerTicket)} / tiket</p>
                    </div>
                    <p className="font-semibold text-gray-800">{formatCurrency(ticket.quantity * ticket.pricePerTicket)}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6 border-t pt-4">
                <label htmlFor="couponCodeDesktop" className="block text-sm font-medium text-gray-700 mb-1">Kode Kupon</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    id="couponCodeDesktop"
                    name="couponCodeDesktop"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Masukkan kode kupon"
                    className="flex-grow py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    aria-label="Terapkan kupon"
                    className="bg-hegra-turquoise text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Tag size={20} />
                  </button>
                </div>
                {couponApplied && discountedPrice !== null && (
                  <p className="text-xs text-green-600 mt-1">Kupon diterapkan! Diskon 10%.</p>
                )}
              </div>

              <div className="border-t pt-4">
                {couponApplied && discountedPrice !== null && (
                  <div className="flex justify-between items-center text-sm text-gray-500 line-through">
                      <span>Subtotal</span>
                      <span>{formatCurrency(originalTotalPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold mt-1">
                  <span className="text-hegra-navy">Total Pembayaran:</span>
                  <span className="text-hegra-yellow">{formatCurrency(effectiveTotalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} id="checkoutForm" className="lg:w-2/3 bg-white p-6 md:p-8 rounded-xl border border-hegra-navy/10">
            <div className="lg:hidden bg-gray-50 p-4 rounded-lg border border-hegra-navy/10 mb-6">
                <h2 className="text-xl font-semibold font-jakarta text-hegra-navy mb-4 border-b pb-2 flex items-center">
                    <TicketIcon size={22} className="mr-2 text-hegra-turquoise"/>
                    Detail Tiket
                </h2>
                <div className="mb-4">
                    <h3 className="text-lg font-jakarta font-semibold text-hegra-navy mb-1">{event.name}</h3>
                    <div className="flex items-center text-xs text-gray-600 mb-0.5">
                        <CalendarDays size={14} className="mr-1.5 text-hegra-turquoise" />
                        <span>{formatDisplayDate(event.dateDisplay)}</span>
                    </div>
                     <div className="flex items-center text-xs text-gray-600 mb-0.5">
                        <Clock size={14} className="mr-1.5 text-hegra-turquoise" />
                        <span>{formatEventTime(event.timeDisplay, event.timezone)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <MapPin size={14} className="mr-1.5 text-hegra-turquoise" />
                        <span>{event.location}</span>
                    </div>
                </div>
                <div className="space-y-2 mb-4 border-b pb-4">
                    <h4 className="text-sm font-jakarta font-semibold text-hegra-navy">Tiket:</h4>
                    {selectedTickets.map(ticket => (
                        <div key={ticket.categoryId} className="flex justify-between items-center text-xs p-2 bg-white rounded-md border">
                        <div>
                            <p className="font-medium text-gray-700">{ticket.categoryName} (x{ticket.quantity})</p>
                            <p className="text-gray-500">{formatCurrency(ticket.pricePerTicket)}</p>
                        </div>
                        <p className="font-semibold text-gray-700">{formatCurrency(ticket.quantity * ticket.pricePerTicket)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="text-2xl font-semibold font-jakarta text-hegra-navy mb-2 border-b pb-3">Data Pemesan</h2>
            
            {!isLoggedIn && (
                <div className="my-4 text-center bg-hegra-turquoise/10 p-3 rounded-lg border border-hegra-turquoise/20">
                    <button onClick={() => onOpenLoginModal("Event Visitor")} className="text-sm font-semibold text-hegra-turquoise hover:text-hegra-navy transition-colors flex items-center justify-center w-full gap-2">
                        <LogIn size={16} /> Login untuk memudahkan pengisian form
                    </button>
                </div>
            )}
            
            <div className="space-y-6 mt-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Sesuai KTP/Identitas</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input 
                    type="text" name="fullName" id="fullName" required 
                    className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white" 
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.fullName} onChange={handleMainFormInputChange} aria-describedby="fullName-hint"
                  />
                </div>
                <p id="fullName-hint" className="mt-1 text-xs text-gray-500">Pastikan nama sesuai dengan identitas untuk verifikasi.</p>
              </div>

              {isLoggedIn && loggedInUserData ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email Aktif</label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <p className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">{loggedInUserData.email}</p>
                    </div>
                    <p id="email-hint" className="mt-1 text-xs text-gray-500">E-tiket akan dikirimkan ke alamat email ini.</p>
                </div>
              ) : (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email Aktif</label>
                   <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input 
                      type="email" name="email" id="email" required 
                      className={`w-full py-2.5 px-4 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="cth: email@anda.com" value={formData.email} 
                      onChange={handleMainFormInputChange} 
                      onBlur={(e) => validateEmail(e.target.value)}
                      aria-describedby="email-hint email-error"
                      aria-invalid={!!emailError}
                    />
                  </div>
                  {emailError && <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{emailError}</p>}
                  <p id="email-hint" className="mt-1 text-xs text-gray-500">E-tiket akan dikirimkan ke alamat email ini.</p>
                </div>
              )}

              <div>
                <label htmlFor="localPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <div className="relative flex items-stretch w-full mt-1">
                  <div className="relative">
                    <label htmlFor="countryCode" className="sr-only">Kode Negara</label>
                    <select 
                      id="countryCode" 
                      name="countryCode" 
                      value={selectedCountryCode} 
                      onChange={(e) => setSelectedCountryCode(e.target.value)} 
                      className="appearance-none z-10 h-full block w-auto py-2.5 pl-3 pr-8 text-sm text-gray-900 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 bg-white"
                    >
                      {countryCodeOptions.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.flag} {opt.code}</option>
                      ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="tel" name="localPhoneNumber" id="localPhoneNumber" required 
                      className={`block w-full py-2.5 pl-10 pr-3 text-sm border rounded-r-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 focus:z-20 shadow-sm bg-white ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="81234567890" 
                      value={localPhoneNumber} 
                      onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      onBlur={(e) => validatePhoneNumber(e.target.value)}
                      aria-describedby="phoneNumber-hint phone-error"
                      aria-invalid={!!phoneError}
                    />
                  </div>
                </div>
                {phoneError && <p id="phone-error" className="mt-1 text-xs text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{phoneError}</p>}
                <div className="mt-2 flex items-center">
                    <input type="checkbox" id="isWhatsappActive" name="isWhatsappActive" defaultChecked className="h-4 w-4 text-hegra-turquoise border-gray-300 rounded focus:ring-hegra-turquoise/20 cursor-not-allowed" disabled />
                    <label htmlFor="isWhatsappActive" className="ml-2 block text-xs text-gray-600">Nomor WhatsApp Aktif</label>
                </div>
                <p id="phoneNumber-hint" className="mt-1 text-xs text-gray-500">Digunakan untuk konfirmasi dan informasi penting. Masukkan tanpa angka 0 di depan.</p>
              </div>

              {isLoggedIn && loggedInUserData ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <div className="relative mt-1">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <p className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">{loggedInUserData.gender || 'N/A'}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                        <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <p className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">{loggedInUserData.dateOfBirth ? new Date(loggedInUserData.dateOfBirth + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                        </div>
                    </div>
                </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                      <div className="relative mt-1">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                          <select 
                              name="gender" id="gender" required 
                              className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors appearance-none bg-white"
                              value={formData.gender} onChange={handleMainFormInputChange}
                          >
                              <option value="" disabled>Pilih jenis kelamin</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                              <option value="Lainnya">Lainnya</option>
                          </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                      <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                          <input 
                              type="date" name="dateOfBirth" id="dateOfBirth" required 
                              className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white"
                              value={formData.dateOfBirth} onChange={handleMainFormInputChange}
                          />
                      </div>
                  </div>
                </div>
              )}
            </div>

            {ticketHoldersData.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                    <h2 className="text-xl font-semibold font-jakarta text-hegra-navy mb-4">Data Pemegang Tiket</h2>
                    {ticketHoldersData.map((holder, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-md font-semibold font-jakarta text-hegra-navy">
                                  Data untuk Tiket {index + 1}: <span className="font-normal font-sans text-gray-700">{flatTicketCategoryNames[index] || 'Tiket'}</span>
                                </h3>
                                <label htmlFor={`syncData-${index}`} className="flex items-center cursor-pointer">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      id={`syncData-${index}`}
                                      className="sr-only peer"
                                      checked={syncWithBookerFlags[index] || false}
                                      onChange={() => handleToggleSyncWithBooker(index)}
                                    />
                                    <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-hegra-turquoise transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
                                  </div>
                                  <span className="ml-2 text-xs text-gray-700 font-medium">Sama dengan Data Pemesan</span>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor={`ticketHolderFullName-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                      <input 
                                        type="text" id={`ticketHolderFullName-${index}`} required
                                        value={holder.fullName}
                                        onChange={(e) => handleTicketHolderChange(index, 'fullName', e.target.value)}
                                        disabled={syncWithBookerFlags[index]}
                                        className="w-full py-2 px-3 pl-9 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm disabled:bg-white disabled:text-gray-500 bg-white"
                                        placeholder="Nama pemegang tiket"
                                      />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor={`ticketHolderWhatsApp-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                                    <div className="relative">
                                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                     <input 
                                        type="tel" id={`ticketHolderWhatsApp-${index}`} required
                                        value={holder.whatsAppNumber}
                                        onChange={(e) => handleTicketHolderChange(index, 'whatsAppNumber', e.target.value)}
                                        disabled={syncWithBookerFlags[index]}
                                        className="w-full py-2 px-3 pl-9 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm disabled:bg-white disabled:text-gray-500 bg-white"
                                        placeholder="Nomor WhatsApp pemegang tiket"
                                      />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="pt-6 border-t mt-6">
                 <h3 className="text-lg font-jakarta font-semibold text-hegra-navy mb-3">Metode Pembayaran</h3>
                 <p className="text-sm text-gray-600 mb-3">Pilihan metode pembayaran akan tersedia di langkah berikutnya setelah konfirmasi data ini. Untuk saat ini, ini adalah simulasi.</p>
                 <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-3 border border-gray-200">
                    <CreditCard size={24} className="text-hegra-turquoise flex-shrink-0"/>
                    <span className="text-gray-700 text-sm">Anda akan diarahkan ke halaman simulasi proses pembayaran setelah mengkonfirmasi data.</span>
                 </div>
            </div>
              
            <div className="hidden lg:block mt-8 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-4">
                Dengan mengklik tombol di bawah, Anda menyetujui <a href="#" className="text-hegra-turquoise hover:underline">Syarat & Ketentuan Pembelian Tiket</a> dan <a href="#" className="text-hegra-turquoise hover:underline">Kebijakan Privasi</a> Hegira.
            </p>
            <button 
                type="submit"
                className="w-full bg-hegra-yellow text-hegra-navy font-bold py-3.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-hegra-navy focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
                <ShoppingCart size={22} className="mr-1"/>
                Konfirmasi Data & Lanjutkan
            </button>
            </div>
          </form>
        </div>
      </div>
      {showBackConfirmModal && (
        <ConfirmationModal
          isOpen={showBackConfirmModal}
          title={backModalConfig.title}
          message={backModalConfig.message}
          confirmText={backModalConfig.confirmText}
          cancelText={backModalConfig.cancelText}
          onConfirm={handleLocalConfirmForBack}
          onCancel={handleLocalCancelForBack}
          confirmButtonClass={backConfirmStep === 2 ? "bg-red-700 hover:bg-red-800 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
        />
      )}

      {showConfirmationModal && currentFullTransactionFormData && (
        <CheckoutConfirmationModal
          isOpen={showConfirmationModal}
          onClose={handleCancelPaymentConfirmation}
          onConfirm={handleConfirmAndPay}
          checkoutInfo={checkoutInfo} 
          fullFormData={currentFullTransactionFormData}
          effectiveTotalPrice={effectiveTotalPrice}
        />
      )}

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white p-3 border-t border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-xs text-gray-500">Total Pembayaran</p>
                    <p className="text-lg font-bold text-hegra-yellow">{formatCurrency(effectiveTotalPrice)}</p>
                </div>
                 {couponApplied && discountedPrice !== null && (
                     <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Diskon 10%</span>
                 )}
            </div>
            <div className="flex gap-2 mb-2.5 items-center">
                <input
                    type="text"
                    name="couponCodeMobileSticky"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Kode Kupon"
                    className="flex-grow py-2 px-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-xs bg-white"
                    aria-label="Kode Kupon Mobile"
                />
                <button
                    type="button"
                    onClick={handleApplyCoupon}
                    aria-label="Terapkan kupon"
                    className="bg-hegra-turquoise text-white p-1.5 rounded-md hover:bg-opacity-90"
                >
                    <Tag size={18} />
                </button>
            </div>

            <button
                type="submit"
                form="checkoutForm"
                className="w-full bg-hegra-yellow text-hegra-navy font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm"
            >
                <ShoppingCart size={18} />
                Lanjutkan ke Pembayaran
            </button>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                Dengan melanjutkan, Anda menyetujui S&K Hegira.
            </p>
        </div>
    </div>
  );
};

export default CheckoutPage;