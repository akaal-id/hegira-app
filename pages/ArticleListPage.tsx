
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon, ChevronDown, ChevronUp, BookOpen, SlidersHorizontal } from 'lucide-react';
import { PageName } from '../HegiraApp';

export interface ArticleData {
  slug: string;
  imageUrl: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // Consider using Date object if more complex date operations are needed
}

// Expanded sample articles, including those from LandingPage
const allArticlesData: ArticleData[] = [
  {
    slug: 'panduan-lengkap-membuat-event-sukses',
    imageUrl: 'https://images.unsplash.com/photo-1511578191477-9289951c504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Panduan Membuat Event',
    title: 'Panduan Lengkap Membuat Event Sukses dari A Sampai Z',
    excerpt: 'Mulai dari ide hingga evaluasi pasca-event, pelajari langkah-langkah krusial untuk menyelenggarakan acara yang tak terlupakan dan memberikan dampak maksimal.',
    author: 'Tim Hegira Ahli',
    date: '2 Agustus 2024',
  },
  {
    slug: '7-kunci-memilih-venue-event',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Tips Venue',
    title: '7 Kunci Memilih Venue Event yang Tepat dan Efektif',
    excerpt: 'Lokasi adalah segalanya. Temukan tips memilih venue yang sesuai dengan konsep, budget, kapasitas, fasilitas, dan target audiens event Anda.',
    author: 'Vania Lokasari',
    date: '28 Juli 2024',
  },
  {
    slug: 'strategi-pemasaran-event-jitu',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Strategi Pemasaran',
    title: 'Strategi Pemasaran Event Jitu: Jangkau Audiens Lebih Luas',
    excerpt: 'Pelajari cara mempromosikan event Anda secara efektif menggunakan media sosial, email marketing, influencer, dan kemitraan strategis untuk hasil optimal.',
    author: 'Rian Digital',
    date: '25 Juli 2024',
  },
  {
    slug: '5-tips-sukses-menggelar-event-hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Tips & Trik',
    title: '5 Tips Sukses Menggelar Event Hybrid yang Menarik',
    excerpt: 'Event hybrid semakin populer. Kombinasikan pengalaman fisik dan virtual dengan strategi jitu untuk engagement maksimal dan jangkauan lebih luas.',
    author: 'Tim Hegira',
    date: '15 Juli 2024',
  },
  {
    slug: 'teknologi-terkini-untuk-event',
    imageUrl: 'https://images.unsplash.com/photo-1605907099413-a0031ffc2df1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Teknologi Event',
    title: 'Teknologi Terkini untuk Meningkatkan Pengalaman Event Anda',
    excerpt: 'Dari aplikasi mobile, AI, hingga augmented reality, bagaimana teknologi dapat membuat event Anda lebih interaktif, efisien, dan berkesan bagi peserta?',
    author: 'Inova Tech',
    date: '20 Juli 2024',
  },
  {
    slug: 'studi-kasus-konser-xyz-bersama-hegira',
    imageUrl: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Studi Kasus',
    title: 'Studi Kasus: Kesuksesan Konser XYZ dengan Dukungan Penuh Hegira',
    excerpt: 'Bagaimana Konser XYZ berhasil menjual ribuan tiket dan memberikan pengalaman tak terlupakan bagi penontonnya? Simak cerita dan strategi di baliknya.',
    author: 'Andini Putri',
    date: '10 Juli 2024',
  },
  {
    slug: 'rahasia-sukses-negosiasi-vendor-event',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Manajemen Vendor',
    title: 'Rahasia Sukses Negosiasi dengan Vendor Event',
    excerpt: 'Dapatkan kesepakatan terbaik tanpa mengorbankan kualitas. Tips praktis negosiasi dengan vendor catering, venue, dekorasi, dan lainnya.',
    author: 'Budi Negosiator',
    date: '18 Juli 2024',
  },
  {
    slug: 'checklist-esensial-persiapan-event',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Panduan Membuat Event',
    title: 'Checklist Esensial Persiapan Event: Jangan Sampai Ada yang Terlewat!',
    excerpt: 'Gunakan checklist komprehensif ini untuk memastikan semua aspek persiapan event Anda berjalan lancar, terorganisir, dan minim stres.',
    author: 'Tim Hegira Ahli',
    date: '12 Juli 2024',
  },
  {
    slug: 'tren-event-2025-yang-wajib-diketahui',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Wawasan',
    title: 'Tren Event 2025: Inovasi dan Teknologi yang Akan Mendominasi',
    excerpt: 'Dari AI hingga keberlanjutan, personalisasi, dan gamifikasi, apa saja tren yang akan membentuk industri event di tahun mendatang? Persiapkan diri Anda!',
    author: 'Budi Santoso',
    date: '5 Juli 2024',
  },
];

