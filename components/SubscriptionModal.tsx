/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, Star, Briefcase, CheckCircle } from 'lucide-react';
import Logo from './Logo';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  const benefits = [
    "Akses jaringan profesional yang lebih luas.",
    "Temukan vendor dan supplier terpercaya.",
    "Terhubung dengan investor potensial.",
    "Peluang kolaborasi bisnis tak terbatas.",
    "Dukungan prioritas dari tim Hegira."
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="subscription-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-gradient-to-br from-hegra-navy via-hegra-navy to-hegra-turquoise/80 text-hegra-white w-full max-w-lg rounded-2xl shadow-2xl border border-hegra-yellow/30 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-hegra-yellow/70 hover:text-hegra-yellow transition-colors z-20"
          aria-label="Tutup modal berlangganan"
        >
          <X size={26} />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <Briefcase size={48} className="mx-auto mb-4 text-hegra-yellow" />
            <h1 id="subscription-modal-title" className="text-2xl sm:text-3xl font-bold text-white">
              Akses Eksklusif <span className="text-hegra-yellow">Business Matching</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 mt-3">
              Untuk mengakses fitur Business Matching dan terhubung dengan ribuan peluang bisnis, Anda perlu berlangganan layanan premium Hegira.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-hegra-yellow mb-2 text-center sm:text-left">Keuntungan Berlangganan:</h2>
            <ul className="space-y-2 text-sm">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={18} className="text-hegra-yellow mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            {/* Button Container with overflow-hidden for ribbon effect */}
            <div className="relative w-full rounded-lg overflow-hidden"> 
                <button
                onClick={onSubscribe} // This will effectively call onClose as per HegiraApp setup
                type="button"
                disabled // Button remains disabled
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold
                            bg-hegra-yellow text-hegra-navy hover:bg-opacity-90 
                            focus:outline-none focus:ring-2 focus:ring-hegra-navy focus:ring-offset-hegra-navy
                            transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed" 
                aria-label="Subscribe Sekarang (Segera Hadir)"
                >
                <Star size={20} className="mr-2" /> Subscribe Sekarang
                </button>
                {/* New Ribbon Style */}
                <div 
                  className="absolute top-3 right-[-35px] transform rotate-45 
                             bg-red-600 text-white text-[10px] font-semibold 
                             py-1 px-10 text-center shadow-lg z-10 whitespace-nowrap"
                  style={{ width: '160px' }} // Adjusted width for better appearance
                >
                  COMING SOON
                </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 border border-hegra-yellow/50 rounded-lg shadow-sm text-base font-medium
                         text-hegra-yellow hover:bg-hegra-yellow/10
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-hegra-navy focus:ring-white
                         transition-colors"
            >
              Batal
            </button>
          </div>
          <p className="text-xs text-white/60 mt-6 text-center">
            Dengan berlangganan, Anda menyetujui Syarat & Ketentuan Layanan Premium Hegira.
          </p>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        @keyframes modalAppear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionModal;