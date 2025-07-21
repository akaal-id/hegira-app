
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { UserRole, PageName, EventData } from '../../HegiraApp'; // EventData might not be needed directly here unless for context
import { Briefcase, PackageSearch, Settings2, Inbox, Link as LinkIcon, CalendarClock, LineChart, UserCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
// Placeholder view imports
import CompanyProfileBM from './views/CompanyProfileBM';
import MyServicesBM from './views/MyServicesBM';
import IncomingRequestsBM from './views/IncomingRequestsBM';
import MeetingScheduleBM from './views/MeetingScheduleBM';
import PerformanceAnalyticsBM from './views/PerformanceAnalyticsBM';
import AccountSettingsBM from './views/AccountSettingsBM';


// Define View IDs specific to this Business Matching Dashboard
export type DashboardViewIdBM =
  'companyProfileBM' | 'myServicesBM' | 'accountSettingsBM' |
  'incomingRequestsBM' | 'searchPartnersBM' | 'meetingScheduleBM' |
  'performanceAnalyticsBM';

export interface OrganizationAccountData { // Similar to CreatorAccountData, but for Organization
  organizationName: string;
  email: string;
  contactPerson: string;
  phoneNumber: string | null;
  profilePictureUrl?: string; // Logo
  currentPassword?: string;
  address?: string;
  website?: string;
  industry?: string;
}


// Sidebar navigation structure for Business Matching Dashboard
export const sidebarSectionsBM: { title: string; items: { id: DashboardViewIdBM; label: string; icon: React.ElementType; path: string; }[] }[] = [
  {
    title: 'Profil & Layanan',
    items: [
      { id: 'companyProfileBM', label: 'Profil Perusahaan', icon: Briefcase, path: '/dashboard-bm/profile' },
      { id: 'myServicesBM', label: 'Layanan Saya', icon: PackageSearch, path: '/dashboard-bm/services' },
      { id: 'accountSettingsBM', label: 'Pengaturan Akun', icon: Settings2, path: '/dashboard-bm/settings' },
    ],
  },
  {
    title: 'Interaksi & Peluang',
    items: [
      { id: 'incomingRequestsBM', label: 'Permintaan Masuk', icon: Inbox, path: '/dashboard-bm/requests' },
      { id: 'searchPartnersBM', label: 'Cari Mitra/Klien', icon: LinkIcon, path: '/dashboard-bm/search' }, // This might link out or be an embedded search
      { id: 'meetingScheduleBM', label: 'Jadwal Meeting', icon: CalendarClock, path: '/dashboard-bm/meetings' },
    ],
  },
  {
    title: 'Analitik',
    items: [
      { id: 'performanceAnalyticsBM', label: 'Analitik Performa', icon: LineChart, path: '/dashboard-bm/analytics' },
    ],
  },
];


interface BusinessMatchingDashboardPageProps {
  onNavigate: (page: PageName, data?: any) => void;
  onLogout: () => void;
  userName: string; // Organization Name
  userRole: UserRole; // Added prop
  onOpenRoleSwitchModal: () => void; // Added prop
}

const BusinessMatchingDashboardPage: React.FC<BusinessMatchingDashboardPageProps> = ({
  onNavigate,
  onLogout,
  userName,
  userRole, // Destructure
  onOpenRoleSwitchModal // Destructure
}) => {
  const [activeView, setActiveView] = useState<DashboardViewIdBM>('companyProfileBM');

  // Sample data for Organization Account (replace with actual data fetching/state management)
  const [organizationData, setOrganizationData] = useState<OrganizationAccountData>({
    organizationName: userName,
    email: 'org@hegira.com',
    contactPerson: 'Nama Kontak Organisasi',
    phoneNumber: '+62211234567',
    profilePictureUrl: 'https://via.placeholder.com/150/18093B/FFFFFF?text=ORG', // Placeholder logo
    currentPassword: 'PasswordOrg123',
    address: 'Jl. Organisasi No. 1, Jakarta',
    website: 'https://www.organisasihegira.com',
    industry: 'Teknologi Informasi',
  });
  
  React.useEffect(() => {
    if (userName !== organizationData.organizationName) {
        setOrganizationData(prev => ({ ...prev, organizationName: userName }));
    }
  }, [userName, organizationData.organizationName]);


  const handleUpdatePhoneNumber = (newPhoneNumber: string) => {
    setOrganizationData(prev => ({ ...prev, phoneNumber: newPhoneNumber }));
    alert(`Nomor telepon organisasi berhasil disimpan: ${newPhoneNumber}`);
  };
  
  const handleUpdateProfilePicture = (newPictureUrl: string) => {
    setOrganizationData(prev => ({ ...prev, profilePictureUrl: newPictureUrl }));
    alert(`Logo organisasi berhasil diperbarui.`);
  };

  const handleUpdatePassword = (oldPassword: string, newPassword: string) => {
    if (oldPassword !== organizationData.currentPassword) {
      alert("Password lama salah.");
      return;
    }
    setOrganizationData(prev => ({ ...prev, currentPassword: newPassword }));
    alert(`Password berhasil diubah (simulasi).`);
  };


  const getLabelForView = (viewId: DashboardViewIdBM): string => {
    const item = sidebarSectionsBM.flatMap(s => s.items).find(i => i.id === viewId);
    return item?.label || 'Dashboard Organisasi';
  };
  const currentViewLabel = getLabelForView(activeView);

  const handleSwitchView = (viewId: DashboardViewIdBM, data?: any) => {
    if (viewId === 'searchPartnersBM') {
      onNavigate('business'); // Navigate to the main public business matching page
      return;
    }
    setActiveView(viewId);
  };

  const renderBusinessMatchingDashboardContent = () => {
    switch (activeView) {
      case 'companyProfileBM':
        return <CompanyProfileBM organizationData={organizationData} onUpdateOrganizationData={setOrganizationData} />;
      case 'myServicesBM':
        return <MyServicesBM />;
      case 'accountSettingsBM':
        return <AccountSettingsBM 
                  organizationData={organizationData} 
                  onUpdatePhoneNumber={handleUpdatePhoneNumber}
                  onUpdateProfilePicture={handleUpdateProfilePicture}
                  onUpdatePassword={handleUpdatePassword}
                />;
      case 'incomingRequestsBM':
        return <IncomingRequestsBM />;
      case 'meetingScheduleBM':
        return <MeetingScheduleBM />;
      case 'performanceAnalyticsBM':
        return <PerformanceAnalyticsBM />;
      default:
        return <div className="p-6"><h2 className="text-2xl font-semibold text-hegra-navy mb-4">Dasbor Organisasi</h2><p className="text-gray-700">Selamat datang! Pilih menu dari sidebar untuk mengelola aktivitas business matching Anda.</p></div>;
    }
  };

  return (
    <DashboardLayout
      activeViewId={activeView as any} 
      currentViewLabel={currentViewLabel}
      sidebarSections={sidebarSectionsBM as any} 
      onSelectView={handleSwitchView as any} 
      onNavigate={onNavigate}
      onLogout={onLogout}
      userName={userName}
      userRole={userRole} // Pass userRole
      onOpenRoleSwitchModal={onOpenRoleSwitchModal} // Pass onOpenRoleSwitchModal
    >
      {renderBusinessMatchingDashboardContent()}
    </DashboardLayout>
  );
};

export default BusinessMatchingDashboardPage;
