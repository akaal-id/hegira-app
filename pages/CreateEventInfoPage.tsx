/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import { PageName, UserRole } from '../HegiraApp';
import FeatureItem from '../components/FeatureItem'; 
import { Briefcase, Users, Ticket as TicketIconLucide, Award, BarChart3, Edit3, ShieldCheck, Zap, Lightbulb, Users2, CalendarPlus, Settings, CheckCircle } from 'lucide-react';

interface PortfolioCardProps {
  imageUrl: string;
  eventName: string;
  description: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ imageUrl, eventName, description }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <img src={imageUrl} alt={eventName} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h4 className="text-xl font-jakarta font-semibold text-hegra-navy mb-2">{eventName}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

interface CreatorFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const CreatorFeatureCard: React.FC<CreatorFeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gradient-to-br from-hegra-turquoise/5 to-hegra-yellow/5 p-6 rounded-xl border border-hegra-turquoise/20 text-center hover:shadow-lg transition-shadow duration-300">
    <div className="inline-block p-4 bg-hegra-turquoise text-white rounded-full mb-4">
      <Icon size={32} />
    </div>
    <h4 className="text-lg font-jakarta font-semibold text-hegra-navy mb-2">{title}</h4>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

interface CreateEventInfoPageProps {
  onNavigate: (page: PageName, data?: any) => void;
  onOpenAuthModal: () => void; 
  isLoggedIn: boolean;
  userRole: UserRole;
}

