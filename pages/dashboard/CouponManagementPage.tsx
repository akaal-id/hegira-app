/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { EventData, TicketCategory } from '../../HegiraApp';
import CouponItemCardDB, { CouponData } from '../../components/dashboard/CouponItemCardDB';
import AddCouponModal from '../../components/dashboard/modals/AddCouponModal';
import { PlusCircle, Search, ChevronLeft, ChevronRight, Info, Download } from 'lucide-react';
import { sampleOrders } from './PesananDB';

interface CouponManagementPageProps {
  selectedEvent: EventData;
}

const ITEMS_PER_PAGE = 10;

// Sample coupon data, managed locally for this component
const sampleCoupons: CouponData[] = [
    { id: 'KPN001', name: 'Diskon Awal', code: 'EARLYBIRD10', discountType: 'percentage', discountValue: 10, quantity: 50, applicableTicketIds: ['startup-delegate'] },
    { id: 'KPN002', name: 'Diskon Investor', code: 'INVEST2026', discountType: 'fixed', discountValue: 500000, quantity: 20, resetsDaily: true, applicableTicketIds: ['investor-pass-asean'] },
    { id: 'KPN003', name: 'Flash Sale', code: 'FLASHASEAN', discountType: 'percentage', discountValue: 25, quantity: 10, endDate: '2025-12-31' },
];

