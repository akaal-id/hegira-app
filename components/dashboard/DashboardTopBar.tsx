
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Menu, Users as UsersIcon, Home, ChevronRight, Info, Ticket, ShoppingCart, ClipboardList, UserCircle as UserCircleIcon, Edit3, ArrowLeft, Briefcase } from 'lucide-react'; 
import { PageName, EventData, UserRole } from '../../HegiraApp'; 
import { CombinedDashboardViewId } from './DashboardLayout'; 
import { UserMenuButton } from '../Navbar'; 

interface DashboardTopBarProps {
  currentViewLabel: string;
  onNavigate: (page: PageName, data?: any) => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void; 
  userName: string; 
  userRole: UserRole; 
  onOpenRoleSwitchModal: () => void; 
  activeViewId: CombinedDashboardViewId; 
  onSelectView: (viewId: CombinedDashboardViewId, data?: any) => void; 
  contextEvent?: EventData | null; 
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  currentViewLabel, 
  onNavigate,
  onLogout,
  onToggleMobileSidebar,
  userName, 
  userRole, 
  onOpenRoleSwitchModal, 
  activeViewId,
  onSelectView, 
  contextEvent, 
}) => {

  const breadcrumbSegments: Array<{label: string; viewId?: CombinedDashboardViewId; data?: any; isCurrent: boolean;}> = [];
  const isCreator = userRole === 'creator'; // Organization dashboard is separate
  const rootDashboardViewId: CombinedDashboardViewId = isCreator ? 'daftarEvent' : (userRole === 'organization' ? 'companyProfileBM' : 'savedEvents');


  breadcrumbSegments.push({
    label: "Dashboard",
    viewId: rootDashboardViewId, 
    isCurrent: activeViewId === rootDashboardViewId && !contextEvent,
  });

  if (contextEvent && isCreator) { 
    breadcrumbSegments[0].isCurrent = false; 
    breadcrumbSegments.push({
      label: `${contextEvent.name.substring(0, 20)}...`,
      viewId: 'detailEventView', 
      data: contextEvent,
      isCurrent: activeViewId === 'detailEventView',
    });

    if (activeViewId !== 'detailEventView') {
      breadcrumbSegments[breadcrumbSegments.length-1].isCurrent = false; 
      let specificViewLabel = currentViewLabel; 
      const contextualItems = [
          { id: 'detailEventView', label: 'Detail Event' },
          { id: 'ticketsCoupons', label: 'Tiket & Kupon' },
          { id: 'pesanan', label: 'Pesanan' },
          { id: 'pengunjung', label: 'Pengunjung' },
          { id: 'manajemenCrew', label: 'Manajemen Crew' },
          { id: 'editEventView', label: `Edit: ${contextEvent.name.substring(0,15)}...`},
      ];
      const item = contextualItems.find(i => i.id === activeViewId);
      if(item) specificViewLabel = item.label;

      breadcrumbSegments.push({ label: specificViewLabel, viewId: activeViewId, data: contextEvent, isCurrent: true });
    }
  } else if (activeViewId !== rootDashboardViewId) { 
    breadcrumbSegments[0].isCurrent = false;
    if (activeViewId === 'createEventView' && isCreator) {
        breadcrumbSegments.push({ label: "Daftar Event", viewId: 'daftarEvent', isCurrent: false });
        breadcrumbSegments.push({ label: "Buat Event Baru", viewId: 'createEventView', isCurrent: true });
    } else if (activeViewId === 'accountInfo') { // General for all dashboard types
        breadcrumbSegments.push({ label: "Informasi Akun", viewId: 'accountInfo', isCurrent: true });
    } else { 
        breadcrumbSegments.push({ label: currentViewLabel, viewId: activeViewId, isCurrent: true });
    }
  }


  const getRoleButtonText = () => {
    switch (userRole) {
      case 'visitor': return "Visitor";
      case 'creator': return "Kreator";
      case 'organization': return "Organisasi";
      default: return "Ganti Peran"; 
    }
  };
  
  const roleButtonText = getRoleButtonText();
  const RoleButtonIcon = UsersIcon; 

  let dynamicRoleButtonStyles = ``;
  const baseDashboardButtonStyles = `px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors transform hover:scale-105`;

  switch (userRole) {
    case 'visitor':
      dynamicRoleButtonStyles = `bg-hegra-turquoise/10 text-hegra-turquoise border border-hegra-turquoise hover:bg-hegra-turquoise/20 ${baseDashboardButtonStyles}`;
      break;
    case 'creator':
      dynamicRoleButtonStyles = `bg-hegra-yellow/10 text-hegra-navy border border-hegra-yellow hover:bg-hegra-yellow/20 ${baseDashboardButtonStyles}`;
      break;
    case 'organization':
      dynamicRoleButtonStyles = `bg-hegra-chino/10 text-hegra-navy border border-hegra-chino hover:bg-hegra-chino/20 ${baseDashboardButtonStyles}`;
      break;
    default: 
      dynamicRoleButtonStyles = `bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 ${baseDashboardButtonStyles}`;
      break;
  }


  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleMobileSidebar} 
              className="text-gray-500 hover:text-hegra-turquoise focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hegra-yellow p-2 rounded-md -ml-2 md:hidden"
              aria-label="Toggle mobile sidebar"
            >
              <Menu size={24} />
            </button>
            <nav aria-label="Breadcrumb" className="ml-4 hidden md:block">
              <ol className="flex items-center space-x-1 text-sm">
                {breadcrumbSegments.map((segment, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronRight size={18} className="text-gray-400 flex-shrink-0 mx-1" />}
                    {segment.isCurrent ? (
                      <span className="font-medium text-hegra-navy flex items-center">
                        {index === 0 && breadcrumbSegments.length === 1 && <Home size={16} className="mr-1.5 flex-shrink-0" />} 
                        {segment.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => segment.viewId && onSelectView(segment.viewId, segment.data)}
                        className="text-gray-500 hover:text-hegra-turquoise transition-colors flex items-center"
                      >
                        {index === 0 && <Home size={16} className="mr-1.5 flex-shrink-0" />}
                        {segment.label}
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onOpenRoleSwitchModal} 
              className={`hidden sm:flex ${dynamicRoleButtonStyles}`}
              aria-label="Ganti Peran Pengguna" 
            >
              <RoleButtonIcon size={16} /> {roleButtonText}
            </button>
            <UserMenuButton 
              userName={userName} 
              userRole={userRole} 
              context="dashboard" 
              onLogout={onLogout} 
              onNavigate={onNavigate} 
            />
          </div>
        </div>
         <nav aria-label="Breadcrumb" className="py-2 border-t border-gray-100 md:hidden">
              <ol className="flex items-center space-x-1 text-xs truncate">
                {breadcrumbSegments.map((segment, index) => (
                  <li key={`mobile-${index}`} className="flex items-center truncate">
                    {index > 0 && <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mx-0.5" />}
                    {segment.isCurrent ? (
                      <span className="font-medium text-hegra-navy truncate flex items-center">
                        {index === 0 && breadcrumbSegments.length === 1 && <Home size={14} className="mr-1 flex-shrink-0" />}
                        {segment.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => segment.viewId && onSelectView(segment.viewId, segment.data)}
                        className="text-gray-500 hover:text-hegra-turquoise transition-colors truncate flex items-center"
                      >
                         {index === 0 && <Home size={14} className="mr-1 flex-shrink-0" />}
                        {segment.label}
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
      </div>
    </header>
  );
};

export default DashboardTopBar;
