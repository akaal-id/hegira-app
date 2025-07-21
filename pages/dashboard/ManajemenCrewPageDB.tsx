/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { EventData } from '../../HegiraApp';
import { DashboardViewId } from '../DashboardPage';
import { Users, Search, ChevronLeft, ChevronRight as ChevronRightIcon, PlusCircle, ScanLine, Edit3, BarChartHorizontalBig, QrCode, Info, Trash2, ArrowLeft } from 'lucide-react';
import CrewIDCardModal from '../../components/dashboard/modals/CrewIDCardModal';
import SingleCrewBarcodeModal from '../../components/dashboard/modals/SingleCrewBarcodeModal';
import EditCrewStatusModal from '../../components/dashboard/modals/EditCrewStatusModal';
import ScanCrewAttendanceModal from '../../components/dashboard/modals/ScanCrewAttendanceModal';
import { ScanStatus } from './PengunjungDB';
import AddCrewModal from '../../components/dashboard/modals/AddCrewModal'; // New import
import DeleteCrewModal from '../../components/dashboard/modals/DeleteCrewModal'; // New import


export interface CrewMember {
  id: string; 
  name: string;
  role: string; 
  phoneNumber: string;
  status: 'Hadir' | 'Belum Hadir';
  eventId: number; 
  eventName: string; 
  scanTimestamp?: string; 
}

// Sample data - this should eventually come from props or a data store
const allSampleCrewGlobal: CrewMember[] = [
  { id: 'CRW-001-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Agus Salim', role: 'Keamanan', phoneNumber: '08123456001', status: 'Belum Hadir' },
  { id: 'CRW-002-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Budi Doremi', role: 'Logistik', phoneNumber: '08123456002', status: 'Hadir', scanTimestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'CRW-003-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Citra Kirana', role: 'Dokumentasi', phoneNumber: '08123456003', status: 'Belum Hadir' },
  { id: 'CRW-004-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Dewi Sandra', role: 'Ticketing', phoneNumber: '08123456004', status: 'Hadir', scanTimestamp: new Date(Date.now() - 7200000).toISOString()},
  { id: 'CRW-005-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Eko Patrio', role: 'Keamanan', phoneNumber: '08123456005', status: 'Belum Hadir' },
  { id: 'CRW-006-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Fahmi Idris', role: 'Stage Manager', phoneNumber: '08123456006', status: 'Belum Hadir' },
  { id: 'CRW-007-EVT101', eventId: 101, eventName: "Jakarta Culinary Expo 2025", name: 'Gina Carano', role: 'Usher', phoneNumber: '08123456007', status: 'Hadir', scanTimestamp: new Date().toISOString() },
  { id: 'CRW-001-EVT102', eventId: 102, eventName: "ASEAN Startup Summit 2026", name: 'Hadi Pranoto', role: 'Sound Engineer', phoneNumber: '08123456008', status: 'Belum Hadir' },
  { id: 'CRW-002-EVT102', eventId: 102, eventName: "ASEAN Startup Summit 2026", name: 'Indah Permatasari', role: 'Liaison Officer', phoneNumber: '08123456009', status: 'Hadir', scanTimestamp: new Date().toISOString() },
  { id: 'CRW-003-EVT102', eventId: 102, eventName: "ASEAN Startup Summit 2026", name: 'Joko Anwar', role: 'Keamanan', phoneNumber: '08123456010', status: 'Belum Hadir' },
];

interface ManajemenCrewPageDBProps {
  selectedEvent: EventData;
  onSwitchView: (viewId: DashboardViewId, data?: any) => void;
}

const ITEMS_PER_PAGE = 8;

