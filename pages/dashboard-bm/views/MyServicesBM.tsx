
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PackageSearch, PlusCircle, Edit3, Trash2, Search, DollarSign, Info, Settings } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange?: string; // e.g., "Rp 5jt - Rp 20jt" or "Per Proyek"
  keywords: string[];
}

// Sample Data
const sampleServices: ServiceItem[] = [
  { id: 'svc001', name: 'Konsultasi Strategi Digital', category: 'Konsultasi Bisnis', description: 'Membantu perusahaan merumuskan dan mengimplementasikan strategi digital yang efektif.', priceRange: 'Rp 10jt - Rp 50jt', keywords: ['digital marketing', 'SEO', 'social media'] },
  { id: 'svc002', name: 'Pengembangan Aplikasi Mobile', category: 'Pengembangan Software', description: 'Pembuatan aplikasi mobile cross-platform untuk Android dan iOS.', priceRange: 'Mulai Rp 30jt', keywords: ['android', 'ios', 'react native', 'flutter'] },
  { id: 'svc003', name: 'Manajemen Event Korporat', category: 'Event Organizer', description: 'Penyelenggaraan event perusahaan dari A-Z, termasuk konferensi, seminar, dan gathering.', priceRange: 'Per Proyek', keywords: ['event planning', 'MICE', 'corporate event'] },
];

const MyServicesBM: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(sampleServices);
  const [searchTerm, setSearchTerm] = useState('');
  // Modal states for add/edit would go here
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddService = () => alert("Fungsi tambah layanan belum diimplementasikan.");
  const handleEditService = (service: ServiceItem) => alert(`Edit layanan: ${service.name} (belum diimplementasikan).`);
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm("Anda yakin ingin menghapus layanan ini?")) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
      alert("Layanan dihapus (simulasi).");
    }
  };

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Layanan Saya</h1>
        <button
          onClick={handleAddService}
          className="bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm mt-3 sm:mt-0"
        >
          <PlusCircle size={18} /> Tambah Layanan Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama layanan, kategori, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
          />
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 leading-tight flex-grow mr-2" title={service.name}>
                    {service.name}
                  </h3>
                  <div className="flex-shrink-0 flex items-center space-x-1.5">
                    <button onClick={() => handleEditService(service)} className="text-blue-500 hover:text-blue-700 p-1" aria-label={`Edit ${service.name}`}><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteService(service.id)} className="text-red-500 hover:text-red-700 p-1" aria-label={`Hapus ${service.name}`}><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-xs font-medium text-hegra-turquoise bg-hegra-turquoise/10 px-2 py-0.5 rounded-full inline-block mb-2">{service.category}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">{service.description}</p>
                
                {service.priceRange && (
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <DollarSign size={14} className="mr-1.5 text-gray-400" /> Estimasi Harga: <span className="font-medium text-gray-700 ml-1">{service.priceRange}</span>
                  </div>
                )}
              </div>
              <div className="px-5 pb-4 border-t border-gray-100 mt-auto">
                <p className="text-xs text-gray-500 mt-2">Kata Kunci:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {service.keywords.map(kw => <span key={kw} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{kw}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Anda belum menambahkan layanan, atau tidak ada yang cocok dengan pencarian.</p>
        </div>
      )}
      {/* Modal for Add/Edit Service would be rendered here */}
    </div>
  );
};

export default MyServicesBM;
