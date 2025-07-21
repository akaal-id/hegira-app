/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { Menu, X, UserCircle, PlusCircle, ChevronDown, LogOut, Home, Users, LayoutDashboard } from 'lucide-react'; 
import { PageName, UserRole } from '../HegiraApp'; 

interface NavbarProps {
  onNavigate: (page: PageName, data?: any) => void;
  currentPage: PageName;
  isLoggedIn: boolean;
  userRole: UserRole; 
  userName: string; 
  onLogout: () => void;
  onOpenAuthModal: () => void; 
  onOpenRoleSwitchModal: () => void;
}

export interface UserMenuButtonProps {
  userName: string;
  userRole: UserRole; // Added userRole
  context: 'navbar' | 'dashboard'; // Added context
  onLogout: () => void;
  onNavigate: (page: PageName) => void;
  isMobileContext?: boolean; 
  onCloseMobileMenu?: () => void; 
}

export const UserMenuButton: React.FC<UserMenuButtonProps> = ({ 
  userName, 
  userRole, 
  context, 
  onLogout, 
  onNavigate, 
  isMobileContext = false, 
  onCloseMobileMenu 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handlePrimaryNavClick = () => {
    if (context === 'dashboard') {
      onNavigate('landing'); 
    } else { // context === 'navbar'
      onNavigate('dashboard'); 
    }
    setIsUserMenuOpen(false);
    if (isMobileContext && onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsUserMenuOpen(false);
    if (isMobileContext && onCloseMobileMenu) onCloseMobileMenu();
  };
  
  const buttonBaseClasses = `flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-semibold transition-colors w-full text-left`;
  const userMenuButtonActiveStyles = `bg-hegra-turquoise/10 text-hegra-turquoise border border-hegra-turquoise hover:bg-hegra-turquoise/20`;
  const userMenuButtonInactiveStyles = `text-hegra-deep-navy hover:bg-hegra-turquoise/5`;

  const primaryNavText = context === 'dashboard' ? "Beranda" : "Dashboard";
  const PrimaryNavIcon = context === 'dashboard' ? Home : LayoutDashboard;


  return (
    <div ref={userMenuRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={`${buttonBaseClasses} ${isUserMenuOpen ? userMenuButtonActiveStyles : userMenuButtonInactiveStyles} justify-between sm:justify-start group`}
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
        aria-controls="user-menu"
      >
        <div className="flex items-center gap-2">
          <UserCircle size={20} className={isUserMenuOpen ? "text-hegra-turquoise" : "text-hegra-deep-navy group-hover:text-hegra-turquoise"} />
          <span className={`truncate max-w-[100px] sm:max-w-[120px] ${isUserMenuOpen ? "text-hegra-turquoise" : "text-hegra-deep-navy group-hover:text-hegra-turquoise"}`}>Hi, {userName}!</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''} ${isUserMenuOpen ? "text-hegra-turquoise" : "text-hegra-deep-navy/70 group-hover:text-hegra-turquoise"}`} />
      </button>

      {isUserMenuOpen && (
        <div
          id="user-menu"
          role="menu"
          className={`absolute z-20 mt-1 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                     ${isMobileContext ? 'bottom-full mb-1 right-0 sm:right-auto sm:left-0' : 'top-full right-0'} 
                     animate-fade-in-up-sm`}
        >
          <div className="py-1" role="none">
            <button
              onClick={handlePrimaryNavClick}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-hegra-turquoise/10 hover:text-hegra-turquoise transition-colors"
              role="menuitem"
            >
              <PrimaryNavIcon size={16} /> {primaryNavText}
            </button>
            <button
              onClick={handleLogoutClick}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              role="menuitem"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
       <style>{`
        .animate-fade-in-up-sm {
          animation: fadeInUpSm 0.2s ease-out forwards;
        }
        @keyframes fadeInUpSm {
          from {
            opacity: 0;
            transform: translateY(5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};


const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentPage, 
  isLoggedIn, 
  userRole,
  userName,
  onLogout, 
  onOpenAuthModal,
  onOpenRoleSwitchModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', target: 'landing' as PageName },
    { name: 'Event', target: 'events' as PageName },
    // { name: 'Business Matching', target: 'business' as PageName }, // Removed Business Matching
  ];

  const handleLinkClick = (target: PageName) => {
    onNavigate(target);
    setIsMobileMenuOpen(false); 
  };
  
  const handleAuthButtonClick = () => { 
    onOpenAuthModal();
    setIsMobileMenuOpen(false);
  }

  // This handleBuatEventClick is for the button that changes text based on role (when LOGGED IN)
  const handleRoleSpecificBuatEventClick = () => {
    if (isLoggedIn) {
      onOpenRoleSwitchModal(); 
    } else {
      // This case should ideally not be hit if this button is only shown when logged in.
      // If it were, it might navigate to creatorAuth or open general auth.
      // For now, it's primarily for logged-in users.
      onNavigate('creatorAuth'); 
    }
    setIsMobileMenuOpen(false);
  };

  const navbarBgColor = 'bg-hegra-white'; 
  const navbarBorderColor = 'border-b border-hegra-turquoise/10';
  const logoTextColor = 'text-hegra-turquoise'; 
  
  const mobileIconColor = `text-hegra-deep-navy hover:bg-gray-100`; 
  const mobileMenuBorderColor = 'border-hegra-chino';

  const authButtonStyles = `bg-hegra-turquoise/10 text-hegra-turquoise border border-hegra-turquoise px-5 py-2.5 rounded-full text-sm font-semibold 
                            hover:bg-hegra-turquoise/20 transition-colors flex items-center justify-center gap-2`;
  
  // Styles for the "Buat Event" button when user is NOT logged in
  const createEventNotLoggedInStyles = `bg-hegra-yellow text-hegra-navy border border-hegra-yellow px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 transform hover:scale-105`;
  const createEventNotLoggedInMobileStyles = `w-full text-center bg-hegra-yellow text-hegra-navy border border-hegra-yellow px-5 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2`;


  // Dynamic button text and styles for LOGGED IN users (Visitor/Kreator/Organisasi)
  let dynamicButtonText = "Ganti Peran"; // Default if something is off
  let DynamicButtonIcon = Users;    
  let dynamicButtonStyles = `bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300`; 
  let dynamicButtonAriaLabel = "Ganti Peran Pengguna";
  const baseModeButtonStyles = `px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors`;

  if (isLoggedIn) {
    dynamicButtonAriaLabel = "Ganti Peran Pengguna";
    switch (userRole) {
      case 'visitor':
        dynamicButtonText = "Visitor";
        dynamicButtonStyles = `bg-hegra-turquoise/10 text-hegra-turquoise border border-hegra-turquoise hover:bg-hegra-turquoise/20 ${baseModeButtonStyles}`;
        break;
      case 'creator':
        dynamicButtonText = "Kreator";
        dynamicButtonStyles = `bg-hegra-yellow/10 text-hegra-navy border border-hegra-yellow hover:bg-hegra-yellow/20 ${baseModeButtonStyles}`;
        break;
      case 'organization':
        dynamicButtonText = "Organisasi";
        dynamicButtonStyles = `bg-hegra-chino/10 text-hegra-navy border border-hegra-chino hover:bg-hegra-chino/20 ${baseModeButtonStyles}`;
        break;
      default: 
        dynamicButtonText = "Ganti Peran"; 
        dynamicButtonStyles = `bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 ${baseModeButtonStyles}`; 
        break;
    }
  }


  const desktopNavLinkBaseClasses = "relative px-3 py-2 text-sm transition-colors";
  const mobileNavLinkBaseClasses = "block w-full text-left px-4 py-3 text-base transition-colors";


  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out 
                     ${navbarBgColor} ${navbarBorderColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('landing')} aria-label="Hegira Beranda" className="focus:outline-none">
              <Logo 
                className={`font-bold italic text-2xl h-9 sm:h-10 w-auto transition-colors duration-300 ${logoTextColor}`} 
                useGradient={false} 
              />
            </button>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleLinkClick(item.target)}
                className={`${desktopNavLinkBaseClasses} ${
                  (currentPage === item.target)
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full'
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise'
                }`}
                aria-current={(currentPage === item.target) ? 'page' : undefined}
                aria-label={item.name}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
             {isLoggedIn ? ( 
                <>
                  <button
                      onClick={handleRoleSpecificBuatEventClick}
                      className={dynamicButtonStyles}
                      aria-label={dynamicButtonAriaLabel}
                  >
                      <DynamicButtonIcon size={18} /> {dynamicButtonText}
                  </button>
                  <UserMenuButton 
                    userName={userName} 
                    userRole={userRole}
                    context="navbar"
                    onLogout={onLogout} 
                    onNavigate={onNavigate} 
                  />
                </>
             ) : (
                <>
                  <button
                      onClick={() => {
                          onNavigate('createEventInfo');
                      }}
                      className={createEventNotLoggedInStyles}
                      aria-label="Buat Event"
                  >
                      <PlusCircle size={18} /> Buat Event
                  </button>
                  <button
                      onClick={handleAuthButtonClick} 
                      className={authButtonStyles}
                      aria-label="Masuk atau Daftar" 
                  >
                      <UserCircle size={18} className="text-hegra-turquoise" /> Masuk / Daftar
                  </button>
                </>
             )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors
                          ${mobileIconColor}`}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {isMobileMenuOpen ? <X className="block h-7 w-7" /> : <Menu className="block h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-0 inset-x-0 min-h-screen ${navbarBgColor}/95 backdrop-blur-lg p-4 pt-20 space-y-2 sm:px-6 z-[-1] flex flex-col animate-fade-in`} id="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLinkClick(item.target)}
              className={`${mobileNavLinkBaseClasses} ${
                  (currentPage === item.target)
                    ? 'font-semibold text-hegra-turquoise bg-hegra-turquoise/10 rounded-full'
                    : 'font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise'
                }`}
              aria-current={(currentPage === item.target) ? 'page' : undefined}
            >
              {item.name}
            </button>
          ))}
          {isLoggedIn && ( /* This is the dynamic role button for mobile when logged in */
            <button 
                onClick={handleRoleSpecificBuatEventClick}
                className={`${mobileNavLinkBaseClasses} font-medium text-hegra-deep-navy hover:font-semibold hover:text-hegra-turquoise flex items-center gap-2`}
                aria-label={dynamicButtonAriaLabel}
            >
                <DynamicButtonIcon size={18} /> {dynamicButtonText}
            </button>
          )}
          <div className={`pt-4 pb-3 border-t ${mobileMenuBorderColor} space-y-4`}>
            {isLoggedIn ? (
               <UserMenuButton 
                userName={userName} 
                userRole={userRole}
                context="navbar"
                onLogout={onLogout} 
                onNavigate={onNavigate} 
                isMobileContext={true} 
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              />
            ) : (
              <>
                <button
                    onClick={() => {
                        onNavigate('createEventInfo');
                        setIsMobileMenuOpen(false);
                    }}
                    className={createEventNotLoggedInMobileStyles}
                    aria-label="Buat Event"
                >
                    <PlusCircle size={18} /> Buat Event
                </button>
                <button
                  onClick={handleAuthButtonClick} 
                  className={`w-full text-center ${authButtonStyles} py-3`}
                  aria-label="Masuk atau Daftar" 
                >
                  <UserCircle size={18} className="text-hegra-turquoise" /> Masuk / Daftar
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in {
            animation: fadeInAnimation 0.3s ease-out forwards;
        }
        @keyframes fadeInAnimation {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
