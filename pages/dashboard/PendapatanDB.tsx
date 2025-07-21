/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import { EventData } from '../../HegiraApp';
import { sampleOrders, OrderItem } from './PesananDB'; // Import sampleOrders and OrderItem
import { DollarSign, BarChart2, PiggyBank, Landmark, AlertCircle, CreditCard } from 'lucide-react';

interface PendapatanDBProps {
  selectedEvent: EventData;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgColorClass?: string; textColorClass?: string; iconColorClass?: string }> = 
  ({ title, value, icon: Icon, bgColorClass = "bg-blue-50", textColorClass = "text-blue-700", iconColorClass="text-blue-500" }) => (
  <div className={`p-5 rounded-lg border ${bgColorClass.replace('bg-','border-')} shadow-sm`}>
    <div className="flex items-center mb-1">
      <Icon size={18} className={`mr-2 ${iconColorClass}`} />
      <h3 className={`text-sm font-medium ${textColorClass}`}>{title}</h3>
    </div>
    <p className={`text-2xl font-bold ${textColorClass.replace('text-','text-').replace('-500','-800').replace('-700','-900')}`}>{value}</p>
  </div>
);

const PendapatanDB: React.FC<PendapatanDBProps> = ({ selectedEvent }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankLainMessage, setShowBankLainMessage] = useState(false);

  const eventOrders = useMemo(() => {
    return sampleOrders.filter(order => order.eventId === selectedEvent.id);
  }, [selectedEvent.id]);

  const totalPendapatan = useMemo(() => {
    return eventOrders
      .filter(order => order.status === 'Berhasil' || order.status === 'Pending')
      .reduce((sum, order) => sum + order.totalPrice, 0);
  }, [eventOrders]);

  const totalPemasukan = useMemo(() => {
    return eventOrders
      .filter(order => order.status === 'Berhasil')
      .reduce((sum, order) => sum + order.totalPrice, 0);
  }, [eventOrders]);

  const pendapatanBersih = useMemo(() => {
    let totalAdminFee = 0;
    const berhasilOrders = eventOrders.filter(order => order.status === 'Berhasil');
    
    berhasilOrders.forEach(order => {
      order.tickets.forEach(ticketItem => {
        if (ticketItem.pricePerTicket > 0) { // Only apply fee to paid tickets
          const feePerTicket = 4000 + (0.05 * ticketItem.pricePerTicket);
          totalAdminFee += feePerTicket * ticketItem.quantity;
        }
      });
    });
    return totalPemasukan - totalAdminFee;
  }, [eventOrders, totalPemasukan]);

  const bankOptions = [
    { value: "", label: "Pilih Bank" },
    { value: "BSI", label: "BSI (Bank Syariah Indonesia)" },
    { value: "BCA", label: "BCA (Bank Central Asia)" },
    { value: "Mandiri", label: "Bank Mandiri" },
    { value: "Bank Lain", label: "Bank Lainnya" },
  ];

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = e.target.value;
    setSelectedBank(bank);
    setShowBankLainMessage(bank === "Bank Lain");
  };

  const handleWithdrawFunds = () => {
    if (!accountNumber.trim()) {
        alert("Nomor rekening tidak boleh kosong.");
        return;
    }
    if (!selectedBank || selectedBank === "Bank Lain") {
        alert("Harap pilih bank yang valid atau hubungi admin jika memilih 'Bank Lain'.");
        return;
    }
    alert(`Permintaan penarikan dana sebesar ${formatCurrency(pendapatanBersih)} ke rekening ${accountNumber} (${selectedBank}) telah dikirim untuk diproses oleh Admin Hegira.`);
    // Here you would typically make an API call
  };

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy mb-2">Pendapatan Event</h1>
      <p className="text-sm text-gray-600 mb-6">Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
            title="Total Pendapatan (Estimasi)" 
            value={formatCurrency(totalPendapatan)} 
            icon={DollarSign}
            bgColorClass="bg-blue-50"
            textColorClass="text-blue-700"
            iconColorClass="text-blue-500"
        />
        <MetricCard 
            title="Total Pemasukan (Berhasil)" 
            value={formatCurrency(totalPemasukan)} 
            icon={BarChart2}
            bgColorClass="bg-green-50"
            textColorClass="text-green-700"
            iconColorClass="text-green-500"
        />
        <MetricCard 
            title="Pendapatan Bersih (Setelah Fee)" 
            value={formatCurrency(pendapatanBersih)} 
            icon={PiggyBank}
            bgColorClass="bg-purple-50"
            textColorClass="text-purple-700"
            iconColorClass="text-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
            <CreditCard size={20} className="mr-3 text-hegra-turquoise" />
            <h2 className="text-xl font-semibold text-hegra-deep-navy">Rekening Bank Anda & Penarikan Dana</h2>
        </div>
        <div className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors bg-white"
              placeholder="Masukkan nomor rekening Anda"
            />
          </div>
          <div>
            <label htmlFor="selectedBank" className="block text-sm font-medium text-gray-700 mb-1">Nama Bank <span className="text-red-500">*</span></label>
            <div className="relative">
                <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                id="selectedBank"
                value={selectedBank}
                onChange={handleBankChange}
                className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors appearance-none bg-white"
                >
                {bankOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          {showBankLainMessage && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-sm">
              <div className="flex">
                <div className="py-1"><AlertCircle className="h-5 w-5 text-yellow-400 mr-3" /></div>
                <div>
                  Untuk pilihan 'Bank Lain', silakan hubungi Admin Hegira untuk proses penarikan dana secara manual.
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleWithdrawFunds}
              disabled={selectedBank === "Bank Lain" || !accountNumber.trim() || !selectedBank.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-hegra-yellow text-hegra-navy font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <DollarSign size={18} /> Tarik Dana
            </button>
             <p className="text-xs text-gray-500 mt-2">
              Saldo yang dapat ditarik: <strong className="text-hegra-deep-navy">{formatCurrency(pendapatanBersih)}</strong>. 
              Proses penarikan dana memerlukan verifikasi oleh Admin Hegira (1-3 hari kerja).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendapatanDB;