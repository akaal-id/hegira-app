
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from '../Logo';
import { AuthRoleType } from '../../HegiraApp';
import { X, User, Edit3, Briefcase, ExternalLink } from 'lucide-react'; // Added ExternalLink

interface AuthSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: AuthRoleType) => void; 
}

const AuthSelectionModal: React.FC<AuthSelectionModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  if (!isOpen) return null;

  const allRoles: { type: AuthRoleType; label: string; icon: React.ElementType }[] = [
    { type: "Event Visitor", label: "Masuk sebagai Visitor", icon: User },
    // "Event Creator" button removed
    { type: "Organization", label: "Masuk sebagai Organisasi", icon: Briefcase },
  ];

  // Filter out the "Organization" role
  const roles = allRoles.filter(role => role.type !== "Organization");


  const handleCreatorDashboardLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSelectRole("Event Creator"); // This will trigger navigation to CreatorAuthPage in HegiraApp
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="auth-selection-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-md rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal pilihan masuk"
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <Logo className="text-3xl sm:text-4xl text-hegra-turquoise font-bold mb-2" />
            <h1 id="auth-selection-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">Selamat Datang di Hegira!</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Pilih cara Anda untuk masuk atau mendaftar.</p>
          </div>

          <div className="space-y-4">
            {roles.map((roleItem) => (
              <button
                key={roleItem.type}
                onClick={() => onSelectRole(roleItem.type)}
                className="w-full flex items-center justify-start text-left py-3 sm:py-3.5 px-4 sm:px-5 border border-gray-300 rounded-lg shadow-sm 
                           hover:border-hegra-turquoise hover:bg-hegra-turquoise/5 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-hegra-yellow focus:ring-offset-2"
              >
                <roleItem.icon className="h-5 w-5 sm:h-6 sm:w-6 text-hegra-turquoise mr-3 sm:mr-4 flex-shrink-0" />
                <div>
                    <span className="text-sm sm:text-base font-medium text-hegra-navy">{roleItem.label}</span>
                    <p className="text-xs text-gray-500 hidden sm:block">
                        {roleItem.type === "Event Visitor" && "Jelajahi dan hadiri berbagai event menarik."}
                        {roleItem.type === "Organization" && "Manajemen event untuk tim dan organisasi besar."}
                    </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Anda Event Creator?{' '}
              <a 
                href="#" 
                onClick={handleCreatorDashboardLink}
                className="text-hegra-yellow hover:text-yellow-400 font-semibold transition-colors inline-flex items-center"
              >
                Buka Dashboard-mu di sini <ExternalLink size={12} className="ml-1 opacity-70"/>
              </a>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Dengan melanjutkan, Anda menyetujui <a href="#" className="underline hover:text-hegra-turquoise">Syarat & Ketentuan</a> kami.
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

export default AuthSelectionModal;
