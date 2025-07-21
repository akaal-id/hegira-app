/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { TransactionData, PageName } from '../HegiraApp'; // Renamed import
import PrintableTicket from '../components/PrintableTicket'; // New import
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TicketDisplayPageProps {
  transactionData: TransactionData;
  onNavigate: (page: PageName, data?: any) => void;
}

const TicketDisplayPage: React.FC<TicketDisplayPageProps> = ({ transactionData, onNavigate }) => {
  const { checkoutInfo, formData, orderId, transactionId } = transactionData; // Added transactionId
  const { event } = checkoutInfo;

  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadAllTickets = async () => {
    setIsLoading(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const ticketElements = document.querySelectorAll('.printable-ticket-a4');
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    for (let i = 0; i < ticketElements.length; i++) {
      const ticketElement = ticketElements[i] as HTMLElement;
      
      ticketElement.style.display = 'block';
      ticketElement.style.opacity = '1';

      try {
        const canvas = await html2canvas(ticketElement, {
          scale: 2, 
          useCORS: true,
          logging: false, 
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.92); // Use JPEG with higher quality for A4

        const imgProps = pdf.getImageProperties(imgData);
        const aspectRatio = imgProps.width / imgProps.height;
        
        let imgWidth = pdfWidth; 
        let imgHeight = imgWidth / aspectRatio;

        // If calculated height exceeds A4 height, then scale by height
        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight;
          imgWidth = imgHeight * aspectRatio;
        }
        
        // Center the image on the page if it's smaller than A4
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;


        if (i > 0) {
          pdf.addPage();
        }
        // Add image to fill the page, or centered if smaller
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);

      } catch (error) {
        console.error("Error capturing ticket element:", error);
        if (i > 0) pdf.addPage();
        pdf.text("Error rendering ticket.", 10, 10);
      }
       ticketElement.style.display = '';
       ticketElement.style.opacity = '';
    }
    
    pdf.save(`Hegira_E-Tiket_${orderId}.pdf`);
    setIsLoading(false);
  };
  
  const totalTicketsPurchased = formData.additionalTicketHolders?.length || 0;

  return (
    <div className="bg-gradient-to-br from-hegra-navy to-hegra-turquoise min-h-screen py-8 md:py-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12">
            <button
                onClick={() => onNavigate('transactionSuccess')}
                className="flex items-center text-sm text-hegra-yellow hover:text-opacity-80 font-semibold transition-colors group mb-4 sm:mb-0 self-start sm:self-center"
            >
                <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Kembali ke Detail Transaksi
            </button>
            <button
                onClick={handleDownloadAllTickets}
                disabled={isLoading || totalTicketsPurchased === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-hegra-yellow text-hegra-navy font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed self-end sm:self-center"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                {isLoading ? 'Memproses PDF...' : 'Unduh Semua Tiket (PDF)'}
            </button>
        </div>
        
        {totalTicketsPurchased === 0 && 
            <p className="text-xs text-yellow-300 text-center -mt-4 mb-6">Tidak ada tiket untuk diunduh.</p>
        }


        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-jakarta font-bold opacity-95">E-Tiket Anda</h1>
          <p className="mt-2 text-base opacity-80">Berikut adalah tiket Anda. Simpan dengan baik dan tunjukkan di pintu masuk.</p>
        </header>


        {totalTicketsPurchased > 0 && formData.additionalTicketHolders ? (
          <div className="space-y-8">
            {formData.additionalTicketHolders.map((holder, index) => {
              const ticketNumber = `HGR-${orderId.split('-')[1]}-${String(index + 1).padStart(3, '0')}`;
              
              let categoryName = "Tiket"; 
              const selectedTicketInfo = checkoutInfo.selectedTickets[index % checkoutInfo.selectedTickets.length];
              if (selectedTicketInfo) {
                categoryName = selectedTicketInfo.categoryName;
              } else if (event.ticketCategories.length > 0) {
                 categoryName = event.ticketCategories[0].name; 
              }

              return (
                <div key={`ticket-container-${index}`} className="bg-white rounded-lg shadow-2xl overflow-hidden">
                    <PrintableTicket
                    key={`ticket-component-${index}`}
                    ticketNumber={ticketNumber}
                    categoryName={categoryName}
                    holderName={holder.fullName}
                    holderWhatsApp={holder.whatsAppNumber} 
                    event={event}
                    orderId={orderId}
                    transactionId={transactionId}
                    qrCodeValue={`${ticketNumber} | ${event.name} | ${holder.fullName}`}
                    bookerData={formData}
                    />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl border border-white/20 text-center">
            <p className="text-lg opacity-90">Tidak ada tiket yang diterbitkan untuk transaksi ini.</p>
          </div>
        )}
         <p className="text-xs text-center opacity-70 mt-12">
            Pastikan untuk menyimpan tiket ini dengan baik. Hegira tidak bertanggung jawab atas kehilangan atau penyalahgunaan tiket.
          </p>
      </div>
    </div>
  );
};

export default TicketDisplayPage;