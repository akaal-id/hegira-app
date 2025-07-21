
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import HeroSlider from '../components/HeroSlider';
import EventCard from '../components/EventCard';
import FeatureItem from '../components/FeatureItem'; 
import ArticleCard from '../components/ArticleCard'; 
import BusinessMatchingCard, { BusinessMatchingCardData } from '../components/BusinessMatchingCard';
import { Briefcase, Users, Mail, TrendingUp, Zap, Ticket as TicketIconLucide, BookOpen, Edit3, Users2, BarChart3, PlusCircle, CalendarPlus, Settings, Lightbulb, ShieldCheck, Search, CalendarCheck } from 'lucide-react'; 
import { PageName, EventData } from '../HegiraApp'; 

const sampleArticles = [
  {
    slug: '5-tips-sukses-menggelar-event-hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Tips & Trik',
    title: '5 Tips Sukses Menggelar Event Hybrid yang Menarik',
    excerpt: 'Event hybrid semakin populer. Kombinasikan pengalaman fisik dan virtual dengan strategi jitu untuk engagement maksimal.',
    author: 'Tim Hegira',
    date: '15 Juli 2024',
  },
  {
    slug: 'studi-kasus-konser-xyz-bersama-hegira',
    imageUrl: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Studi Kasus',
    title: 'Studi Kasus: Kesuksesan Konser XYZ dengan Dukungan Penuh Hegira',
    excerpt: 'Bagaimana Konser XYZ berhasil menjual ribuan tiket dan memberikan pengalaman tak terlupakan bagi penontonnya? Simak ceritanya.',
    author: 'Andini Putri',
    date: '10 Juli 2024',
  },
  {
    slug: 'tren-event-2025-yang-wajib-diketahui',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Wawasan',
    title: 'Tren Event 2025: Inovasi dan Teknologi yang Akan Mendominasi',
    excerpt: 'Dari AI hingga keberlanjutan, apa saja tren yang akan membentuk industri event di tahun mendatang? Persiapkan diri Anda!',
    author: 'Budi Santoso',
    date: '5 Juli 2024',
  },
];

const sampleBusinessMatchingPartners: BusinessMatchingCardData[] = [
  {
    id: 1001,
    name: "Vendor Properti Event Terbaik",
    sector: "Peralatan & Produksi Event",
    location: "Jakarta & Sekitarnya",
    budget: "Fleksibel, Mulai dari Rp 5 Juta",
    matchScore: 4.8,
    specialFeatures: ["Kualitas Terjamin", "Pengalaman Luas", "Respon Cepat"],
    logoUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=FFA500&sat=-100&bri=0&bm=multiply",
  },
  {
    id: 1002,
    name: "Brand Sponsorship Nasional",
    sector: "Sponsor Korporat & Media",
    location: "Seluruh Indonesia",
    budget: "Mulai dari Rp 50 Juta per Event",
    matchScore: 4.5,
    specialFeatures: ["Jangkauan Nasional", "Citra Brand Kuat", "Aktivasi Kreatif"],
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=4B998E&sat=-100&bri=0&bm=multiply",
  },
  {
    id: 1003,
    name: "Investor Ventura & Angel",
    sector: "Investasi & Pendanaan Awal",
    location: "Asia Tenggara",
    budget: "Seed & Series A Funding",
    matchScore: 4.2,
    specialFeatures: ["Pendanaan Strategis", "Jaringan Luas", "Mentorship"],
    logoUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=18093B&sat=-100&bri=0&bm=multiply",
  },
];


const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [elements, setElements] = React.useState<HTMLElement[]>([]);
  const observer = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (elements.length === 0) return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    elements.forEach(element => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [elements, options]);

  return setElements;
};


interface LandingPageProps {
  heroEvents: EventData[]; 
  featuredEvents: EventData[];
  onNavigate: (page: PageName, data?: any) => void;
  onOpenLoginModal?: () => void; 
  openSubscriptionModal: () => void; 
}

