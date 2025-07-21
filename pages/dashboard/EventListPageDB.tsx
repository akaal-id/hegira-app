
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Search, ChevronDown, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { PageName, EventData, formatEventTime } from '../../HegiraApp'; 
import EventCardDB from '../../components/dashboard/EventCardDB';
// EventDetailModalDB is removed as it's now a full page: EventDetailPageDB
import { DashboardViewId } from '../../pages/DashboardPage'; 

export type AugmentedEventData = EventData; 

interface EventListPageDBProps {
  initialEvents: EventData[]; 
  onNavigate: (page: PageName, data?: any) => void;
  onSwitchView: (viewId: DashboardViewId, data?: any) => void; 
}

const ITEMS_PER_PAGE = 6;

const EventListPageDB: React.FC<EventListPageDBProps> = ({ initialEvents, onNavigate, onSwitchView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for modals (detail and edit) is removed as they are now pages or handled by DashboardPage
  
  const [events, setEvents] = useState<EventData[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents); 
    setCurrentPage(1); 
  }, [initialEvents]);


  const augmentedEvents: AugmentedEventData[] = useMemo(() => {
    return events.filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);
  
  const summaryData = useMemo(() => [
    { title: 'Semua Event', count: augmentedEvents.length, color: '' }, 
    { title: 'Event Aktif', count: augmentedEvents.filter(d=>d.status === 'Aktif').length, color: 'green' }, 
    { title: 'Event Draf', count: augmentedEvents.filter(d=>d.status === 'Draf').length, color: 'yellow' }, 
    { title: 'Event Selesai', count: augmentedEvents.filter(d=>d.status === 'Selesai').length, color: '' }, 
  ], [augmentedEvents]);


  const totalPages = Math.ceil(augmentedEvents.length / ITEMS_PER_PAGE);

  const currentDisplayEvents = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return augmentedEvents.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, augmentedEvents]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const renderPageNumbers = () => {
    const pageNumbersToDisplay = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageNumbersToDisplay.push(i);
    } else {
        pageNumbersToDisplay.push(1);
        if (currentPage > 4) pageNumbersToDisplay.push('...');
        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pageNumbersToDisplay.push(i);
        }
        if (currentPage < totalPages - 3) pageNumbersToDisplay.push('...');
        pageNumbersToDisplay.push(totalPages);
    }

    return pageNumbersToDisplay.map((number, index) => 
        typeof number === 'string' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 mx-1 text-sm text-gray-700">...</span>
        ) : (
            <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 mx-1 rounded-md text-sm transition-colors focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
                ${currentPage === number 
                ? 'bg-hegra-turquoise text-white font-semibold' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
            {number}
            </button>
        )
    );
  };

  // Function to navigate to the new detail page
  const navigateToDetailView = (event: AugmentedEventData) => {
    onSwitchView('detailEventView', event);
  };

  // Removed handleToggleEventStatus as status changes will be handled on the detail page or via specific actions.
  // If needed for quick actions on list, it can be re-added with prop drilling.


  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 pt-4 sm:px-0 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy mb-4 sm:mb-0">Daftar Event</h1>
        <button
          onClick={() => onSwitchView('createEventView')} 
          className="bg-hegra-turquoise text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-hegra-turquoise/90 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} /> Buat Event Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              {item.color === 'green' && <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>}
              {item.color === 'yellow' && <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>}
              {item.title === 'Event Selesai' && <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>}
              {item.title === 'Semua Event' && !item.color && <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>}
              {item.title}
            </div>
            <p className="text-3xl font-bold text-gray-800">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
            />
          </div>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm text-gray-500 bg-white">
            <option value="">Urutkan</option>
          </select>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm text-gray-500 bg-white">
            <option value="">Status</option>
          </select>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm text-gray-500 bg-white">
            <option value="">Kategori</option>
          </select>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm text-gray-500 bg-white">
            <option value="">Tema</option>
          </select>
        </div>
      </div>

      {/* Event List */}
      {currentDisplayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDisplayEvents.map((event) => (
            <EventCardDB
              key={event.id}
              eventData={event}
              onNavigateToDetail={() => navigateToDetailView(event)} // Changed to navigate to full page
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <Search size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Tidak ada event yang ditemukan.</p>
            <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain atau ubah filter Anda.</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
          >
            Next <ChevronRightIcon size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* Modals are removed from here */}
    </div>
  );
};

export default EventListPageDB;