const CouponManagementPage: React.FC<CouponManagementPageProps> = ({ selectedEvent }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'report'>('management');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [showAddEditCouponModal, setShowAddEditCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);
  
  useEffect(() => {
    // Simulate fetching coupons for the selected event
    setCoupons(sampleCoupons);
    setCurrentPage(1);
    setSearchTerm('');
    setReportSearchTerm('');
    setReportStartDate('');
    setReportEndDate('');
  }, [selectedEvent]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon =>
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const currentDisplayCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCoupons.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCoupons, currentPage]);
  
  const couponReportData = useMemo(() => {
    const relevantOrders = sampleOrders.filter(
        order => order.eventId === selectedEvent.id && order.status === 'Berhasil' && order.coupon
    );

    let filteredByDateOrders = relevantOrders;
    if (reportStartDate || reportEndDate) {
        const startDate = reportStartDate ? new Date(reportStartDate + 'T00:00:00') : null;
        const endDate = reportEndDate ? new Date(reportEndDate + 'T23:59:59') : null;
        
        filteredByDateOrders = relevantOrders.filter(order => {
            const orderDate = new Date(order.orderTimestamp);
            if (startDate && endDate) {
                return orderDate >= startDate && orderDate <= endDate;
            }
            if (startDate) {
                return orderDate >= startDate;
            }
            if (endDate) {
                return orderDate <= endDate;
            }
            return true;
        });
    }

    const aggregation: Record<string, { couponName: string; date: string; count: number; }> = {};
    filteredByDateOrders.forEach(order => {
        if (order.coupon) {
            const orderDate = new Date(order.orderTimestamp).toISOString().split('T')[0];
            const key = `${order.coupon.name}__${orderDate}`;
            if (!aggregation[key]) {
                aggregation[key] = { couponName: order.coupon.name, date: orderDate, count: 0 };
            }
            aggregation[key].count += 1;
        }
    });
    
    let finalData = Object.values(aggregation);
    if (reportSearchTerm) {
        finalData = finalData.filter(item => item.couponName.toLowerCase().includes(reportSearchTerm.toLowerCase()));
    }

    return finalData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedEvent.id, reportStartDate, reportEndDate, reportSearchTerm]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, reportStartDate, reportEndDate, reportSearchTerm]);

  const handleSaveCoupon = (couponData: Omit<CouponData, 'id'> & { id?: string }) => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...couponData } : c));
    } else {
      const newCoupon: CouponData = { ...couponData, id: `KPN-${Date.now().toString().slice(-5)}` };
      setCoupons(prev => [newCoupon, ...prev]);
    }
    setShowAddEditCouponModal(false);
    setEditingCoupon(null);
  };
  
  const handleDeleteCoupon = (couponToDelete: CouponData) => {
    setCoupons(prev => prev.filter(c => c.id !== couponToDelete.id));
  };
  
  const handleDownloadCouponReportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Nama Kupon,Tanggal Terpakai,Jumlah Kupon Terpakai\r\n";
    couponReportData.forEach(item => {
        const row = [ `"${item.couponName}"`, item.date, item.count ];
        csvContent += row.join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_kupon_${selectedEvent.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Manajemen Kupon</h1>
      <p className="text-sm text-gray-600">Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('management')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'management' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manajemen Kupon</button>
          <button onClick={() => setActiveTab('report')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Laporan Kupon</button>
        </nav>
      </div>

      {activeTab === 'management' && (
        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari nama atau kode kupon" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 text-sm bg-white" />
            </div>
            <button onClick={() => { setEditingCoupon(null); setShowAddEditCouponModal(true); }} className="w-full sm:w-auto bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm flex-shrink-0">
              <PlusCircle size={18} /> Tambah Kupon
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDisplayCoupons.map(coupon => (
              <CouponItemCardDB key={coupon.id} coupon={coupon} eventTickets={selectedEvent.ticketCategories || []} eventName={selectedEvent.name} onEdit={() => { setEditingCoupon(coupon); setShowAddEditCouponModal(true); }} onDelete={() => handleDeleteCoupon(coupon)} />
            ))}
          </div>

          {filteredCoupons.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                  <Info size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Belum ada kupon yang ditambahkan untuk event ini.</p>
              </div>
          )}

          {renderPagination()}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <h2 className="text-xl font-semibold text-hegra-deep-navy mb-4">Laporan Kupon</h2>
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
            <div className="relative flex-grow w-full sm:w-auto">
              <label htmlFor="report-search-coupon" className="text-xs font-medium text-gray-600">Cari Nama Kupon</label>
              <Search className="absolute left-3 top-1/2 transform translate-y-1 h-4 w-4 text-gray-400" />
              <input id="report-search-coupon" type="text" placeholder="Nama kupon..." value={reportSearchTerm} onChange={e => setReportSearchTerm(e.target.value)} className="w-full mt-1 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 text-sm bg-white" />
            </div>
            <div className="flex-grow w-full sm:w-auto">
              <label htmlFor="report-start-date-coupon" className="block text-xs font-medium text-gray-600 mb-1">Tanggal Terpakai</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-0.5 bg-white focus-within:ring-2 focus-within:ring-hegra-turquoise/20 focus-within:border-hegra-turquoise/50">
                <input
                  id="report-start-date-coupon"
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="w-full p-1.5 border-none focus:ring-0 text-sm text-gray-500 bg-transparent"
                  aria-label="Tanggal Mulai"
                />
                <span className="text-gray-400">-</span>
                <input
                  id="report-end-date-coupon"
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  min={reportStartDate}
                  className="w-full p-1.5 border-none focus:ring-0 text-sm text-gray-500 bg-transparent"
                  aria-label="Tanggal Selesai"
                />
              </div>
            </div>
            <button onClick={handleDownloadCouponReportCSV} className="w-full sm:w-auto p-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Download Laporan (CSV)"><Download size={18} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>{["Nama Kupon", "Tanggal Terpakai", "Jumlah Kupon Terpakai"].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>))}</tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {couponReportData.length > 0 ? couponReportData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.couponName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.date + 'T00:00:00').toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.count}</td>
                  </tr>
                )) : (<tr><td colSpan={3} className="text-center py-10 text-gray-500">Tidak ada data penggunaan kupon yang ditemukan.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddEditCouponModal && (
        <AddCouponModal isOpen={showAddEditCouponModal} onClose={() => setShowAddEditCouponModal(false)} onSave={handleSaveCoupon} initialCouponData={editingCoupon} availableTickets={selectedEvent.ticketCategories || []} />
      )}
    </div>
  );
};

export default CouponManagementPage;