const LandingPage: React.FC<LandingPageProps> = ({ heroEvents, featuredEvents, onNavigate, onOpenLoginModal, openSubscriptionModal }) => {
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const validRefs = sectionRefs.current.filter(el => el !== null) as HTMLElement[];
    setObservedElements(validRefs);
  }, [setObservedElements]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert(`Terima kasih! Email ${emailInput.value} telah didaftarkan untuk newsletter Hegira.`);
      emailInput.value = ''; // Clear input
    } else {
      alert('Mohon masukkan alamat email Anda.');
    }
  };

  return (
    <>
      {/* Section 1: Hero Slider */}
      <HeroSlider events={heroEvents} onNavigate={onNavigate} />

      {/* Section 2: Temukan Event Menarik */}
      <section id="events" className="py-16 md:py-24 bg-hegra-card-bg" ref={addToRefs}>
        <div className="container mx-auto px-0 sm:px-6 lg:px-8"> {/* Adjusted padding for full-bleed scroll */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 animate-on-scroll fade-in px-4 sm:px-0"> {/* Padding for title section */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy text-center md:text-left">Temukan Event <span className="text-gradient">Menarik</span></h2>
              <p className="text-neutral-700 mt-2 text-center md:text-left">Jelajahi berbagai acara terbaru dan paling populer.</p>
            </div>
            <button 
              onClick={() => onNavigate('events')} 
              className="mt-4 md:mt-0 text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center"
            >
              Lihat Semua Event <TrendingUp size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {/* Horizontal Scroll Container for Event Cards */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 animate-on-scroll fade-in-up"> {/* Negative margins for full bleed effect */}
            <div className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 py-4 px-4 sm:px-6 lg:px-8 horizontal-event-scroll">
              {featuredEvents.length > 0 ? featuredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="flex-shrink-0 w-[90%] xs:w-[80%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                >
                  <EventCard {...event} posterUrl={event.posterUrl || event.coverImageUrl} onNavigate={onNavigate} />
                </div>
              )) : (
                 <div className="w-full text-center py-10 px-4">
                    <p className="text-gray-500">Belum ada event unggulan yang tersedia saat ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: About Hegira - Reconstructed */}
      <section id="about-hegira" className="py-16 md:py-24 bg-hegra-chino/20" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll fade-in">
          <div className="mb-4">
            <span className="bg-hegra-turquoise/20 text-hegra-turquoise font-semibold px-4 py-1.5 rounded-full text-xs inline-block">
              ABOUT US
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta text-hegra-deep-navy mb-8">
            Apa itu <span className="text-hegra-turquoise">Hegira?</span>
          </h2>
          
          <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 mb-12 text-gray-700 text-base md:text-lg leading-relaxed space-y-4 md:space-y-0">
            <p>
              Hegira adalah platform event terintegrasi yang dirancang untuk merevolusi cara Anda menemukan, mengelola, dan menikmati berbagai acara. Kami percaya bahwa setiap event adalah sebuah kesempatan—untuk belajar, bertumbuh, berjejaring, dan menciptakan kenangan.
            </p>
            <p>
              Misi kami adalah memberdayakan penyelenggara event dengan alat yang intuitif dan komprehensif, sekaligus memberikan pengalaman yang mulus dan menyenangkan bagi para peserta. Dari konser musik megah hingga workshop bisnis yang intim, Hegira hadir untuk Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12 md:mb-16 animate-on-scroll fade-in-up">
            <FeatureItem
              icon={TicketIconLucide}
              title="Tiket Terintegrasi"
              description="Beli dan jual tiket untuk berbagai jenis event (B2C, B2B, B2G) dengan mudah, aman, dan cepat."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users}
              title="Jangkauan Luas"
              description="Temukan audiens yang lebih luas untuk event Anda atau jelajahi ribuan event menarik di seluruh Indonesia."
              iconBgClass="bg-hegra-yellow/20"
              iconColorClass="text-hegra-yellow"
            />
            <FeatureItem
              icon={Briefcase}
              title="Kelola Event Mudah"
              description="Tools lengkap bagi event creator untuk mengelola penjualan tiket, promosi, dan analitik secara profesional."
              iconBgClass="bg-hegra-chino/20"
              iconColorClass="text-hegra-chino"
            />
          </div>

          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hegira - Connecting Visions and Solutions"
            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-xl animate-on-scroll fade-in-up"
          />
        </div>
      </section>
      
      {/* Section 4: Buat Event Anda */}
      <section id="create-your-event" className="py-16 md:py-24 bg-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 animate-on-scroll fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Buat Event <span className="text-gradient">Impian Anda</span>
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              Hegra menyediakan platform lengkap untuk membantu Anda merencanakan, mempromosikan, dan mengelola event dengan sukses. Mulai dari konser, seminar, hingga workshop, semua jadi lebih mudah.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 animate-on-scroll fade-in-up">
            <FeatureItem
              icon={Edit3}
              title="Pembuatan Event Mudah"
              description="Buat dan kustomisasi halaman event Anda dengan cepat dan intuitif."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={TicketIconLucide}
              title="Manajemen Tiket Lanjutan"
              description="Atur berbagai kategori tiket, harga, kuota, dan kode promo."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={BarChart3} 
              title="Analitik Mendalam" 
              description="Pantau performa penjualan, demografi peserta, dan data penting lainnya."
              iconBgClass="bg-hegra-turquoise/20" 
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Lightbulb}
              title="Promosi Cerdas"
              description="Manfaatkan fitur promosi terintegrasi untuk menjangkau audiens yang tepat."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={ShieldCheck}
              title="Pembayaran Aman"
              description="Sistem pembayaran yang aman dan terpercaya dengan berbagai pilihan metode."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users2}
              title="Manajemen Peserta"
              description="Kelola data peserta, check-in, dan komunikasi dengan mudah."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Briefcase}
              title="Business Matching Tools"
              description="Fasilitasi networking dan pertemuan bisnis antar peserta atau sponsor (B2B/B2G)."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Settings}
              title="Kustomisasi Halaman"
              description="Sesuaikan tampilan halaman event Anda agar sesuai dengan brand."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
          </div>
          <div className="text-center animate-on-scroll fade-in">
            <button 
              onClick={() => onNavigate('createEventInfo')} 
              className="bg-hegra-yellow text-hegra-navy font-bold py-3.5 px-8 rounded-lg text-lg 
                         hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg 
                         inline-flex items-center gap-2.5"
            >
              <PlusCircle size={22} /> Mulai Buat Event Anda
            </button>
          </div>
        </div>
      </section>

      {/* Section 5: Business Matching */}
      <section id="business-matching" className="py-16 md:py-24 bg-hegra-chino/20" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 animate-on-scroll fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Temukan <span className="text-gradient">Koneksi Bisnis</span> Potensial
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              Perluas jaringan Anda, temukan vendor, mitra strategis, atau investor untuk event dan bisnis Anda melalui platform Business Matching Hegira.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 animate-on-scroll fade-in-up">
            {sampleBusinessMatchingPartners.map((partner) => (
              <BusinessMatchingCard
                key={partner.id}
                {...partner}
                onNavigate={onNavigate} // For general navigation if not overridden
                onActionClick={openSubscriptionModal} // This will be prioritized by BusinessMatchingCard
              />
            ))}
          </div>
          <div className="text-center animate-on-scroll fade-in">
            <button 
              onClick={openSubscriptionModal} // Changed to openSubscriptionModal
              className="bg-hegra-turquoise text-white font-bold py-3.5 px-8 rounded-lg text-lg
                         hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg 
                         inline-flex items-center gap-2.5"
            >
              <Briefcase size={22} /> Jelajahi Peluang Business Matching
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Articles & Insights */}
      <section id="articles" className="py-16 md:py-24 bg-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 animate-on-scroll fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Artikel & <span className="text-gradient">Wawasan</span> Terbaru
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Dapatkan tips, tren, dan studi kasus terkini seputar dunia event dan business matching.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 animate-on-scroll fade-in-up">
            {sampleArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} onNavigate={(slug) => onNavigate('articlesPage', { articleSlug: slug })} />
            ))}
          </div>
          <div className="text-center animate-on-scroll fade-in">
            <button 
              onClick={() => onNavigate('articlesPage')}
              className="text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center mx-auto"
            >
              Lihat Semua Artikel <BookOpen size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 7: Call to Action / Newsletter */}
      <section id="newsletter" className="py-16 md:py-24 bg-gradient-to-r from-hegra-turquoise to-hegra-yellow" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll fade-in">
          <Zap size={48} className="mx-auto mb-4 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold font-jakarta text-hegra-white mb-4">
            Jangan Ketinggalan Update Terbaru dari Hegira!
          </h2>
          <p className="text-lg text-hegra-light-bg/90 mb-8 max-w-xl mx-auto">
            Daftarkan email Anda untuk mendapatkan informasi event terbaru, promo spesial, dan tips eksklusif.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">Alamat Email</label>
            <input
              type="email"
              id="newsletter-email"
              name="email"
              required
              placeholder="Masukkan alamat email Anda..."
              className="flex-grow py-3 px-4 rounded-lg border border-transparent 
                         focus:ring-2 focus:ring-hegra-navy focus:border-hegra-navy 
                         text-base shadow-md text-hegra-deep-navy"
              aria-label="Alamat email untuk newsletter"
            />
            <button
              type="submit"
              className="bg-hegra-navy text-white font-semibold py-3 px-6 rounded-lg 
                         hover:bg-opacity-90 transition-colors shadow-md
                         transform hover:scale-105"
            >
              <Mail size={20} className="inline mr-2 -mt-0.5" /> Daftar Sekarang
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LandingPage;