const ManajemenCrewPageDB: React.FC<ManajemenCrewPageDBProps> = ({ selectedEvent, onSwitchView }) => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showCrewIDCardModal, setShowCrewIDCardModal] = useState(false);
  const [showSingleCrewBarcodeModal, setShowSingleCrewBarcodeModal] = useState(false);
  const [selectedCrewForBarcode, setSelectedCrewForBarcode] = useState<CrewMember | null>(null);
  const [showEditCrewStatusModal, setShowEditCrewStatusModal] = useState(false);
  const [selectedCrewForStatusEdit, setSelectedCrewForStatusEdit] = useState<CrewMember | null>(null);
  const [showScanCrewModal, setShowScanCrewModal] = useState(false);
  const [lastScannedCrewInfo, setLastScannedCrewInfo] = useState<CrewMember | null>(null);
  const [lastScanStatus, setLastScanStatus] = useState<ScanStatus>('IDLE');

  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [showDeleteCrewModal, setShowDeleteCrewModal] = useState(false);
  const [crewToDelete, setCrewToDelete] = useState<CrewMember | null>(null);

  useEffect(() => {
    const eventCrew = allSampleCrewGlobal.filter(crew => crew.eventId === selectedEvent.id);
    setCrewMembers(eventCrew);
    setCurrentPage(1); 
    setSearchTerm(''); setFilterRole(''); setFilterStatus('');
  }, [selectedEvent]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(crewMembers.map(crew => crew.role));
    return ["Semua Role", ...Array.from(roles).sort()];
  }, [crewMembers]);

  const filteredCrew = useMemo(() => {
    return crewMembers.filter(crew =>
      (crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       crew.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       crew.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === '' || filterRole === "Semua Role" || crew.role === filterRole) &&
      (filterStatus === '' || filterStatus === "Semua Status" || crew.status === filterStatus)
    );
  }, [crewMembers, searchTerm, filterRole, filterStatus]);

  const totalCrew = crewMembers.length;
  const hadirCrew = crewMembers.filter(c => c.status === 'Hadir').length;
  const belumHadirCrew = totalCrew - hadirCrew;

  const summaryData = [
    { title: 'Total Crew', count: totalCrew, color: 'bg-blue-500' },
    { title: 'Hadir', count: hadirCrew, color: 'bg-green-500' },
    { title: 'Belum Hadir', count: belumHadirCrew, color: 'bg-yellow-500' },
  ];

  const totalPages = Math.ceil(filteredCrew.length / ITEMS_PER_PAGE);
  const currentDisplayCrew = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCrew.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCrew, currentPage]);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenSingleBarcodeModal = (crew: CrewMember) => { setSelectedCrewForBarcode(crew); setShowSingleCrewBarcodeModal(true); };
  const handleOpenEditStatusModal = (crew: CrewMember) => { setSelectedCrewForStatusEdit(crew); setShowEditCrewStatusModal(true); };
  
  const handleUpdateCrewStatus = (crewId: string, newStatus: 'Hadir' | 'Belum Hadir') => {
    setCrewMembers(prev => prev.map(crew => crew.id === crewId ? { ...crew, status: newStatus, scanTimestamp: newStatus === 'Hadir' ? new Date().toISOString() : undefined } : crew));
    setShowEditCrewStatusModal(false);
  };
  
  const handleProcessCrewScan = (scannedId: string) => {
    setLastScanStatus('SCANNING');
    setTimeout(() => {
      const foundCrewIndex = crewMembers.findIndex(crew => crew.id === scannedId && crew.eventId === selectedEvent.id);
      if (foundCrewIndex !== -1) {
        const crewToUpdate = crewMembers[foundCrewIndex];
        if (crewToUpdate.status === 'Belum Hadir') {
          const updatedCrew = { ...crewToUpdate, status: 'Hadir' as 'Hadir', scanTimestamp: new Date().toISOString() };
          const newCrewList = [...crewMembers];
          newCrewList[foundCrewIndex] = updatedCrew;
          setCrewMembers(newCrewList);
          setLastScannedCrewInfo(updatedCrew);
          setLastScanStatus('SUCCESS');
        } else {
          setLastScannedCrewInfo(crewToUpdate);
          setLastScanStatus('ALREADY_SCANNED');
        }
      } else {
        setLastScannedCrewInfo(null);
        setLastScanStatus('NOT_FOUND');
      }
    }, 500);
  };

  const handleAddCrew = (newCrewData: Omit<CrewMember, 'id' | 'eventId' | 'eventName' | 'status'>) => {
    const newCrew: CrewMember = {
      id: `CRW-${Date.now().toString().slice(-5)}-EVT${selectedEvent.id}`,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      status: 'Belum Hadir',
      ...newCrewData,
    };
    setCrewMembers(prev => [newCrew, ...prev]); // Add to the beginning for visibility
    setShowAddCrewModal(false);
  };

  const handleOpenDeleteCrewModal = (crew: CrewMember) => {
    setCrewToDelete(crew);
    setShowDeleteCrewModal(true);
  };

  const handleConfirmDeleteCrew = () => {
    if (crewToDelete) {
      setCrewMembers(prev => prev.filter(crew => crew.id !== crewToDelete.id));
      setShowDeleteCrewModal(false);
      setCrewToDelete(null);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbersToDisplay = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pageNumbersToDisplay.push(i); }
    else {
        pageNumbersToDisplay.push(1);
        if (currentPage > 4) pageNumbersToDisplay.push('...');
        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) pageNumbersToDisplay.push(i);
        if (currentPage < totalPages - 3) pageNumbersToDisplay.push('...');
        pageNumbersToDisplay.push(totalPages);
    }
    return (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-white p-4 rounded-b-lg border-t border-gray-200">
            <p className="mb-2 sm:mb-0">Menampilkan {currentDisplayCrew.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCrew.length)} dari {filteredCrew.length} crew</p>
            <div className="flex items-center space-x-1">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"><ChevronLeft size={16} /></button>
                {pageNumbersToDisplay.map((number, index) => typeof number === 'string' ? <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-500">...</span> : <button key={number} onClick={() => setCurrentPage(number)} className={`px-3 py-1.5 rounded-md transition-colors border focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 ${currentPage === number ? 'bg-hegra-turquoise text-white font-semibold border-hegra-turquoise' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}`}>{number}</button>)}
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"><ChevronRightIcon size={16} /></button>
            </div>
        </div>
    );
  };


  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex-grow">
                <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Manajemen Crew Event</h1>
                <p className="text-sm text-gray-600 mt-1">Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>
            </div>
            <button
            onClick={() => setShowCrewIDCardModal(true)}
            className="bg-hegra-yellow text-hegra-navy font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm mt-3 sm:mt-0"
            >
            <QrCode size={18} /> Lihat Kartu ID Crew
            </button>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center text-xs text-gray-600 mb-1"><span className={`h-2 w-2 ${item.color} rounded-full mr-2`}></span>{item.title}</div>
            <p className="text-2xl font-bold text-gray-800">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2 lg:col-span-2">
            <label htmlFor="search-crew" className="block text-xs font-medium text-gray-600 mb-1">Cari Crew</label>
            <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" id="search-crew" placeholder="Nama, Role, ID Crew..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise bg-white"/></div>
          </div>
          <div>
            <label htmlFor="filter-role-crew" className="block text-xs font-medium text-gray-600 mb-1">Filter Role</label>
            <select id="filter-role-crew" value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">{uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}</select>
          </div>
          <div>
            <label htmlFor="filter-status-crew" className="block text-xs font-medium text-gray-600 mb-1">Filter Status</label>
            <select id="filter-status-crew" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:ring-hegra-turquoise focus:border-hegra-turquoise appearance-none bg-white">
              <option value="">Semua Status</option><option value="Hadir">Hadir</option><option value="Belum Hadir">Belum Hadir</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 md:col-span-2 lg:col-span-1">
             <button
                title="Scan Kehadiran Crew"
                onClick={() => setShowScanCrewModal(true)}
                className="p-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex-shrink-0"
             >
                <ScanLine size={20} />
             </button>
             <button
                onClick={() => setShowAddCrewModal(true)}
                className="bg-hegra-turquoise hover:bg-hegra-turquoise/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center gap-1.5 text-sm flex-grow justify-center"
             >
                <PlusCircle size={18} /> Tambah Crew
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>{["Nama", "Role", "ID Crew", "No. Telepon", "Status", "Aksi"].map(header => (<th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>))}</tr></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDisplayCrew.length > 0 ? currentDisplayCrew.map(crew => (
              <tr key={crew.id} className={`hover:bg-gray-50 transition-colors ${crew.status === 'Hadir' ? 'bg-green-50' : ''}`}>
                <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{crew.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{crew.role}</td>
                <td className="px-4 py-3 text-sm text-blue-600 whitespace-nowrap font-mono"><button onClick={() => handleOpenSingleBarcodeModal(crew)} className="hover:underline">{crew.id}</button></td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{crew.phoneNumber}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${crew.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{crew.status}</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <button onClick={() => handleOpenEditStatusModal(crew)} className="text-gray-400 hover:text-hegra-turquoise p-1 mx-1" title="Edit Status"><Edit3 size={16} /></button>
                  <button onClick={() => handleOpenDeleteCrewModal(crew)} className="text-gray-400 hover:text-red-500 p-1 mx-1" title="Hapus Crew"><Trash2 size={16} /></button>
                </td>
              </tr>
            )) : (<tr><td colSpan={6} className="text-center py-10 text-gray-500"><Search size={32} className="mx-auto mb-2 text-gray-400"/>Tidak ada data crew yang cocok.</td></tr>)}
          </tbody>
        </table>
      </div>
      {renderPagination()}

      {showCrewIDCardModal && <CrewIDCardModal isOpen={showCrewIDCardModal} onClose={() => setShowCrewIDCardModal(false)} crewMembers={crewMembers} eventData={selectedEvent}/>}
      {showSingleCrewBarcodeModal && selectedCrewForBarcode && <SingleCrewBarcodeModal isOpen={showSingleCrewBarcodeModal} onClose={() => setShowSingleCrewBarcodeModal(false)} crewMember={selectedCrewForBarcode} />}
      {showEditCrewStatusModal && selectedCrewForStatusEdit && <EditCrewStatusModal isOpen={showEditCrewStatusModal} onClose={() => setShowEditCrewStatusModal(false)} crewMember={selectedCrewForStatusEdit} onUpdateStatus={handleUpdateCrewStatus} />}
      {showScanCrewModal && <ScanCrewAttendanceModal isOpen={showScanCrewModal} onClose={() => setShowScanCrewModal(false)} onProcessScan={handleProcessCrewScan} availableCrewForDemo={crewMembers} scannedCrewInfo={lastScannedCrewInfo} scanStatus={lastScanStatus} />}
      {showAddCrewModal && <AddCrewModal isOpen={showAddCrewModal} onClose={() => setShowAddCrewModal(false)} onSave={handleAddCrew} />}
      {showDeleteCrewModal && crewToDelete && <DeleteCrewModal isOpen={showDeleteCrewModal} onClose={() => setShowDeleteCrewModal(false)} onConfirm={handleConfirmDeleteCrew} crewMemberName={crewToDelete.name} />}
    </div>
  );
};

export default ManajemenCrewPageDB;
