/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { EventData, TicketCategory, TicketCategoryWithEventInfo } from '../../HegiraApp';
import TicketItemCardDB from '../../components/dashboard/TicketItemCardDB';
import AddTicketModal from '../../components/dashboard/modals/AddTicketModal';
import { PlusCircle, Search, ChevronLeft, ChevronRight, Info, Download } from 'lucide-react';
import { sampleOrders } from './PesananDB';

interface TicketManagementPageProps {
  selectedEvent: EventData;
  onUpdateEvent: (updatedEvent: EventData) => void;
}

const ITEMS_PER_PAGE = 10;
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const TicketManagementPage: React.FC<TicketManagementPageProps> = ({ selectedEvent, onUpdateEvent }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'report'>('management');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEditTicketModal, setShowAddEditTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketCategoryWithEventInfo | null>(null);

  const allTicketsForEvent: TicketCategoryWithEventInfo[] = useMemo(() => {
    return (selectedEvent.ticketCategories || []).map(tc => ({
      ...tc,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      eventDateDisplay: selectedEvent.dateDisplay,
      eventTimeDisplay: selectedEvent.timeDisplay,
      eventTimezone: selectedEvent.timezone,
    }));
  }, [selectedEvent]);

  const filteredTickets = useMemo(() => {
    return allTicketsForEvent.filter(ticket =>
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTicketsForEvent, searchTerm]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentDisplayTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, reportSearchTerm]);
  
  const ticketReportData = useMemo(() => {
    const relevantOrders = sampleOrders.filter(
      order => order.eventId === selectedEvent.id && order.status === 'Berhasil'
    );

    const aggregation: Record<string, { ticketName: string; sold: number; revenue: number }> = {};
    
    relevantOrders.forEach(order => {
        order.tickets.forEach(ticket => {
            const key = ticket.categoryName; // Group by ticket name only
            if (!aggregation[key]) {
                aggregation[key] = { ticketName: ticket.categoryName, sold: 0, revenue: 0 };
            }
            aggregation[key].sold += ticket.quantity;
            aggregation[key].revenue += ticket.quantity * ticket.pricePerTicket;
        });
    });

    let finalData = Object.values(aggregation);
    if (reportSearchTerm) {
        finalData = finalData.filter(item => item.ticketName.toLowerCase().includes(reportSearchTerm.toLowerCase()));
    }
    return finalData.sort((a, b) => b.revenue - a.revenue); // Sort by revenue
  }, [selectedEvent.id, reportSearchTerm]);
  
  const totalReportRevenue = useMemo(() => ticketReportData.reduce((sum, item) => sum + item.revenue, 0), [ticketReportData]);


  const handleDownloadTicketReportCSV = () => {
    const headers = ["Nama Tiket", "Tiket Terjual", "Pendapatan"];
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\r\n";
    
    ticketReportData.forEach(item => {
        const row = [ `"${item.ticketName}"`, item.sold, item.revenue ];
        csvContent += row.join(",") + "\r\n";
    });
    
    csvContent += "\r\n"; // Add a blank line
    csvContent += `Total Pendapatan,,${totalReportRevenue}\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_tiket_${selectedEvent.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleSaveTicket = (ticketData: Omit<TicketCategory, 'id'> & { id?: string }) => {
    const updatedCategories = [...(selectedEvent.ticketCategories || [])];
    const fullTicketData: TicketCategory = {
      id: ticketData.id || `ticket-${Date.now()}`,
      name: ticketData.name,
      categoryLabel: ticketData.categoryLabel,
      price: ticketData.price,
      description: ticketData.description,
      maxQuantity: ticketData.maxQuantity,
      availabilityStatus: 'available', // Default status
      useEventSchedule: ticketData.useEventSchedule,
      ticketStartDate: ticketData.ticketStartDate,
      ticketEndDate: ticketData.ticketEndDate,
      ticketStartTime: ticketData.ticketStartTime,
      ticketEndTime: ticketData.ticketEndTime,
      ticketIsTimeRange: ticketData.ticketIsTimeRange,
      ticketTimezone: ticketData.ticketTimezone,
    };

    const existingIndex = updatedCategories.findIndex(tc => tc.id === fullTicketData.id);
    if (existingIndex !== -1) {
      updatedCategories[existingIndex] = fullTicketData;
    } else {
      updatedCategories.push(fullTicketData);
    }
    
    onUpdateEvent({ ...selectedEvent, ticketCategories: updatedCategories });
    setShowAddEditTicketModal(false);
    setEditingTicket(null);
  };
  
  const handleDeleteTicket = (ticketToDelete: TicketCategoryWithEventInfo) => {
    const updatedCategories = selectedEvent.ticketCategories.filter(tc => tc.id !== ticketToDelete.id);
    onUpdateEvent({ ...selectedEvent, ticketCategories: updatedCategories });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-8 flex justify-center items-center space-x-1">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-3.5 py-1.5 text-sm rounded-md ${currentPage === page ? 'bg-hegra-turquoise text-white' : 'bg-white'}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Manajemen Tiket</h1>
      <p className="text-sm text-gray-600">Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('management')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'management' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manajemen Tiket</button>
          <button onClick={() => setActiveTab('report')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Laporan Tiket</button>
        </nav>
      </div>

      {activeTab === 'management' && (
        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari nama tiket" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 text-sm bg-white" />
            </div>
            <button onClick={() => { setEditingTicket(null); setShowAddEditTicketModal(true); }} className="w-full sm:w-auto bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm flex-shrink-0">
              <PlusCircle size={18} /> Tambah Tiket
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDisplayTickets.map(ticket => (
              <TicketItemCardDB key={ticket.id} ticket={ticket} onEdit={() => { setEditingTicket(ticket); setShowAddEditTicketModal(true); }} onDelete={() => handleDeleteTicket(ticket)} />
            ))}
          </div>

          {filteredTickets.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                  <Info size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Belum ada tiket yang ditambahkan untuk event ini.</p>
              </div>
          )}

          {renderPagination()}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <h2 className="text-xl font-semibold text-hegra-deep-navy mb-4">Laporan Tiket</h2>
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
            <div className="relative flex-grow w-full sm:w-auto">
              <label htmlFor="report-search" className="text-xs font-medium text-gray-600">Cari Nama Tiket</label>
              <Search className="absolute left-3 top-1/2 transform translate-y-1 h-4 w-4 text-gray-400" />
              <input id="report-search" type="text" placeholder="Nama tiket..." value={reportSearchTerm} onChange={e => setReportSearchTerm(e.target.value)} className="w-full mt-1 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 text-sm bg-white" />
            </div>
            <button onClick={handleDownloadTicketReportCSV} className="w-full sm:w-auto p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Download Laporan (CSV)"><Download size={18} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>{["Nama Tiket", "Tiket Terjual", "Pendapatan"].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>))}</tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ticketReportData.length > 0 ? ticketReportData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.ticketName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.sold}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">{formatCurrency(item.revenue)}</td>
                  </tr>
                )) : (<tr><td colSpan={3} className="text-center py-10 text-gray-500">Tidak ada data penjualan tiket yang ditemukan.</td></tr>)}
              </tbody>
              {ticketReportData.length > 0 && (
                <tfoot className="bg-gray-100">
                    <tr>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right" colSpan={2}>Total Pendapatan</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-800">{formatCurrency(totalReportRevenue)}</td>
                    </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {showAddEditTicketModal && (
        <AddTicketModal isOpen={showAddEditTicketModal} onClose={() => setShowAddEditTicketModal(false)} onSave={handleSaveTicket} initialTicketData={editingTicket} eventTimezone={selectedEvent.timezone} />
      )}
    </div>
  );
};

export default TicketManagementPage;