const CreateEventInfoPage: React.FC<CreateEventInfoPageProps> = ({ 
    onNavigate, 
    onOpenAuthModal, // Kept for potential future use but not for this specific CTA
    isLoggedIn,
    userRole
}) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const validRefs = sectionRefs.current.filter(el => el !== null) as HTMLElement[];
    validRefs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const handleCTAClick = () => {
    if (isLoggedIn && (userRole === 'creator' || userRole === 'organization')) {
      // Already a creator or org, go to dashboard to create event
      onNavigate('dashboard', { view: 'createEventView' }); 
    } else {
      // Not logged in, or logged in but not as creator/org
      // Direct to creator authentication page
      onNavigate('creatorAuth');
    }
  };

  let ctaButtonText = "Mulai Sebagai Event Creator";
  if (isLoggedIn) {
    if (userRole === 'creator' || userRole === 'organization') {
      ctaButtonText = "Buat Event Baru di Dashboard";
    } else { 
      ctaButtonText = "Daftar/Masuk Akun Kreator";
    }
  }


  return (
    <div className="bg-hegra-light-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hegra-navy to-hegra-turquoise py-20 md:py-32 text-white text-center" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in-up">
          <Zap size={64} className="mx-auto mb-6 text-hegra-yellow" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-jakarta font-bold mb-4">Wujudkan Event <span className="text-hegra-yellow">Impian Anda</span></h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Hegra menyediakan platform lengkap untuk membantu Anda merencanakan, mempromosikan, dan mengelola event dengan sukses dan mudah.
          </p>
          <button 
            onClick={handleCTAClick}
            className="bg-hegra-yellow text-hegra-navy font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            {ctaButtonText}
          </button>
        </div>
      </section>

      {/* About Hegra for Creators Section */}
      <section className="py-16 md:py-24 bg-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-hegra-deep-navy">
              Mengapa Memilih <span className="text-hegra-turquoise">Hegra</span> untuk Event Anda?
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Kami menawarkan solusi terintegrasi yang memberdayakan Anda di setiap tahap penyelenggaraan event.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={TicketIconLucide}
              title="Manajemen Tiket Fleksibel"
              description="Jual tiket untuk berbagai jenis event (B2C, B2B, B2G) dengan opsi kustomisasi kategori dan harga."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users2}
              title="Jangkauan Audiens Luas"
              description="Promosikan event Anda ke ribuan calon peserta yang tertarget melalui platform kami yang populer."
              iconBgClass="bg-hegra-yellow/20"
              iconColorClass="text-hegra-yellow"
            />
            <FeatureItem
              icon={Briefcase}
              title="Kelola Event Profesional"
              description="Akses dashboard intuitif untuk memantau penjualan, mengelola peserta, dan mendapatkan analitik event."
              iconBgClass="bg-hegra-chino/20"
              iconColorClass="text-hegra-chino"
            />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-gray-50" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-hegra-deep-navy">
              Portfolio <span className="text-gradient">Event Sukses</span> Kami
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Lihat bagaimana Hegra telah membantu berbagai event mencapai kesuksesan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PortfolioCard imageUrl="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" eventName="Tech Conference XYZ 2024" description="Konferensi teknologi tahunan terbesar dengan lebih dari 5000 peserta dan 100+ pembicara internasional." />
            <PortfolioCard imageUrl="https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" eventName="Music Festiva Freedom Sounds" description="Festival musik multi-genre yang berhasil menjual habis tiket dan menarik perhatian media nasional." />
            <PortfolioCard imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" eventName="Corporate Gala Dinner & Awards" description="Acara penghargaan prestisius untuk perusahaan ternama dengan manajemen tamu VIP yang sempurna." />
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 md:py-24 bg-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-hegra-deep-navy">
              Fitur <span className="text-hegra-turquoise">Unggulan</span> Platform Kami
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Alat canggih yang dirancang untuk memaksimalkan potensi dan kesuksesan event Anda.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <CreatorFeatureCard icon={Edit3} title="Pembuatan Event Mudah" description="Buat dan kustomisasi halaman event Anda dengan cepat dan intuitif." />
            <CreatorFeatureCard icon={TicketIconLucide} title="Manajemen Tiket Lanjutan" description="Atur berbagai kategori tiket, harga, kuota, dan kode promo." />
            <CreatorFeatureCard icon={BarChart3} title="Analitik Mendalam" description="Pantau performa penjualan, demografi peserta, dan data penting lainnya." />
            <CreatorFeatureCard icon={Lightbulb} title="Promosi Cerdas" description="Manfaatkan fitur promosi terintegrasi untuk menjangkau audiens yang tepat." />
            <CreatorFeatureCard icon={ShieldCheck} title="Pembayaran Aman" description="Sistem pembayaran yang aman dan terpercaya dengan berbagai pilihan metode." />
            <CreatorFeatureCard icon={Users} title="Manajemen Peserta" description="Kelola data peserta, check-in, dan komunikasi dengan mudah." />
            <CreatorFeatureCard icon={Briefcase} title="Business Matching Tools" description="Fasilitasi networking dan pertemuan bisnis antar peserta atau sponsor (B2B/B2G)." />
            <CreatorFeatureCard icon={Settings} title="Kustomisasi Halaman" description="Sesuaikan tampilan halaman event Anda agar sesuai dengan brand." />
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-hegra-chino/20 to-hegra-chino/50" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll fade-in">
          <Award size={48} className="mx-auto mb-6 text-hegra-yellow" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-hegra-deep-navy mb-4">
            Langkah Mudah Membuat Event Anda di Hegra
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Mulai perjalanan Anda sebagai event creator sukses bersama kami hanya dalam beberapa langkah sederhana.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hegra-turquoise">
              <h3 className="text-xl font-jakarta font-semibold text-hegra-navy mb-2"><span className="text-hegra-turquoise font-bold text-2xl mr-2">1.</span>Daftar Akun</h3>
              <p className="text-sm text-gray-600">Buat akun Event Creator atau Organisasi Anda di Hegra. Prosesnya cepat dan mudah.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hegra-yellow">
              <h3 className="text-xl font-jakarta font-semibold text-hegra-navy mb-2"><span className="text-hegra-yellow font-bold text-2xl mr-2">2.</span>Buat Event</h3>
              <p className="text-sm text-gray-600">Lengkapi detail event Anda, mulai dari deskripsi, jadwal, lokasi, hingga pengaturan tiket.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hegra-navy">
              <h3 className="text-xl font-jakarta font-semibold text-hegra-navy mb-2"><span className="text-hegra-navy font-bold text-2xl mr-2">3.</span>Publikasi & Kelola</h3>
              <p className="text-sm text-gray-600">Publikasikan event Anda dan manfaatkan fitur kami untuk promosi dan manajemen peserta.</p>
            </div>
          </div>
          <button
            onClick={handleCTAClick}
            className="bg-hegra-turquoise text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 mx-auto"
          >
            <CalendarPlus size={22} /> {ctaButtonText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default CreateEventInfoPage;