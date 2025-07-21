
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PageName } from '../../HegiraApp';
import { BusinessMatchingCardData } from '../../components/BusinessMatchingCard';
import CompanyDetailHeader from '../../components/business/detail/CompanyDetailHeader';
import CompanyMetrics from '../../components/business/detail/CompanyMetrics';
import CompanyAboutSection from '../../components/business/detail/CompanyAboutSection';
import PortfolioCarousel from '../../components/business/detail/PortfolioCarousel';
import CompanyReviews from '../../components/business/detail/CompanyReviews';
import StickyActionSidebar from '../../components/business/detail/StickyActionSidebar';
import MeetingSchedulerModal from '../../components/business/MeetingSchedulerModal';
import { Briefcase, MapPin, DollarSign, Users, BarChart3, Heart, Award, CalendarCheck, MessageSquare, Send } from 'lucide-react';


// Sample detailed data for a company (Acme Event Solutions)
const acmeEventSolutionsData: BusinessMatchingCardData = {
  id: 1001,
  name: 'Acme Event Solutions',
  logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', // Example logo
  matchScore: 4.7, 
  sector: 'Event Management & Production',
  location: 'Jakarta Pusat, DKI Jakarta',
  budget: 'Fleksibel (Proyek Basis)',
  lat: -6.1751, 
  lng: 106.8650,
  isOnline: true,
  specialFeatures: ['Tim Profesional', 'Portofolio Luas', 'Respon Cepat', 'Teknologi Terbaru'],
  description: `Acme Event Solutions adalah perusahaan manajemen event terkemuka yang berdedikasi untuk menciptakan pengalaman acara yang tak terlupakan. Dengan tim berpengalaman dan jaringan vendor yang luas, kami menangani semua aspek event Anda, mulai dari konsep kreatif, perencanaan anggaran, produksi teknis, hingga pelaksanaan di lapangan. Kami telah berhasil menyelenggarakan berbagai jenis acara, termasuk konferensi perusahaan, peluncuran produk, pameran dagang, konser musik, dan acara sosial.<br/><br/>
                Fokus kami adalah pada inovasi, detail, dan kepuasan klien. Kami percaya bahwa setiap event adalah unik dan harus mencerminkan visi serta tujuan klien kami. Dengan pendekatan kolaboratif, kami bekerja sama dengan Anda untuk memastikan setiap detail tereksekusi dengan sempurna.`,
  keyMetrics: [
    { label: "Total Event Diselenggarakan", value: "500+", icon: Briefcase },
    { label: "Klien Korporat Terlayani", value: "150+", icon: Users },
    { label: "Rating Kepuasan Klien", value: "4.8/5", icon: Heart },
    { label: "Jangkauan Peserta Terbesar", value: "10,000+", icon: BarChart3 },
  ],
  portfolio: [
    { title: "Global Tech Summit 2023", description: "Konferensi teknologi internasional dengan 2000+ peserta dari 50 negara. Menampilkan pembicara utama dan sesi interaktif.", imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Music Fest 'Soundrenaline Reborn'", description: "Festival musik multi-genre yang menghadirkan artis lokal dan internasional. Pengelolaan panggung, logistik, dan keamanan.", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Product Launch 'InnovateX'", description: "Peluncuran produk teknologi inovatif dengan konsep acara yang imersif dan futuristik.", imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Pameran Seni Kontemporer 'ArtVolution'", description: "Pameran seni yang menampilkan karya-karya seniman muda berbakat. Kurasi, instalasi, dan promosi.", imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
  ],
  reviews: [
    { author: "PT Inovasi Jaya", rating: 5, comment: "Acme sangat profesional dan kreatif! Event kami berjalan sukses besar berkat mereka.", date: "15 Juli 2024" },
    { author: "XYZ Corporation", rating: 4, comment: "Tim yang responsif dan solutif. Ada beberapa kendala kecil, tapi secara keseluruhan memuaskan.", date: "10 Juni 2024" },
    { author: "Creative Labs ID", rating: 5, comment: "Konsep yang ditawarkan selalu segar dan out-of-the-box. Sangat direkomendasikan!", date: "20 Mei 2024" },
    { author: "Mega Konser Group", rating: 4, comment: "Manajemen logistik dan teknis yang handal untuk acara skala besar.", date: "1 April 2024" },
  ],
  contact: {
    phone: "+62 21 555 0101",
    email: "info@acmeevents.co.id",
    website: "https://www.acmeevents.co.id",
  },
   availability: [
    { day: "Senin", slots: ["09:00", "10:00", "14:00"] },
    { day: "Selasa", slots: ["10:00", "11:00", "15:00"] },
    { day: "Rabu", slots: ["09:30", "13:30", "15:30"] },
    { day: "Kamis", slots: ["10:00", "14:00"] },
    { day: "Jumat", slots: ["09:00", "11:00", "13:00"] },
  ],
};


interface CompanyDetailPageProps {
  company: BusinessMatchingCardData; 
  onNavigate: (page: PageName, data?: any) => void;
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ company = acmeEventSolutionsData, onNavigate }) => {
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [schedulingForVendor, setSchedulingForVendor] = useState<string | null>(null);

  const handleOpenMeetingScheduler = (vendorName: string) => {
    setSchedulingForVendor(vendorName);
    setIsMeetingModalOpen(true);
  };

  const handleMeetingScheduled = (details: {vendorName: string, date: Date, timeSlot: string, duration: string, type: string, agenda: string}) => {
    alert(`Permintaan meeting untuk ${details.vendorName} pada ${details.date.toLocaleDateString('id-ID',{day:'2-digit', month:'long', year:'numeric'})} slot ${details.timeSlot} telah dikirim!\nDurasi: ${details.duration}\nTipe: ${details.type}\nAgenda: ${details.agenda}`);
    setIsMeetingModalOpen(false);
    setSchedulingForVendor(null);
  };
  
  const handleCollaborationSubmit = (formData: { projectIdea: string; budget: string }) => {
    alert(`Minat kolaborasi terkirim:\nIde Proyek: ${formData.projectIdea}\nEstimasi Budget: ${formData.budget || 'Belum ditentukan'}`);
  };


  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-0"> {/* Padding bottom for mobile sticky bar */}
      <CompanyDetailHeader
        bannerImageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=500&q=80" // Generic banner for detail page
        logoUrl={company.logoUrl}
        companyName={company.name}
        rating={company.matchScore} 
        onBack={() => onNavigate('business')}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content (Left Column on Desktop) */}
          <div className="lg:w-[calc(100%-24rem-2rem)] xl:w-[calc(100%-26rem-2rem)] space-y-8 mb-8 lg:mb-0"> {/* Adjust width based on sidebar */}
            <CompanyMetrics metrics={company.keyMetrics || []} />
            <CompanyAboutSection 
              description={company.description || "Deskripsi perusahaan tidak tersedia."}
              specializations={company.specialFeatures || ["Layanan Profesional"]}
            />
            <PortfolioCarousel projects={company.portfolio || []} />
            <CompanyReviews reviews={company.reviews || []} />
          </div>

          {/* Sticky Sidebar (Right Column on Desktop) */}
          <div className="lg:w-96 xl:w-[26rem] flex-shrink-0"> {/* Fixed width for sidebar */}
            <StickyActionSidebar
              companyName={company.name}
              contactInfo={company.contact}
              availability={company.availability} 
              onOpenMeetingScheduler={() => handleOpenMeetingScheduler(company.name)}
              onCollaborationSubmit={handleCollaborationSubmit}
            />
          </div>
        </div>
      </div>

      {isMeetingModalOpen && schedulingForVendor && (
        <MeetingSchedulerModal
          isOpen={isMeetingModalOpen}
          onClose={() => { setIsMeetingModalOpen(false); setSchedulingForVendor(null); }}
          vendorName={schedulingForVendor}
          onSchedule={handleMeetingScheduled}
        />
      )}
    </div>
  );
};

export default CompanyDetailPage;
