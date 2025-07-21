/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react'; 
import { EventData, PageName } from '../HegiraApp'; // Renamed import

interface EventPageProps {
  events: EventData[]; 
  onNavigate: (page: PageName, data?: any) => void;
}

const ITEMS_PER_PAGE = 9; 

const EventPage: React.FC<EventPageProps> = ({ events, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Festivals']); // Example, can be dynamic
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  // Filter events based on search term and other filters
  const filteredAndSortedEvents = useMemo(() => {
    let processedEvents = events; // Already pre-filtered for 'Aktif' status from HegiraApp

    if (searchTerm) {
      processedEvents = processedEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.summary && event.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Add more filtering logic here if needed (e.g., based on selectedCategories, startDate, endDate)
    
    return processedEvents;
  }, [events, searchTerm, selectedCategories, startDate, endDate]);


  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE);

  const currentEvents = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredAndSortedEvents]);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const categories = ["Festivals", "Conferences", "Exhibitions", "Konser", "Pameran Seni"]; // This could be dynamic based on events prop

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-jakarta font-bold text-hegra-turquoise">Jelajahi Event</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
          Selami dunia penuh kegembiraan dan peluang. Jelajahi beragam koleksi acara mendatang, 
          dari festival yang meriah dan konferensi yang berwawasan hingga pameran yang menarik. Temukan pengalaman tak terlupakan Anda berikutnya di sini.
        </p>
      </header>
      
      <div className="mb-12 md:mb-16">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="search"
            id="search-event"
            name="search-event"
            placeholder="Cari nama, kategori, atau lokasi event..."
            className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white" 
            aria-label="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-lg shadow-sm border border-gray-200 self-start">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-jakarta font-semibold text-hegra-navy">Filters</h2>
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)} 
              className="text-hegra-navy hover:text-hegra-turquoise p-1"
              aria-expanded={isFilterVisible}
              aria-controls="event-filters-content"
            >
              {isFilterVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {isFilterVisible && (
            <div id="event-filters-content" className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-jakarta font-medium text-gray-800 mb-2">Category</h3>
                <ul className="space-y-1">
                  {categories.map(category => (
                    <li key={category}>
                      <label className="flex items-center space-x-2 text-gray-700 hover:text-hegra-turquoise cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="form-checkbox h-4 w-4 text-hegra-turquoise rounded border-gray-300 focus:ring-hegra-turquoise/20"
                        />
                        <span>{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Date Range Filter */}
              <div>
                <h3 className="text-lg font-jakarta font-medium text-gray-800 mb-2">Date Range</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="start-date" className="sr-only">Start date</label>
                    <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
                      placeholder="Start date"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="sr-only">End date</label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <section aria-labelledby="event-list-heading">
            <h2 id="event-list-heading" className="sr-only">Daftar Event</h2>
            {currentEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {currentEvents.map(event => (
                  <EventCard key={event.id} {...event} onNavigate={onNavigate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">Tidak ada event yang cocok dengan pencarian Anda.</p>
                <p className="text-sm text-gray-400 mt-2">Coba kata kunci atau filter lain.</p>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-2" aria-label="Paginasi event">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
                    ${currentPage === number 
                      ? 'bg-hegra-turquoise text-white font-semibold' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  aria-current={currentPage === number ? 'page' : undefined}
                  aria-label={`Ke halaman ${number}`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
                aria-label="Halaman berikutnya"
              >
                Next <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventPage;