/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, CheckCircle, XCircle, Loader2, ScanLine as ScanIcon, User, Ticket, CalendarDays, AlertTriangle } from 'lucide-react';
import { CrewMember } from '../../../pages/dashboard/ManajemenCrewPageDB'; 
import { ScanStatus } from '../../../pages/dashboard/PengunjungDB';

interface ScanCrewAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessScan: (scannedId: string) => void;
  availableCrewForDemo: CrewMember[]; 
  scannedCrewInfo: CrewMember | null;
  scanStatus: ScanStatus;
}

const ScanCrewAttendanceModal: React.FC<ScanCrewAttendanceModalProps> = ({ 
  isOpen, 
  onClose, 
  onProcessScan,
  availableCrewForDemo,
  scannedCrewInfo,
  scanStatus
}) => {
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const scanTimeoutRef = useRef<number | null>(null);
  const [cameraAccess, setCameraAccess] = useState<'IDLE' | 'PROMPT' | 'REQUESTING' | 'GRANTED' | 'DENIED' | 'ERROR'>('IDLE');
  const streamRef = useRef<MediaStream | null>(null);

  const [manualCrewId, setManualCrewId] = useState('');

  const [currentScanStatus, setCurrentScanStatus] = useState<ScanStatus>(scanStatus);
  const [currentScannedCrew, setCurrentScannedCrew] = useState<CrewMember | null>(scannedCrewInfo);

  useEffect(() => {
    setCurrentScanStatus(scanStatus);
  }, [scanStatus]);

  useEffect(() => {
    setCurrentScannedCrew(scannedCrewInfo);
  }, [scannedCrewInfo]);


  useEffect(() => {
    if (isOpen) {
      setCurrentScanStatus('IDLE'); 
      setCurrentScannedCrew(null);
      setCameraAccess('PROMPT');
      setIsSimulatingScan(false);
      setManualCrewId('');
    } else { 
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      setIsSimulatingScan(false);
      if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
      setCameraAccess('IDLE');
    }
    return () => { 
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    };
  }, [isOpen]); 

  const handleActivateCamera = async () => {
    if (isSimulatingScan || cameraAccess === 'REQUESTING') return;
  
    setCameraAccess('REQUESTING');
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAccess('GRANTED');
      
      setIsSimulatingScan(true);

      let idToScan = `DEMO-CRW-${Date.now().toString().slice(-4)}`;
      if (availableCrewForDemo && availableCrewForDemo.length > 0) {
          const rand = Math.random();
          if (rand < 0.65) { 
              const belumHadir = availableCrewForDemo.filter(a => a.status === 'Belum Hadir');
              if (Math.random() < 0.85 && belumHadir.length > 0) {
                   idToScan = belumHadir[Math.floor(Math.random() * belumHadir.length)].id;
              } else {
                   const randomIndex = Math.floor(Math.random() * availableCrewForDemo.length);
                   idToScan = availableCrewForDemo[randomIndex].id;
              }
          } else if (rand < 0.85) { 
              const sudahHadir = availableCrewForDemo.filter(a => a.status === 'Hadir');
              if (sudahHadir.length > 0) {
                  idToScan = sudahHadir[Math.floor(Math.random() * sudahHadir.length)].id;
              }
          }
      }
      
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = window.setTimeout(() => {
        onProcessScan(idToScan);
        setIsSimulatingScan(false);
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }, 2000);

    } catch (err: any) {
      console.error("Camera access denied or error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'NotFoundError') {
        setCameraAccess('DENIED');
      } else {
        setCameraAccess('ERROR');
      }
      setIsSimulatingScan(false);
    }
  };

  const handleRescan = () => {
    if (isSimulatingScan || cameraAccess === 'REQUESTING') return;
    setCurrentScanStatus('IDLE'); 
    setCurrentScannedCrew(null);
    setManualCrewId('');
    handleActivateCamera();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCrewId.trim()) {
      onProcessScan(manualCrewId.trim().toUpperCase());
      setManualCrewId('');
    }
  };


  const renderCameraAreaContent = () => {
    switch (cameraAccess) {
      case 'PROMPT':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-gray-800/80">
            <ScanIcon size={32} className="mb-2 text-hegra-turquoise" />
            <p className="text-sm text-center mb-4">Akses kamera diperlukan untuk memindai ID crew.</p>
            <button
                onClick={handleActivateCamera}
                className="bg-hegra-turquoise hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
                Aktifkan Kamera
            </button>
          </div>
        );
      case 'REQUESTING': return <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400"><Loader2 size={32} className="animate-spin mb-2" /><p className="text-sm">Meminta izin kamera...</p></div>;
      case 'DENIED':
      case 'ERROR': return <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500 p-4">{cameraAccess === 'DENIED' ? <AlertTriangle size={32} className="mb-2" /> : <XCircle size={32} className="mb-2" />}<p className="text-sm text-center text-white">{cameraAccess === 'DENIED' ? 'Izin kamera ditolak.' : 'Kamera tidak tersedia.'}</p><p className="text-xs text-center mt-1 text-gray-300">Anda dapat memasukkan ID crew secara manual.</p></div>;
      case 'GRANTED': return <><div className="absolute inset-0 flex items-center justify-center"><p className="text-gray-500 text-sm z-0">{isSimulatingScan ? 'Arahkan ke Barcode ID Crew' : 'Kamera Siap'}</p></div>{isSimulatingScan && <div className="scan-line z-20"></div>}</>;
      default: return <div className="absolute inset-0 flex items-center justify-center text-gray-500"><p className="text-sm">Area Kamera</p></div>;
    }
  };

  const showScanResultUI = !isSimulatingScan && cameraAccess === 'GRANTED' && (currentScanStatus === 'SUCCESS' || currentScanStatus === 'ALREADY_SCANNED' || currentScanStatus === 'NOT_FOUND');

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" aria-labelledby="scan-crew-modal-title" role="dialog" aria-modal="true">
      <div className="bg-white text-hegra-navy p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h2 id="scan-crew-modal-title" className="text-lg font-semibold text-hegra-navy flex items-center"><ScanIcon size={20} className="mr-2 text-hegra-turquoise" /> Pindai Kehadiran Crew</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hegra-turquoise transition-colors" aria-label="Tutup modal"><X size={24} /></button>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-64 h-64 sm:w-72 sm:h-72 bg-gray-800 rounded-lg overflow-hidden relative border-4 border-gray-700 shadow-inner mb-4">{renderCameraAreaContent()}</div>
          
          {(cameraAccess === 'DENIED' || cameraAccess === 'ERROR') && (
            <form onSubmit={handleManualSubmit} className="w-full max-w-xs mt-4 animate-fade-in-up-sm">
                <label htmlFor="manual-crew-id" className="text-sm font-medium text-gray-600">ID Crew Manual</label>
                <div className="flex gap-2 mt-1">
                    <input
                        id="manual-crew-id"
                        type="text"
                        value={manualCrewId}
                        onChange={(e) => setManualCrewId(e.target.value.toUpperCase())}
                        className="flex-grow w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise"
                        placeholder="Masukkan ID CRW-..."
                    />
                    <button type="submit" className="bg-hegra-navy text-white font-semibold px-4 rounded-md hover:bg-opacity-90">Kirim</button>
                </div>
            </form>
          )}

          <div className="h-28 text-center flex flex-col justify-center items-center w-full px-2">
            {isSimulatingScan && cameraAccess === 'GRANTED' && (<div className="flex flex-col items-center text-hegra-turquoise"><Loader2 size={32} className="animate-spin mb-2" /><p className="text-sm font-medium">Memindai ID Crew...</p></div>)}
            {showScanResultUI && currentScanStatus === 'SUCCESS' && currentScannedCrew && (
              <div className="flex flex-col items-center text-green-600 animate-fade-in-up-sm">
                <CheckCircle size={36} className="mb-2" /><p className="text-md font-bold">CREW HADIR</p>
                <p className="text-sm mt-1"><User size={14} className="inline mr-1" /> {currentScannedCrew.name}</p>
                <p className="text-xs text-gray-600"><Ticket size={13} className="inline mr-1" /> Role: {currentScannedCrew.role}</p>
                <p className="text-xs text-gray-500"><CalendarDays size={13} className="inline mr-1" /> Event: {currentScannedCrew.eventName}</p>
              </div>
            )}
            {showScanResultUI && currentScanStatus === 'ALREADY_SCANNED' && currentScannedCrew && (
              <div className="flex flex-col items-center text-yellow-600 animate-fade-in-up-sm">
                <AlertTriangle size={36} className="mb-2" /><p className="text-md font-bold">CREW SUDAH SCAN</p>
                <p className="text-sm mt-1"><User size={14} className="inline mr-1" /> {currentScannedCrew.name}</p>
                <p className="text-xs text-gray-600">Telah discan pada: {currentScannedCrew.scanTimestamp ? new Date(currentScannedCrew.scanTimestamp).toLocaleString('id-ID',{hour:'2-digit',minute:'2-digit'}) : 'N/A'}</p>
              </div>
            )}
            {showScanResultUI && currentScanStatus === 'NOT_FOUND' && (
              <div className="flex flex-col items-center text-red-600 animate-fade-in-up-sm">
                <XCircle size={36} className="mb-2" /><p className="text-md font-bold">ID CREW TIDAK VALID</p>
                <p className="text-xs text-gray-600">ID ini tidak terdaftar untuk event ini.</p>
              </div>
            )}
            {!isSimulatingScan && (cameraAccess === 'IDLE' && currentScanStatus === 'IDLE') && (<p className="text-sm text-gray-500">Arahkan kamera ke barcode ID crew.</p>)}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
           <button onClick={handleRescan} disabled={isSimulatingScan || cameraAccess === 'REQUESTING' || cameraAccess === 'PROMPT'} className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 border border-hegra-turquoise shadow-sm text-sm font-medium rounded-lg text-hegra-turquoise bg-white hover:bg-hegra-turquoise/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors disabled:opacity-60"><RefreshCw size={16} /> Scan Ulang</button>
          <button onClick={onClose} className="w-full sm:w-auto justify-center inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors">Tutup</button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; } @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .scan-line { position: absolute; left: 0; top: 0; width: 100%; height: 3px; background: linear-gradient(to right, transparent, rgba(75, 153, 142, 0.8), transparent); box-shadow: 0 0 10px rgba(75, 153, 142, 0.7); animation: scan-animation 2s infinite linear; }
        @keyframes scan-animation { 0% { top: 0%; } 50% { top: 99%; } 100% { top: 0%; } }
        .animate-fade-in-up-sm { animation: fadeInUpShort 0.3s ease-out forwards; } @keyframes fadeInUpShort { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ScanCrewAttendanceModal;
