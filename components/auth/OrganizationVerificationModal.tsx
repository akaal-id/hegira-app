
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { X, Briefcase, Lock, Loader2 } from 'lucide-react';
import Logo from '../Logo';

interface OrganizationVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (verificationCode: string) => void;
  contextText?: string; // Optional text to provide context for the verification
}

const OrganizationVerificationModal: React.FC<OrganizationVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerifySuccess,
  contextText = "Verifikasi Organisasi Anda",
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!verificationCode.trim()) {
      setError("Kode verifikasi tidak boleh kosong.");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Simulate success/failure
    if (verificationCode.toUpperCase() === "HEGIRAORG") { // Example success code
      onVerifySuccess(verificationCode);
    } else {
      setError("Kode verifikasi tidak valid atau salah.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[102] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="org-verification-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-md rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal verifikasi organisasi"
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <Logo className="h-10 mx-auto mb-3" />
            <h1 id="org-verification-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">
              {contextText}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Masukkan kode verifikasi yang terkait dengan organisasi Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="orgVerificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Kode Verifikasi Organisasi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="orgVerificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className={`w-full py-2.5 pl-10 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Masukkan kode unik organisasi"
                  disabled={isLoading}
                />
              </div>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold 
                           text-white bg-hegra-yellow hover:bg-yellow-400 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-navy
                           disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 transform hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin mr-2" />
                ) : (
                  <Lock size={16} className="mr-2" />
                )}
                {isLoading ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Belum memiliki kode verifikasi atau butuh bantuan? Hubungi <a href="mailto:support@hegira.com" className="text-hegra-turquoise hover:underline">Dukungan Hegira</a>.
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

export default OrganizationVerificationModal;
