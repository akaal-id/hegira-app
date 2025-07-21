/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import BusinessMatchingCard, { BusinessMatchingCardData } from '../components/BusinessMatchingCard';
import VendorMap from '../components/business/VendorMap';
import MeetingSchedulerModal from '../components/business/MeetingSchedulerModal';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw, MapPin as LocationIcon, Briefcase, Users, Award, Star, Filter, X } from 'lucide-react';
import { PageName } from '../HegiraApp';
import Logo from '../components/Logo'; 

const sampleVendors: BusinessMatchingCardData[] = [
  { id: 1, logoUrl: 'https://picsum.photos/seed/logo1/100/100', name: 'PT Inovasi Digital Nusantara', matchScore: 4.5, sector: 'Teknologi Informasi', location: 'Jakarta Selatan, DKI Jakarta', budget: 'Rp 50M - Rp 100M', lat: -6.2607, lng: 106.8100, isOnline: true, specialFeatures: ['Verified', 'Respon Cepat'], description: "Perusahaan terdepan dalam solusi AI dan Big Data, membantu transformasi digital bisnis Anda.", keyMetrics: [{label:"Proyek Selesai", value:"120+"}, {label:"Klien Puas", value:"98%"}, {label:"Tahun Pengalaman", value:"8"}], portfolio: [{title: "Sistem ERP Cerdas", description:"Implementasi ERP berbasis AI untuk efisiensi operasional.", imageUrl:"https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"}], reviews: [{author:"Budi Corp", rating:5, comment:"Solusi AI mereka sangat membantu!", date:"2024-07-01"}], contact:{email:"sales@inovasidigital.com", phone:"+6221500123"}},
  { id: 2, logoUrl: 'https://picsum.photos/seed/logo2/100/100', name: 'Studio Kreasi Bersama', matchScore: 4.2, sector: 'Industri Kreatif', location: 'Bandung, Jawa Barat', budget: 'Rp 10M - Rp 50M', lat: -6.9175, lng: 107.6191, isOnline: false, specialFeatures: ['Portofolio Kuat'], description: "Agensi kreatif full-service, mulai dari branding, desain grafis, hingga produksi video.", portfolio: [{title:"Branding Kopi Lokal", description:"Rebranding lengkap untuk merek kopi ternama.", imageUrl: "https://images.unsplash.com/photo-1511920183318-afa7a848f096?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"}], reviews: [{author:"Siska Creative", rating:4, comment:"Desainnya oke banget!", date:"2024-06-15"}], contact:{website:"studiokreasi.co.id"}},
  { id: 3, logoUrl: 'https://picsum.photos/seed/logo3/100/100', name: 'Manufaktur Presisi Indonesia', matchScore: 4.8, sector: 'Manufaktur', location: 'Surabaya, Jawa Timur', budget: 'Rp 100M - Rp 500M', lat: -7.2575, lng: 112.7521, isOnline: true, specialFeatures: ['ISO Certified', 'Verified'] },
  { id: 4, logoUrl: 'https://picsum.photos/seed/logo4/100/100', name: 'Solusi Edukasi Cemerlang', matchScore: 3.9, sector: 'Pendidikan', location: 'Yogyakarta, DIY', budget: 'Rp 5M - Rp 20M', lat: -7.7956, lng: 110.3695, isOnline: true, specialFeatures: ['Terakreditasi'] },
  { id: 5, logoUrl: 'https://picsum.photos/seed/logo5/100/100', name: 'Agro Makmur Sejahtera Tbk', matchScore: 4.6, sector: 'Agrikultur', location: 'Medan, Sumatera Utara', budget: 'Rp 200M - Rp 1T', lat: 3.5952, lng: 98.6722, isOnline: false, specialFeatures: ['Skala Besar', 'Verified'] },
  { id: 6, logoUrl: 'https://picsum.photos/seed/logo6/100/100', name: 'Layanan Kesehatan Prima', matchScore: 4.1, sector: 'Kesehatan', location: 'Semarang, Jawa Tengah', budget: 'Rp 30M - Rp 70M', lat: -6.9667, lng: 110.4381, isOnline: true, specialFeatures: ['Respon Cepat'] },
  { id: 7, logoUrl: 'https://picsum.photos/seed/logo7/100/100', name: 'Jasa Keuangan Andalan', matchScore: 4.3, sector: 'Jasa Keuangan', location: 'Jakarta Pusat, DKI Jakarta', budget: 'Rp 75M - Rp 150M', lat: -6.1751, lng: 106.8650, isOnline: false, specialFeatures: ['OJK Terdaftar', 'Verified'] },
  { id: 8, logoUrl: 'https://picsum.photos/seed/logo8/100/100', name: 'Retail Maju Jaya', matchScore: 4.0, sector: 'Retail', location: 'Bekasi, Jawa Barat', budget: 'Rp 20M - Rp 60M', lat: -6.2383, lng: 106.9756, isOnline: true, specialFeatures: [] },
];

