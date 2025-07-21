
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { sampleOrders, OrderItem } from './PesananDB'; 
import { PageName, EventData, formatEventTime } from '../../HegiraApp';
import ScanTicketModal from '../../components/dashboard/modals/ScanTicketModal'; 
import EditAttendeeStatusModal from '../../components/dashboard/modals/EditAttendeeStatusModal'; 
import OrderDetailModal from '../../components/dashboard/modals/OrderDetailModal'; 
// EventSelectionModal import removed
import { Users, Search, Download, ChevronLeft, ChevronRight, SlidersHorizontal as FilterEventIcon, ChevronDown, ChevronUp, Ticket, CheckSquare, XSquare, ScanLine, Edit3, X, ArrowLeft as ArrowLeftIcon } from 'lucide-react'; // Added X and ArrowLeftIcon

export interface AttendeeData {
  ticketId: string;
  orderId: string;
  eventId: number; 
  eventName: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  eventTimezone?: string;
  ticketCategoryName: string;
  ticketPrice: number;
  ownerName: string;
  ownerPhone: string;
  purchaseTimestamp: string;
  status: 'Belum Hadir' | 'Sudah Hadir';
  scanTimestamp?: string; // ISO string
}

// Function to derive attendee data from orders
const deriveAttendeeDataFromOrders = (orders: OrderItem[]): AttendeeData[] => {
  const attendees: AttendeeData[] = [];
  orders.forEach(order => {
    if (order.status === 'Berhasil') { // Only process successful orders for attendees
      order.tickets.forEach((ticketItem, ticketTypeIndex) => {
        for (let i = 0; i < ticketItem.quantity; i++) {
          const holderIndex = attendees.filter(a => a.orderId === order.id).length; 
          const holderInfo = order.additionalTicketHolders && order.additionalTicketHolders[holderIndex] 
                             ? order.additionalTicketHolders[holderIndex] 
                             : { fullName: order.booker.fullName, whatsAppNumber: order.booker.phoneNumber };
          
          attendees.push({
            ticketId: `TKT-${order.id.split('-')[1]}-${ticketTypeIndex + 1}${i + 1}`,
            orderId: order.id,
            eventId: order.eventId, // Store eventId
            eventName: order.eventName,
            eventDateDisplay: order.eventDateDisplay,
            eventTimeDisplay: order.eventTimeDisplay,
            eventTimezone: order.eventTimezone,
            ticketCategoryName: ticketItem.categoryName,
            ticketPrice: ticketItem.pricePerTicket,
            ownerName: holderInfo.fullName,
            ownerPhone: holderInfo.whatsAppNumber,
            purchaseTimestamp: order.orderTimestamp,
            status: 'Belum Hadir', 
            scanTimestamp: undefined,
          });
        }
      });
    }
  });
  return attendees;
};


const ITEMS_PER_PAGE = 10;
const ALL_CATEGORIES = "Semua Kategori Tiket";
const ALL_STATUSES = "Semua Status";

export type ScanStatus = 'IDLE' | 'SCANNING' | 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND';

interface PengunjungDBProps {
  allCreatorEvents: EventData[]; 
  selectedEvent: EventData; 
  onBackToEventList: () => void; 
}

