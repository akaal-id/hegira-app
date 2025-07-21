
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { LineChart, Users, Target, Handshake, BarChartHorizontalBig, Eye, MailOpen } from 'lucide-react';

// Placeholder for chart component
const PlaceholderChart: React.FC<{title: string}> = ({title}) => (
    <div className="h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">{title} (Chart Placeholder)</p>
    </div>
);

const PerformanceAnalyticsBM: React.FC = () => {
    const summaryData = [
        { label: "Total Kunjungan Profil", value: "1,250", icon: Eye, trend: "+15% bulan ini" },
        { label: "Permintaan Masuk", value: "78", icon: MailOpen, trend: "+5 minggu ini" },
        { label: "Koneksi Terjalin", value: "32", icon: Handshake, trend: "Stabil" },
        { label: "Layanan Populer", value: "Konsultasi Digital", icon: Target, trend: "Paling banyak dilihat" },
    ];

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy mb-6">Analitik Performa Business Matching</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map(item => (
            <div key={item.label} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center text-gray-500 mb-1">
                    <item.icon size={16} className="mr-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-hegra-deep-navy">{item.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.trend}</p>
            </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-md font-semibold text-hegra-deep-navy mb-3 flex items-center">
                <LineChart size={18} className="mr-2 text-hegra-turquoise"/> Tren Kunjungan Profil (30 Hari Terakhir)
            </h2>
            <PlaceholderChart title="Grafik Kunjungan Profil"/>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-md font-semibold text-hegra-deep-navy mb-3 flex items-center">
                <BarChartHorizontalBig size={18} className="mr-2 text-hegra-turquoise"/> Sumber Permintaan Masuk
            </h2>
            <PlaceholderChart title="Grafik Sumber Permintaan"/>
        </div>
         <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm lg:col-span-2">
            <h2 className="text-md font-semibold text-hegra-deep-navy mb-3 flex items-center">
                <Users size={18} className="mr-2 text-hegra-turquoise"/> Demografi Pengunjung Profil (Segera Hadir)
            </h2>
            <PlaceholderChart title="Grafik Demografi Pengunjung"/>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Fitur analitik ini masih dalam tahap pengembangan. Data yang ditampilkan adalah simulasi.</p>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsBM;
