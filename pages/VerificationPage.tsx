/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from '../components/Logo';
import { MailCheck, X } from 'lucide-react';

interface VerificationPageProps {
  onClose: () => void;
  onOpenLoginModal: () => void;
  email?: string; 
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onClose, onOpenLoginModal, email }) => {
  const userEmail = email || "emailanda@example.com";

  const handleReturnToLogin = () => {
    onClose(); 
    onOpenLoginModal(); 
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="verification-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-md rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
            aria-label="Tutup modal verifikasi"
        >
            <X size={24} />
        </button>
        
        <div className="p-6 sm:p-8 text-center">
            <div className="mb-6">
                <Logo className="text-3xl sm:text-4xl text-hegra-turquoise font-bold mb-3" />
                <MailCheck size={56} className="mx-auto text-hegra-turquoise mb-3" />
                <h1 id="verification-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-2">Periksa Email Anda</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                    Kami telah mengirimkan link verifikasi ke alamat email Anda. 
                    Silakan klik link tersebut untuk mengaktifkan akun Hegra Anda.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    (Email dikirim ke: <strong className="text-hegra-navy/90">{userEmail}</strong>)
                </p>
            </div>
            
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Tidak menerima email? Periksa folder spam/junk Anda atau coba kirim ulang setelah beberapa saat.
                </p>
                <button
                    // onClick={handleResendOTP} // Placeholder for resend logic
                    // disabled={isResending || cooldown > 0}
                    className="w-full mb-3 py-2.5 px-4 border border-hegra-turquoise text-hegra-turquoise rounded-lg text-xs sm:text-sm font-medium
                               hover:bg-hegra-turquoise/10 transition-colors disabled:opacity-50"
                >
                    Kirim Ulang Email Verifikasi (Fitur Segera Hadir)
                    {/* {isResending ? 'Mengirim...' : (cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : 'Kirim Ulang Email Verifikasi')} */}
                </button>
                <button
                    onClick={handleReturnToLogin}
                    className="text-xs text-hegra-turquoise hover:text-hegra-turquoise/80"
                >
                    Kembali ke Login
                </button>
            </div>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VerificationPage;