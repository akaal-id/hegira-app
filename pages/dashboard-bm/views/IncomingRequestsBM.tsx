
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Inbox, Search, ChevronLeft, ChevronRight, Briefcase, UserCircle, MessageSquare, CalendarClock } from 'lucide-react';

interface RequestItem {
  id: string;
  fromCompany: string;
  contactPerson: string;
  contactEmail: string;
  requestDate: string; // ISO string
  subject: string;
  status: 'Baru' | 'Dibaca' | 'Dibalas' | 'Selesai';
  messagePreview: string;
}

// Sample Data
const sampleRequests: RequestItem[] = [
  { id: 'req001', fromCompany: 'PT Inovasi Digital', contactPerson: 'Bapak Andi', contactEmail: 'andi@inovasi.com', requestDate: '2024-07-28T10:00:00Z', subject: 'Permintaan Demo Produk CRM', status: 'Baru', messagePreview: 'Kami tertarik untuk melihat demo produk CRM Anda...' },
  { id: 'req002', fromCompany: 'CV Kreatif Jaya', contactPerson: 'Ibu Sarah', contactEmail: 'sarah.k@kreatifjaya.id', requestDate: '2024-07-27T15:30:00Z', subject: 'Proposal Kerjasama Event Launching', status: 'Dibaca', messagePreview: 'Berikut kami lampirkan proposal kerjasama untuk...' },
  { id: 'req003', fromCompany: 'Startup Cepat Maju', contactPerson: 'Mas Rian', contactEmail: 'rian@cepatmaju.dev', requestDate: '2024-07-26T09:00:00Z', subject: 'Pertanyaan terkait Layanan Konsultasi IT', status: 'Dibalas', messagePreview: 'Saya ingin bertanya lebih detail mengenai layanan...' },
];

const ITEMS_PER_PAGE = 8;

const IncomingRequestsBM: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>(sampleRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Modal states for viewing full request or replying would go here
  // const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  const filteredRequests = requests.filter(req =>
    req.fromCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const currentDisplayRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const statusStyles: Record<RequestItem['status'], string> = {
    'Baru': 'bg-blue-100 text-blue-700',
    'Dibaca': 'bg-yellow-100 text-yellow-700',
    'Dibalas': 'bg-green-100 text-green-700',
    'Selesai': 'bg-gray-100 text-gray-600',
  };

  const handleViewRequest = (request: RequestItem) => alert(`Lihat detail permintaan: ${request.subject} (belum diimplementasikan).`);
  const handleReplyRequest = (request: RequestItem) => alert(`Balas permintaan: ${request.subject} (belum diimplementasikan).`);
  const handleScheduleMeeting = (request: RequestItem) => alert(`Jadwalkan meeting untuk: ${request.subject} (belum diimplementasikan).`);


  const renderPagination = () => {
     if (totalPages <= 1) return null;
     // Simplified pagination for brevity
    return (
      <div className="mt-6 flex justify-between items-center text-sm">
        <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1} className="px-3 py-1 border rounded-md disabled:opacity-50">
            <ChevronLeft size={16} className="inline"/> Sebelumnya
        </button>
        <span>Halaman {currentPage} dari {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">
            Berikutnya <ChevronRight size={16} className="inline"/>
        </button>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy mb-6">Permintaan Masuk</h1>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan perusahaan, kontak, atau subjek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise text-sm bg-white"
          />
        </div>
      </div>

      {currentDisplayRequests.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {currentDisplayRequests.map(req => (
              <li key={req.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewRequest(req)}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center mb-0.5">
                       <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full mr-2 ${statusStyles[req.status]}`}>{req.status}</span>
                       <p className="text-sm font-semibold text-hegra-turquoise truncate" title={req.subject}>{req.subject}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Briefcase size={13} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate" title={req.fromCompany}>{req.fromCompany}</span>
                      <span className="mx-1.5">·</span>
                      <UserCircle size={13} className="mr-1 flex-shrink-0" />
                      <span className="truncate" title={req.contactPerson}>{req.contactPerson}</span>
                    </div>
                     <p className="text-xs text-gray-600 mt-1 line-clamp-1" title={req.messagePreview}>{req.messagePreview}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:items-end items-start mt-2 sm:mt-0">
                     <p className="text-xs text-gray-400 mb-1.5">{new Date(req.requestDate).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                     <div className="flex space-x-1.5">
                        <button onClick={(e) => {e.stopPropagation(); handleReplyRequest(req)}} className="p-1.5 text-xs text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md" title="Balas"><MessageSquare size={14}/></button>
                        <button onClick={(e) => {e.stopPropagation(); handleScheduleMeeting(req)}} className="p-1.5 text-xs text-green-600 bg-green-100 hover:bg-green-200 rounded-md" title="Jadwalkan Meeting"><CalendarClock size={14}/></button>
                     </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {renderPagination()}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Tidak ada permintaan masuk saat ini, atau tidak ada yang cocok dengan pencarian.</p>
        </div>
      )}
      {/* Modal for View/Reply Request would be rendered here */}
    </div>
  );
};

export default IncomingRequestsBM;