const ITEMS_PER_PAGE = 6; 
const ALL_SECTORS = "Semua Sektor";

const industrialSectors = [
  ALL_SECTORS, "Teknologi Informasi", "Industri Kreatif", "Manufaktur", 
  "Pendidikan", "Agrikultur", "Kesehatan", "Jasa Keuangan", "Retail"
];

const specialFeaturesOptions = ["Verified", "Respon Cepat", "Portofolio Kuat", "ISO Certified", "Terakreditasi", "Skala Besar", "OJK Terdaftar"];


interface BusinessMatchingPageProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const BusinessMatchingPage: React.FC<BusinessMatchingPageProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSectors, setSelectedSectors] = useState<string[]>([ALL_SECTORS]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(50); // Default radius
  const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState<string[]>([]);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [schedulingForVendor, setSchedulingForVendor] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.548926, 118.0148634]); // Default Indonesia center
  const [mapZoom, setMapZoom] = useState(5); // Default zoom
  const [activeVendorIdOnMap, setActiveVendorIdOnMap] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSectors([ALL_SECTORS]);
    setSelectedLocation('');
    setRadiusFilter(50);
    setSelectedSpecialFeatures([]);
    setCurrentPage(1);
    setMapCenter([-2.548926, 118.0148634]);
    setMapZoom(5);
    if (isMobileFilterOpen) setIsMobileFilterOpen(false);
  };

  const handleSectorToggle = (sector: string) => {
    if (sector === ALL_SECTORS) {
      setSelectedSectors([ALL_SECTORS]);
    } else {
      setSelectedSectors(prev => {
        const newSectors = prev.includes(ALL_SECTORS) ? [] : prev;
        if (newSectors.includes(sector)) {
          const filtered = newSectors.filter(s => s !== sector);
          return filtered.length === 0 ? [ALL_SECTORS] : filtered;
        } else {
          return [...newSectors, sector];
        }
      });
    }
  };
  
  const handleFeatureToggle = (feature: string) => {
    setSelectedSpecialFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const filteredVendors = useMemo(() => {
    return sampleVendors.filter(vendor => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = vendor.name.toLowerCase().includes(searchTermLower);
      const locationMatch = vendor.location.toLowerCase().includes(searchTermLower);
      const sectorMatchSearch = vendor.sector.toLowerCase().includes(searchTermLower);

      const sectorFilterMatch = selectedSectors.includes(ALL_SECTORS) || selectedSectors.includes(vendor.sector);
      const featureFilterMatch = selectedSpecialFeatures.length === 0 || selectedSpecialFeatures.every(sf => vendor.specialFeatures?.includes(sf));
      
      // Placeholder for location and radius filtering logic (not fully implemented on map yet)
      const locationInputMatch = selectedLocation === '' || vendor.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return (nameMatch || locationMatch || sectorMatchSearch) && sectorFilterMatch && featureFilterMatch && locationInputMatch;
    });
  }, [searchTerm, selectedSectors, selectedSpecialFeatures, selectedLocation]);

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);
  const currentVendors = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredVendors.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredVendors]);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const handleMeetingScheduled = (details: {vendorName: string, date: Date, timeSlot: string, duration: string, type: string, agenda: string}) => {
    alert(`Permintaan meeting untuk ${details.vendorName} pada ${details.date.toLocaleDateString()} slot ${details.timeSlot} telah dikirim!\nAgenda: ${details.agenda}`);
    setIsMeetingModalOpen(false);
    setSchedulingForVendor(null);
  };
  
  const handleMarkerClick = (vendor: BusinessMatchingCardData) => {
    if (vendor.lat && vendor.lng) {
      setMapCenter([vendor.lat, vendor.lng]);
      setMapZoom(12);
      setActiveVendorIdOnMap(vendor.id);
      const cardElement = document.getElementById(`vendor-card-${vendor.id}`);
      cardElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  
  const applyFiltersAction = () => {
    if (isMobileFilterOpen) setIsMobileFilterOpen(false);
    setCurrentPage(1); 
    alert("Filter diterapkan! (Simulasi)");
  };


  const FilterControls = ({ forMobile }: { forMobile?: boolean }) => (
    <div className={`space-y-5 ${forMobile ? 'p-4' : ''}`}>
      {forMobile && (
        <div className="flex justify-between items-center mb-4">
          <Logo variant="sidebar" />
          <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 hover:text-hegra-turquoise">
            <X size={24} />
          </button>
        </div>
      )}
      {!forMobile && (
        <h2 className="text-xl font-semibold font-jakarta text-hegra-deep-navy mb-5 flex items-center">
          <SlidersHorizontal size={22} className="mr-2.5 text-hegra-turquoise" /> Filter Cerdas
        </h2>
      )}

      <div>
        <label htmlFor={`search-partner-${forMobile ? 'mobile' : 'sidebar'}`} className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" id={`search-partner-${forMobile ? 'mobile' : 'sidebar'}`} placeholder="Nama, Lokasi, Sektor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 bg-white"/>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1.5">Sektor Bisnis</h3>
        <div className="flex flex-wrap gap-1.5">
          {industrialSectors.map(sector => (
            <button key={sector} onClick={() => handleSectorToggle(sector)} className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${selectedSectors.includes(sector) ? 'bg-hegra-turquoise text-white border-hegra-turquoise' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>
              {sector}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1.5">Fitur Khusus</h3>
        <div className="space-y-1.5">
        {specialFeaturesOptions.map(feature => (
            <label key={feature} className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={selectedSpecialFeatures.includes(feature)} onChange={() => handleFeatureToggle(feature)} className="form-checkbox h-3.5 w-3.5 text-hegra-turquoise rounded border-gray-300 focus:ring-hegra-turquoise/20"/>
                <span>{feature}</span>
            </label>
        ))}
        </div>
      </div>

      <div>
        <label htmlFor={`location-search-${forMobile ? 'mobile' : 'sidebar'}`} className="block text-sm font-medium text-gray-700 mb-1">Cari Lokasi di Peta</label>
         <div className="relative">
             <LocationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input type="text" id={`location-search-${forMobile ? 'mobile' : 'sidebar'}`} placeholder="cth: Jakarta Pusat" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 bg-white" />
        </div>
      </div>
      <div>
         <label htmlFor={`radiusFilter-${forMobile ? 'mobile' : 'sidebar'}`} className="block text-sm font-medium text-gray-700 mb-1">Radius Filter: <span className="font-bold text-hegra-turquoise">{radiusFilter} km</span></label>
         <input type="range" id={`radiusFilter-${forMobile ? 'mobile' : 'sidebar'}`} min="5" max="200" step="5" value={radiusFilter} onChange={(e) => setRadiusFilter(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-hegra-turquoise focus:outline-none focus:ring-2 focus:ring-hegra-turquoise/20" />
      </div>

      <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
        <button onClick={applyFiltersAction} className="w-full bg-hegra-yellow text-hegra-navy font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm">Terapkan Filter</button>
        <button onClick={resetFilters} className="w-full text-gray-600 hover:text-hegra-turquoise font-medium py-2 px-4 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors text-sm flex items-center justify-center gap-1.5">
          <RotateCcw size={14}/> Reset Filter
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-hegra-turquoise/10 via-hegra-yellow/10 to-hegra-turquoise/10 relative" style={{ paddingTop: '37.5%' /* 16:6 aspect ratio */ }}>
        {/* Placeholder for a background image or content */}
        {/* <img src="/placeholder-banner.jpg" alt="Business Matching Banner" className="absolute inset-0 w-full h-full object-cover opacity-80"/> */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <h1 className="text-4xl font-bold text-white text-shadow-lg">Connect & Grow</h1> */}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-6 md:mb-8 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Jelajahi <span className="text-gradient">Peluang Bisnis</span> Anda
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-600 max-w-3xl mx-auto lg:mx-0">
              Temukan mitra, vendor, dan investor potensial. Bangun koneksi strategis.
            </p>
          </div>
          <button 
            className="lg:hidden mt-4 bg-hegra-turquoise text-white px-4 py-2 rounded-lg shadow hover:bg-opacity-90 flex items-center gap-2"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={18}/> Tampilkan Filter
          </button>
        </header>
        
        <div className="mb-6 md:mb-8 h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-10">
          <VendorMap vendors={filteredVendors} center={mapCenter} zoom={mapZoom} radius={radiusFilter * 1000} activeVendorId={activeVendorIdOnMap} onMarkerClick={handleMarkerClick} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 bg-white p-5 rounded-xl shadow-lg border border-gray-200 self-start sticky top-24">
            <FilterControls />
          </aside>

          {/* Main Content: Cards */}
          <main className="w-full lg:w-3/4 xl:w-4/5">
            {filteredVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {currentVendors.map(vendor => (
                  <div key={vendor.id} id={`vendor-card-${vendor.id}`}>
                    <BusinessMatchingCard {...vendor} onNavigate={onNavigate} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">Tidak ada mitra yang cocok.</p>
                <p className="text-sm text-gray-400 mt-2">Coba sesuaikan filter Anda atau perluas pencarian.</p>
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Paginasi partner" className="mt-10 md:mt-12 flex justify-center">
                <ul className="inline-flex items-center -space-x-px shadow-sm">
                  <li><button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="pagination-arrow rounded-l-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"><ChevronLeft size={18}/></button></li>
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                    <li key={num}><button onClick={() => handlePageChange(num)} className={`pagination-number ${currentPage === num ? 'active' : ''} focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50`}>{num}</button></li>
                  ))}
                  <li><button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="pagination-arrow rounded-r-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"><ChevronRight size={18}/></button></li>
                </ul>
              </nav>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl p-0 transform transition ease-in-out duration-300 translate-x-0 flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <FilterControls forMobile={true} />
            </div>
          </div>
        </div>
      )}

      {isMeetingModalOpen && schedulingForVendor && (
        <MeetingSchedulerModal
          isOpen={isMeetingModalOpen}
          onClose={() => { setIsMeetingModalOpen(false); setSchedulingForVendor(null); }}
          vendorName={schedulingForVendor}
          onSchedule={handleMeetingScheduled}
        />
      )}
      <style>{`
        .pagination-arrow { padding: 0.5rem 0.75rem; line-height: 1.25rem; color: #6b7280; background-color: white; border: 1px solid #e5e7eb; }
        .pagination-arrow:hover { background-color: #f9fafb; color: var(--hegra-turquoise); }
        .pagination-arrow:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination-number { padding: 0.5rem 1rem; line-height: 1.25rem; border: 1px solid #e5e7eb; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .pagination-number:hover { background-color: #f9fafb; color: var(--hegra-turquoise); }
        .pagination-number.active { color: white; background-color: var(--hegra-turquoise); border-color: var(--hegra-turquoise); font-weight: 600; z-index: 10; }
      `}</style>
    </div>
  );
};

export default BusinessMatchingPage;