const PengunjungDB: React.FC<PengunjungDBProps> = ({ allCreatorEvents, selectedEvent, onBackToEventList }) => {
  const [attendees, setAttendees] = useState<AttendeeData[]>(deriveAttendeeDataFromOrders(sampleOrders));
  const [activeTab, setActiveTab] = useState<'data' | 'laporan' | 'checkin'>('data');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTicketCategory, setFilterTicketCategory] = useState<string>(ALL_CATEGORIES);
  const [filterStatus, setFilterStatus] = useState<string>(ALL_STATUSES);
  const [sortOrder, setSortOrder] = useState<'eventDate_desc' | 'eventDate_asc' | 'ownerName_asc' | 'ownerName_desc' | 'status_asc' | 'status_desc'>('eventDate_desc');
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [lastScannedAttendeeInfo, setLastScannedAttendeeInfo] = useState<AttendeeData | null>(null);
  const [lastScanStatus, setLastScanStatus] = useState<ScanStatus>('IDLE');

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedAttendeeForStatusEdit, setSelectedAttendeeForStatusEdit] = useState<AttendeeData | null>(null);

  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<OrderItem | null>(null);


  const uniqueTicketCategories = useMemo(() => {
    if (!selectedEvent) return [ALL_CATEGORIES];
    const categories = new Set(attendees.filter(att => att.eventId === selectedEvent.id).map(att => att.ticketCategoryName));
    return [ALL_CATEGORIES, ...Array.from(categories).sort()];
  }, [attendees, selectedEvent]);

  const statusOptions = [ALL_STATUSES, 'Belum Hadir', 'Sudah Hadir'];

  const filteredAndSortedAttendees = useMemo(() => {
    if (!selectedEvent) return []; // Guard clause if selectedEvent is null
    let processedAttendees = attendees.filter(att => att.eventId === selectedEvent.id);

    if (searchTerm) {
      processedAttendees = processedAttendees.filter(att =>
        att.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.ownerPhone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTicketCategory !== ALL_CATEGORIES) {
      processedAttendees = processedAttendees.filter(att => att.ticketCategoryName === filterTicketCategory);
    }
    if (filterStatus !== ALL_STATUSES) {
      processedAttendees = processedAttendees.filter(att => att.status === filterStatus);
    }
    
    processedAttendees.sort((a, b) => {
      if (sortOrder.includes('eventDate')) {
        if (a.status === 'Sudah Hadir' && b.status !== 'Sudah Hadir') return -1;
        if (a.status !== 'Sudah Hadir' && b.status === 'Sudah Hadir') return 1;
        if (a.status === 'Sudah Hadir' && b.status === 'Sudah Hadir') {
          return new Date(b.scanTimestamp!).getTime() - new Date(a.scanTimestamp!).getTime();
        }
      }
      switch (sortOrder) {
        case 'ownerName_asc': return a.ownerName.localeCompare(b.ownerName);
        case 'ownerName_desc': return b.ownerName.localeCompare(a.ownerName);
        case 'eventDate_asc': return new Date(a.eventDateDisplay.split(' - ')[0].replace(/\//g, '-')).getTime() - new Date(b.eventDateDisplay.split(' - ')[0].replace(/\//g, '-')).getTime();
        case 'eventDate_desc': return new Date(b.eventDateDisplay.split(' - ')[0].replace(/\//g, '-')).getTime() - new Date(a.eventDateDisplay.split(' - ')[0].replace(/\//g, '-')).getTime();
        case 'status_asc': return a.status.localeCompare(b.status);
        case 'status_desc': return b.status.localeCompare(a.status);
        default: return 0;
      }
    });
    return processedAttendees;
  }, [attendees, searchTerm, filterTicketCategory, filterStatus, sortOrder, selectedEvent]);

  const totalPages = Math.ceil(filteredAndSortedAttendees.length / ITEMS_PER_PAGE);
  const currentDisplayAttendees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedAttendees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedAttendees, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTicketCategory, filterStatus, sortOrder, selectedEvent]);
  
  const handleProcessScan = (scannedId: string) => {
    setLastScanStatus('SCANNING');
    setTimeout(() => {
        const foundAttendeeIndex = attendees.findIndex(att => att.ticketId === scannedId);
        if (foundAttendeeIndex !== -1) {
            const attendee = attendees[foundAttendeeIndex];
            if (attendee.eventId !== selectedEvent.id) {
                setLastScannedAttendeeInfo(attendee); 
                setLastScanStatus('NOT_FOUND'); 
                alert(`Tiket ini untuk event "${attendee.eventName}", bukan "${selectedEvent.name}".`);
                return;
            }

            if (attendee.status === 'Belum Hadir') {
                const updatedAttendee = { ...attendee, status: 'Sudah Hadir' as 'Sudah Hadir', scanTimestamp: new Date().toISOString() };
                const newAttendees = [updatedAttendee, ...attendees.slice(0, foundAttendeeIndex), ...attendees.slice(foundAttendeeIndex + 1)];
                setAttendees(newAttendees);
                setLastScannedAttendeeInfo(updatedAttendee);
                setLastScanStatus('SUCCESS');
            } else {
                setLastScannedAttendeeInfo(attendee);
                setLastScanStatus('ALREADY_SCANNED');
            }
        } else {
            setLastScannedAttendeeInfo(null);
            setLastScanStatus('NOT_FOUND');
        }
    }, 500);
  };

  const openScanModal = () => {
    setLastScanStatus('IDLE');
    setLastScannedAttendeeInfo(null);
    setIsScanModalOpen(true);
  };

  const handleOpenEditStatusModal = (attendee: AttendeeData) => {
    setSelectedAttendeeForStatusEdit(attendee);
    setIsEditStatusModalOpen(true);
  };

  const handleUpdateAttendeeStatus = (ticketId: string, newStatus: 'Sudah Hadir' | 'Belum Hadir') => {
    setAttendees(prevAttendees => {
      const foundAttendeeIndex = prevAttendees.findIndex(att => att.ticketId === ticketId);
      if (foundAttendeeIndex === -1) return prevAttendees;

      const updatedAttendee = {
        ...prevAttendees[foundAttendeeIndex],
        status: newStatus,
        scanTimestamp: newStatus === 'Sudah Hadir' ? new Date().toISOString() : undefined,
      };
      
      if (newStatus === 'Sudah Hadir' && prevAttendees[foundAttendeeIndex].status === 'Belum Hadir') {
        return [updatedAttendee, ...prevAttendees.slice(0, foundAttendeeIndex), ...prevAttendees.slice(foundAttendeeIndex + 1)];
      } else {
        const newAttendees = [...prevAttendees];
        newAttendees[foundAttendeeIndex] = updatedAttendee;
        return newAttendees;
      }
    });
    setIsEditStatusModalOpen(false);
  };

  const handleOpenOrderDetailModal = (orderId: string) => {
    const order = sampleOrders.find(o => o.id === orderId && o.eventId === selectedEvent.id);
    if (order) {
      setSelectedOrderForDetail(order);
      setIsOrderDetailModalOpen(true);
    }
  };
  
  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["ID Tiket", "ID Pesanan", "Nama Event", "Tanggal Event", "Waktu Event", "Kategori Tiket", "Harga Tiket", "Nama Pemilik", "No. Telepon Pemilik", "Tanggal Pembelian", "Status Kehadiran", "Waktu Scan"];
    csvContent += headers.join(",") + "\r\n";
    filteredAndSortedAttendees.forEach(att => {
      const row = [
        att.ticketId, att.orderId, `"${att.eventName.replace(/"/g, '""')}"`, att.eventDateDisplay,
        formatEventTime(att.eventTimeDisplay, att.eventTimezone), att.ticketCategoryName, att.ticketPrice,
        `"${att.ownerName.replace(/"/g, '""')}"`, att.ownerPhone, new Date(att.purchaseTimestamp).toLocaleString('id-ID'),
        att.status, att.scanTimestamp ? new Date(att.scanTimestamp).toLocaleString('id-ID') : "N/A"
      ];
      csvContent += row.join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daftar_pengunjung_event_${selectedEvent.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    else {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push('...');
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) pageNumbers.push(i);
      if (currentPage < totalPages - 3) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    return (
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-white p-4 rounded-b-lg border-t border-gray-200">
        <p className="mb-2 sm:mb-0">Menampilkan {currentDisplayAttendees.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedAttendees.length)} dari {filteredAndSortedAttendees.length} pengunjung</p>
        <div className="flex items-center space-x-1">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"><ChevronLeft size={16} /></button>
          {pageNumbers.map((number, index) => typeof number === 'string' ? <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-500">...</span> : <button key={number} onClick={() => setCurrentPage(number)} className={`px-3 py-1.5 rounded-md transition-colors border ${currentPage === number ? 'bg-hegra-turquoise text-white font-semibold border-hegra-turquoise' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}`}>{number}</button>)}
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"><ChevronRight size={16} /></button>
        </div>
      </div>
    );
  };

  const summaryCardsData = useMemo(() => [
    { title: 'Total Tiket Terjual', value: filteredAndSortedAttendees.length, dotColor: 'bg-blue-500' },
    { title: 'Sudah Hadir', value: filteredAndSortedAttendees.filter(a => a.status === 'Sudah Hadir').length, dotColor: 'bg-green-500' },
    { title: 'Belum Hadir', value: filteredAndSortedAttendees.filter(a => a.status === 'Belum Hadir').length, dotColor: 'bg-red-500' },
  ], [filteredAndSortedAttendees]);

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Data Pengunjung</h1>
          <p className="text-sm text-gray-600 mt-1">Menampilkan pengunjung untuk event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>
        </div>
         {/* "Pilih Event Lain" button removed here */}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCardsData.map(card => (
          <div key={card.title} className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center text-sm text-gray-600 mb-1">
                <span className={`h-2 w-2 ${card.dotColor} rounded-full mr-2`}></span>
                {card.title}
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {(['data', 'laporan', 'checkin'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              {tab === 'data' ? 'Data Pengunjung' : tab === 'laporan' ? 'Laporan' : 'Check In'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'data' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-hegra-deep-navy mb-4">Data Pengunjung untuk "{selectedEvent.name}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-end mb-6">
            <div className="lg:col-span-2">
              <label htmlFor="search-attendee" className="block text-xs font-medium text-gray-600 mb-1">Cari Data Pengunjung</label>
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" id="search-attendee" placeholder="ID, Nama, Telepon..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise bg-white" /></div>
            </div>
            <div><label htmlFor="filter-ticket-cat" className="block text-xs font-medium text-gray-600 mb-1">Kategori Tiket</label><select id="filter-ticket-cat" value={filterTicketCategory} onChange={e => setFilterTicketCategory(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">{uniqueTicketCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
            <div><label htmlFor="filter-status-att" className="block text-xs font-medium text-gray-600 mb-1">Status Kehadiran</label><select id="filter-status-att" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">{statusOptions.map(stat => <option key={stat} value={stat}>{stat}</option>)}</select></div>
            <div><label htmlFor="sort-order-att" className="block text-xs font-medium text-gray-600 mb-1">Urutkan</label><select id="sort-order-att" value={sortOrder} onChange={e => setSortOrder(e.target.value as typeof sortOrder)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white"><option value="eventDate_desc">Tanggal Event (Terbaru)</option><option value="eventDate_asc">Tanggal Event (Terlama)</option><option value="ownerName_asc">Nama Pemilik (A-Z)</option><option value="ownerName_desc">Nama Pemilik (Z-A)</option><option value="status_asc">Status (A-Z)</option><option value="status_desc">Status (Z-A)</option></select></div>
            <div className="flex items-center space-x-2">
              <button onClick={handleDownloadCSV} className="p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm" title="Download CSV" aria-label="Download CSV"><Download size={18} /></button>
              <button onClick={openScanModal} className="flex-grow bg-hegra-turquoise text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm flex items-center justify-center gap-1.5 border border-transparent" title="Scan Tiket Pengunjung" aria-label="Scan Tiket Pengunjung"><ScanLine size={18} /> Scan Tiket</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>{["ID Tiket", "ID Pesanan", "Nama Tiket", "Nama Pemilik", "No. Telepon", "Harga", "Status", "Waktu Scan", "Tgl. Pembelian", "Aksi"].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>))}</tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDisplayAttendees.length > 0 ? currentDisplayAttendees.map(att => (
                  <tr key={att.ticketId} className={`hover:bg-gray-50 transition-colors ${att.status === 'Sudah Hadir' ? 'bg-green-50' : ''}`}>
                    <td className="px-4 py-3 text-xs font-medium text-blue-600 whitespace-nowrap">{att.ticketId}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <button onClick={() => handleOpenOrderDetailModal(att.orderId)} className="text-blue-600 hover:underline focus:outline-none">
                            {att.orderId}
                        </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap max-w-[120px] truncate" title={att.ticketCategoryName}>{att.ticketCategoryName}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap max-w-[130px] truncate" title={att.ownerName}>{att.ownerName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{att.ownerPhone}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits:0 }).format(att.ticketPrice)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${att.status === 'Sudah Hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{att.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{att.scanTimestamp ? new Date(att.scanTimestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit'}) : '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(att.purchaseTimestamp).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button onClick={() => handleOpenEditStatusModal(att)} className="text-gray-400 hover:text-hegra-turquoise p-1" aria-label={`Edit status untuk ${att.ownerName}`}>
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                )) : (<tr><td colSpan={10} className="text-center py-10 text-gray-500"><Search size={32} className="mx-auto mb-2 text-gray-400"/>Tidak ada data pengunjung yang cocok untuk event ini.</td></tr>)}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        </div>
      )}
      {(activeTab === 'laporan' || activeTab === 'checkin') && (<div className="bg-white p-6 rounded-lg border border-gray-200 text-center"><Users size={48} className="mx-auto text-gray-300 mb-4" /><h2 className="text-xl font-semibold text-gray-700">Segera Hadir</h2><p className="text-gray-500 mt-2">Fitur {activeTab === 'laporan' ? 'Laporan Pengunjung' : 'Check In Pengunjung'} sedang dalam pengembangan.</p></div>)}
      
      {isScanModalOpen && (<ScanTicketModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} onProcessScan={handleProcessScan} availableAttendeesForDemo={attendees} scannedAttendeeInfo={lastScannedAttendeeInfo} scanStatus={lastScanStatus} />)}
      {isEditStatusModalOpen && selectedAttendeeForStatusEdit && (<EditAttendeeStatusModal isOpen={isEditStatusModalOpen} onClose={() => setIsEditStatusModalOpen(false)} attendee={selectedAttendeeForStatusEdit} onUpdateStatus={handleUpdateAttendeeStatus} />)}
      {isOrderDetailModalOpen && selectedOrderForDetail && (
        <OrderDetailModal
          isOpen={isOrderDetailModalOpen}
          onClose={() => { setIsOrderDetailModalOpen(false); setSelectedOrderForDetail(null); }}
          order={selectedOrderForDetail}
          fullEventData={selectedEvent} 
          onNavigate={(page, data) => console.log("Navigation from OrderDetailModal (PengunjungDB):", page, data)} 
        />
      )}
    </div>
  );
};

export default PengunjungDB;