interface ArticleListPageProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const ITEMS_PER_PAGE = 9;
const ALL_CATEGORIES = "Semua Kategori";

const ArticleListPage: React.FC<ArticleListPageProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  const [sortOrder, setSortOrder] = useState<'newest' | 'popularity'>('newest');
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const articleCategories = useMemo(() => {
    const categories = new Set(allArticlesData.map(article => article.category));
    return [ALL_CATEGORIES, ...Array.from(categories).sort()];
  }, []);

  const filteredArticles = useMemo(() => {
    let articles = allArticlesData;

    if (searchTerm) {
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== ALL_CATEGORIES) {
      articles = articles.filter(article => article.category === selectedCategory);
    }
    
    // Placeholder for sorting - for now, default sort is by date in sample data
    // if (sortOrder === 'newest') {
    //   articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // } else if (sortOrder === 'popularity') {
    //   // Add popularity sort logic if data includes popularity score
    // }

    return articles;
  }, [searchTerm, selectedCategory, sortOrder]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const currentArticles = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredArticles]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedCategory, sortOrder]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Placeholder for individual article navigation
  const handleArticleNavigate = (slug: string) => {
    alert(`Navigasi ke artikel: ${slug} (Halaman detail artikel belum diimplementasikan)`);
    // Example: onNavigate('articleDetail', { slug });
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-16 text-center">
          <BookOpen size={48} className="mx-auto text-hegra-turquoise mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-jakarta text-hegra-navy">
            Artikel & Wawasan <span className="text-gradient">Event</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan panduan, tips, dan inspirasi untuk menyelenggarakan event yang sukses dan berkesan.
          </p>
        </header>
        
        {/* Search and Filter Bar */}
        <div className="mb-10 md:mb-12 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search-article" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Artikel
              </label>
              <div className="relative">
                <input
                  type="search"
                  id="search-article"
                  name="search-article"
                  placeholder="Kata kunci, judul, atau penulis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white"
                  aria-label="Cari artikel"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)} 
                className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                aria-expanded={isFilterVisible}
                aria-controls="article-filters-content"
              >
                <SlidersHorizontal size={16} /> Filters
                {isFilterVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
          
          {isFilterVisible && (
            <div id="article-filters-content" className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  id="filter-category"
                  name="filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white text-sm"
                  aria-label="Filter berdasarkan kategori"
                >
                  {articleCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                  Urutkan Berdasarkan
                </label>
                <select
                  id="sort-order"
                  name="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'popularity')}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white text-sm"
                  aria-label="Urutkan artikel"
                >
                  <option value="newest">Terbaru</option>
                  <option value="popularity" disabled>Terpopuler (Segera Hadir)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <main>
          <section aria-labelledby="article-list-heading">
            <h2 id="article-list-heading" className="sr-only">Daftar Artikel</h2>
            {currentArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentArticles.map(article => (
                  <ArticleCard 
                    key={article.slug} 
                    {...article} 
                    onNavigate={handleArticleNavigate} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">Tidak ada artikel yang cocok dengan pencarian atau filter Anda.</p>
                <p className="text-sm text-gray-400 mt-2">Coba kata kunci lain atau ubah filter Anda.</p>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <nav aria-label="Paginasi artikel" className="mt-12 flex justify-center">
              <ul className="inline-flex items-center -space-x-px shadow-sm">
                <li>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-hegra-turquoise disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number}>
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`py-2 px-4 leading-tight border transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
                        ${currentPage === number 
                          ? 'text-hegra-turquoise bg-hegra-turquoise/10 border-hegra-turquoise font-semibold z-10' 
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-hegra-turquoise'
                        }`}
                      aria-current={currentPage === number ? 'page' : undefined}
                      aria-label={`Ke halaman ${number}`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-hegra-turquoise disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={18} />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ArticleListPage;