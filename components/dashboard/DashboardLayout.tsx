
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import DashboardTopBar from './DashboardTopBar';
import DashboardSidebarNav, { SidebarSection } from './DashboardSidebarNav';
import DashboardFooter from './DashboardFooter';
import { PageName, UserRole, EventData } from '../../HegiraApp'; 
import { Menu } from 'lucide-react';
import { DashboardViewId as CreatorVisitorViewId } from '../../pages/DashboardPage'; 
import { DashboardViewIdBM } from '../../pages/dashboard-bm/BusinessMatchingDashboardPage';

export type CombinedDashboardViewId = CreatorVisitorViewId | DashboardViewIdBM | string; // Allow string for broader compatibility if needed

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeViewId: CombinedDashboardViewId; 
  currentViewLabel: string;
  sidebarSections: SidebarSection[];
  onSelectView: (viewId: CombinedDashboardViewId, data?: any) => void; 
  onNavigate: (page: PageName, data?: any) => void;
  onLogout: () => void;
  userName: string; 
  userRole: UserRole; 
  onOpenRoleSwitchModal: () => void; 
  contextEvent?: EventData | null; 
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeViewId,
  currentViewLabel,
  sidebarSections,
  onSelectView,
  onNavigate,
  onLogout,
  userName, 
  userRole, 
  onOpenRoleSwitchModal, 
  contextEvent, 
}) => {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setIsMobileSidebarOpen(false); 
      }
    };
    if (window.innerWidth >= 768) {
        setIsDesktopSidebarOpen(true);
    } else {
        setIsDesktopSidebarOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarOpen(prev => !prev);
  }, []);
  
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);
  
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className={`hidden md:flex flex-col transition-all duration-300 ease-in-out ${isDesktopSidebarOpen ? 'w-64' : 'w-20'} bg-hegra-white shadow-lg`}>
        <DashboardSidebarNav
          sidebarSections={sidebarSections}
          activeViewId={activeViewId as any} // Cast for now, ensure type compatibility
          onSelectView={onSelectView as any} // Cast for now
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onToggleDesktopSidebar={toggleDesktopSidebar}
          onNavigate={onNavigate}
          onCloseMobileSidebar={closeMobileSidebar} 
        />
      </div>

      {/* Sidebar for Mobile (Overlay) */}
      {isMobileSidebarOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden" 
            onClick={closeMobileSidebar}
            aria-hidden="true"
        ></div>
      )}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-hegra-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <DashboardSidebarNav
          sidebarSections={sidebarSections}
          activeViewId={activeViewId as any} // Cast
          onSelectView={onSelectView as any} // Cast
          isDesktopSidebarOpen={true} 
          onToggleDesktopSidebar={() => {}} 
          onNavigate={onNavigate}
          onCloseMobileSidebar={closeMobileSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopBar
          currentViewLabel={currentViewLabel}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onToggleMobileSidebar={toggleMobileSidebar} 
          userName={userName} 
          userRole={userRole} 
          onOpenRoleSwitchModal={onOpenRoleSwitchModal} 
          activeViewId={activeViewId as any} // Cast
          onSelectView={onSelectView as any} // Cast
          contextEvent={contextEvent} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
