/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { X, QrCode, Users, Download, Loader2 } from 'lucide-react'; // Added Download, Loader2
import { CrewMember } from '../../../pages/dashboard/ManajemenCrewPageDB';
import { EventData } from '../../../HegiraApp';
import Logo from '../../Logo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CrewIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  crewMembers: CrewMember[];
  eventData: EventData;
}

const IDCard: React.FC<{ crew: CrewMember; event: EventData }> = ({ crew, event }) => {
  const logoText = event.name.substring(0, 2).toUpperCase() || "EV";
  const eventLogoSrc = event.posterUrl || event.coverImageUrl;

  return (
    <div 
      className="crew-id-card-render bg-white text-black rounded-lg shadow-md overflow-hidden relative flex flex-col justify-between"
      style={{
        width: `53.98mm`, // CR80 Portrait width
        height: `85.6mm`, // CR80 Portrait height
        minWidth: '53.98mm',
        minHeight: '85.6mm',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        border: '0.5px solid #E2E8F0' 
      }}
    >
      {/* Slot Punch */}
      <div className="absolute top-[2mm] left-1/2 -translate-x-1/2 w-[12mm] h-[2.5mm] bg-gray-300 rounded-sm"></div>

      {/* Event Logo */}
      <div className="flex justify-center items-center pt-[8mm] pb-[3mm]"> {/* Adjusted padding for portrait if needed */}
        <div 
            className="w-[18mm] h-[18mm] rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-gray-100"
        >
          {eventLogoSrc ? (
            <img src={eventLogoSrc} alt="Event Logo" className="w-full h-full object-cover" 
                 onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none'; 
                    const parent = target.parentElement;
                    if (parent) {
                        if (!parent.querySelector('.logo-placeholder-text')) {
                            const placeholder = document.createElement('span');
                            placeholder.className = 'text-white text-xs font-semibold logo-placeholder-text';
                            placeholder.innerText = logoText;
                            parent.appendChild(placeholder);
                        }
                    }
                 }} />
          ) : (
            <span className="text-white text-xs font-semibold logo-placeholder-text">{logoText}</span>
          )}
        </div>
      </div>

      {/* QR Code */}
      <div className="flex-grow flex justify-center items-center my-[1mm]">
        <div className="bg-white p-0.5 rounded-sm"> {/* Added padding around QR if needed */}
          <QrCode size={100} strokeWidth={1.25} className="text-black" /> {/* Adjusted QR size for portrait */}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-black text-white text-center px-[2mm] py-[1.5mm]">
        <p className="text-[10pt] font-bold leading-tight truncate" title={crew.name}>{crew.name.toUpperCase()}</p>
        <p className="text-[8pt] leading-tight truncate opacity-80" title={crew.role}>{crew.role.toUpperCase()}</p>
      </div>
    </div>
  );
};

const CrewIDCardModal: React.FC<CrewIDCardModalProps> = ({ isOpen, onClose, crewMembers, eventData }) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (crewMembers.length === 0) {
      alert("Tidak ada ID Card untuk diunduh.");
      return;
    }
    setIsDownloadingPdf(true);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const cardElements = document.querySelectorAll('.crew-id-card-render');

    const cardWidthMM = 53.98;
    const cardHeightMM = 85.6;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const cardsPerRow = 3;
    const cardsPerCol = 3; // Max 3 rows to fit on A4 portrait
    const cardsPerPage = cardsPerRow * cardsPerCol;

    const horizontalMargin = (pdfWidth - (cardsPerRow * cardWidthMM)) / (cardsPerRow + 1);
    const verticalMargin = (pdfHeight - (cardsPerCol * cardHeightMM)) / (cardsPerCol + 1);

    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i] as HTMLElement;
      
      if (i > 0 && i % cardsPerPage === 0) {
        pdf.addPage();
      }

      const cardIndexOnPage = i % cardsPerPage;
      const col = cardIndexOnPage % cardsPerRow;
      const row = Math.floor(cardIndexOnPage / cardsPerRow);

      const x = horizontalMargin + col * (cardWidthMM + horizontalMargin);
      const y = verticalMargin + row * (cardHeightMM + verticalMargin);
      
      try {
        const canvas = await html2canvas(cardElement, {
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff', // Ensure canvas background is white for JPEG
        });
        // Use JPEG with quality 0.7 for smaller file size per image
        const imgData = canvas.toDataURL('image/jpeg', 0.7); 
        pdf.addImage(imgData, 'JPEG', x, y, cardWidthMM, cardHeightMM);
      } catch (error) {
        console.error("Error capturing card element for PDF:", error);
        pdf.text(`Error rendering card ${i + 1}`, x + 5, y + 10);
      }
    }

    pdf.save(`Hegira_Crew_ID_Cards_${eventData.name.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    setIsDownloadingPdf(false);
  };

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      aria-labelledby="crew-id-card-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-4xl relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h2 id="crew-id-card-modal-title" className="text-lg font-semibold text-hegra-deep-navy flex items-center">
            <QrCode size={20} className="mr-2 text-hegra-turquoise" /> Kartu ID Crew - Event: {eventData.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hegra-turquoise transition-colors" aria-label="Tutup modal">
            <X size={24} />
          </button>
        </div>

        {crewMembers.length > 0 ? (
          <div className="flex-grow overflow-y-auto space-y-4 p-2 custom-scrollbar-modal-outer flex flex-col items-center">
            {crewMembers.map(crew => (
              <IDCard key={crew.id} crew={crew} event={eventData} />
            ))}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <Users size={40} className="mb-2"/>
            <p>Tidak ada data crew untuk event ini.</p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf || crewMembers.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-60"
          >
            {isDownloadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isDownloadingPdf ? 'Memproses PDF...' : 'Unduh PDF'}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal-outer::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar-modal-outer::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar-modal-outer::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal-outer::-webkit-scrollbar-thumb:hover { background: #b8b495; }
      `}</style>
    </div>
  );
};

export default CrewIDCardModal;
