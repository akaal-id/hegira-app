/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { X, User, Edit3, Briefcase, CheckCircle } from 'lucide-react';
import { UserRole, AuthRoleType } from '../HegiraApp';
import Logo from './Logo';

interface RoleSwitchModalProps {
  isOpen: boolean;
  currentUserRole: UserRole;
  onSwitchRole: (newRole: UserRole) => void; // This will now trigger verification in HegiraApp for 'organization'
  onClose: () => void;
}

const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  currentUserRole,
  onSwitchRole,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentUserRole);

  if (!isOpen) return null;

  const allPossibleRoles: { display: AuthRoleType, internal: UserRole, icon: React.ElementType, description: string }[] = [
    { display: "Event Visitor", internal: "visitor", icon: User, description: "Jelajahi dan hadiri berbagai event menarik." },
    { display: "Event Creator", internal: "creator", icon: Edit3, description: "Buat, kelola, dan publikasikan event Anda." },
    { display: "Organization", internal: "organization", icon: Briefcase, description: "Manajemen event untuk tim dan skala besar." },
  ];

  const rolesToDisplay = allPossibleRoles.filter(role => role.internal !== "organization");


  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirmSwitch = () => {
    if (selectedRole) {
      // HegiraApp's onSwitchRole will handle the verification if selectedRole is 'organization'
      onSwitchRole(selectedRole); 
      // The modal will be closed by HegiraApp or by RoleSwitchModal itself after verification starts
    } else {
      onClose(); 
    }
  };
  
  const getRoleDisplayName = (role: UserRole | null): string => {
    if (role === 'visitor') return 'Event Visitor';
    if (role === 'creator') return 'Event Creator';
    if (role === 'organization') return 'Organization';
    return 'Tidak Diketahui';
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="role-switch-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-lg rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal ganti peran"
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <Logo className="h-10 mx-auto mb-3" />
            <h1 id="role-switch-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">Ganti Peran Pengguna</h1>
            <p className="text-xs text-gray-500 mt-1">
              Peran Anda saat ini: <strong className="text-hegra-turquoise">{getRoleDisplayName(currentUserRole)}</strong>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-700 mb-1">Pilih peran baru:</p>
            {rolesToDisplay.map((roleItem) => (
              <button
                key={roleItem.internal}
                onClick={() => handleRoleSelect(roleItem.internal)}
                disabled={currentUserRole === roleItem.internal}
                className={`w-full flex items-center justify-between text-left p-3.5 border rounded-lg transition-all duration-200
                           ${selectedRole === roleItem.internal 
                             ? 'border-hegra-turquoise bg-hegra-turquoise/10 ring-2 ring-hegra-turquoise/70' 
                             : 'border-gray-300 hover:border-hegra-turquoise/50 hover:bg-gray-50'}
                           ${currentUserRole === roleItem.internal 
                             ? 'opacity-70 cursor-not-allowed bg-gray-100' 
                             : 'focus:outline-none focus:ring-2 focus:ring-hegra-yellow focus:ring-offset-1'}`}
                aria-pressed={selectedRole === roleItem.internal}
              >
                <div className="flex items-start">
                  <roleItem.icon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${selectedRole === roleItem.internal || currentUserRole === roleItem.internal ? 'text-hegra-turquoise' : 'text-gray-500'}`} />
                  <div>
                    <span className={`text-sm font-medium ${selectedRole === roleItem.internal || currentUserRole === roleItem.internal ? 'text-hegra-turquoise' : 'text-hegra-navy'}`}>
                      {roleItem.display}
                      {currentUserRole === roleItem.internal && <span className="text-xs text-gray-400 ml-1">(Peran Aktif)</span>}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">{roleItem.description}</p>
                  </div>
                </div>
                {selectedRole === roleItem.internal && currentUserRole !== roleItem.internal && <CheckCircle size={20} className="text-hegra-turquoise flex-shrink-0" />}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={handleConfirmSwitch}
              disabled={!selectedRole || selectedRole === currentUserRole}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-yellow text-hegra-navy text-sm font-bold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} className="mr-1" /> Konfirmasi Ganti Peran
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
            >
              Batal
            </button>
          </div>
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
        .animate-fade-in {
            animation: fadeInAnimation 0.3s ease-out forwards;
        }
        @keyframes fadeInAnimation {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RoleSwitchModal;