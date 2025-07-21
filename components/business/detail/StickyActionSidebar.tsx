
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import MiniCalendar from './MiniCalendar'; 
import { Briefcase, Mail, Phone, Globe, MessageSquare, CalendarPlus, Send, ChevronDown, ChevronUp, X } from 'lucide-react';

interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

interface AvailabilitySlot {
  day: string;
  slots: string[];
}

interface StickyActionSidebarProps {
  companyName: string;
  contactInfo?: ContactInfo;
  availability?: AvailabilitySlot[];
  onOpenMeetingScheduler: () => void;
  onCollaborationSubmit: (formData: { projectIdea: string; budget: string }) => void;
}

const StickyActionSidebar: React.FC<StickyActionSidebarProps> = ({
  companyName,
  contactInfo,
  availability,
  onOpenMeetingScheduler,
  onCollaborationSubmit,
}) => {
  const [projectIdea, setProjectIdea] = useState('');
  const [budget, setBudget] = useState('');
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  const handleQuickCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim()) { // Budget can be optional
        alert("Mohon isi ide proyek Anda.");
        return;
    }
    onCollaborationSubmit({ projectIdea, budget });
    setProjectIdea('');
    setBudget('');
    if (isMobileActionsOpen) setIsMobileActionsOpen(false); // Close mobile sheet on submit
  };

  const ActionButtonsList = () => (
    <>
      <button
        onClick={onOpenMeetingScheduler}
        className="w-full flex items-center justify-center gap-2 bg-hegra-turquoise text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm shadow-md transform hover:scale-105 btn-hover-gradient"
      >
        <CalendarPlus size={18} /> Ajukan Meeting
      </button>
      <button
        onClick={() => alert('Fitur "Kirim Proposal" akan segera hadir!')}
        className="w-full flex items-center justify-center gap-2 bg-hegra-navy text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm border border-hegra-navy"
      >
        <Send size={16} /> Kirim Proposal (Segera)
      </button>
       <button
        onClick={() => alert('Fitur "Minta Penawaran" akan segera hadir!')}
        className="w-full flex items-center justify-center gap-2 bg-transparent text-hegra-turquoise border-2 border-hegra-turquoise font-semibold py-2.5 px-4 rounded-lg hover:bg-hegra-turquoise/10 transition-colors text-sm"
      >
        <MessageSquare size={16} /> Minta Penawaran (Segera)
      </button>
    </>
  );

  const QuickCollabForm = ({isMobile}: {isMobile?: boolean}) => (
     <form onSubmit={handleQuickCollabSubmit} className={`mt-4 pt-4 border-t border-gray-100 space-y-2.5 ${isMobile ? 'p-1' : ''}`}>
        <h4 className={`font-semibold text-hegra-deep-navy ${isMobile ? 'text-sm' : 'text-md'}`}>Minat Kolaborasi Cepat</h4>
        <div>
        <label htmlFor={`projectIdea-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">Ide Proyek</label>
        <textarea id={`projectIdea-${isMobile ? 'mobile' : 'desktop'}`} value={projectIdea} onChange={(e) => setProjectIdea(e.target.value)} rows={2} placeholder="Ide proyek singkat..." className="w-full text-xs p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-hegra-turquoise focus:border-hegra-turquoise bg-white"></textarea>
        </div>
        <div>
        <label htmlFor={`budget-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">Perkiraan Budget (Rp)</label>
        <input type="text" id={`budget-${isMobile ? 'mobile' : 'desktop'}`} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Estimasi Budget (opsional)" className="w-full text-xs p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-hegra-turquoise focus:border-hegra-turquoise bg-white"/>
        </div>
        <button type="submit" className="w-full bg-hegra-yellow text-hegra-navy font-semibold py-2 px-3 rounded-lg hover:bg-opacity-90 text-sm btn-hover-gradient">Kirim Minat</button>
    </form>
  );

  const ContactDetails = () => (
    contactInfo && (contactInfo.phone || contactInfo.email || contactInfo.website) ? (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-hegra-deep-navy mb-1.5">Kontak Perusahaan</h4>
        <div className="space-y-1 text-xs">
          {contactInfo.phone && (
            <a href={`tel:${contactInfo.phone}`} className="flex items-center text-gray-600 hover:text-hegra-turquoise transition-colors">
              <Phone size={13} className="mr-1.5 flex-shrink-0" /> {contactInfo.phone}
            </a>
          )}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="flex items-center text-gray-600 hover:text-hegra-turquoise transition-colors">
              <Mail size={13} className="mr-1.5 flex-shrink-0" /> {contactInfo.email}
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-hegra-turquoise transition-colors">
              <Globe size={13} className="mr-1.5 flex-shrink-0" /> {contactInfo.website}
            </a>
          )}
        </div>
      </div>
    ) : null
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24 bg-white p-5 rounded-xl border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold text-hegra-deep-navy mb-3">Tertarik Kolaborasi?</h3>
        <div className="space-y-2.5">
          <ActionButtonsList />
        </div>
        <QuickCollabForm />
        <MiniCalendar availability={availability} companyName={companyName} />
        <ContactDetails />
      </div>

      {/* Mobile Fixed Bottom Bar/Sheet Trigger */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <button 
          onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}
          className="w-full flex justify-between items-center py-2.5 px-3 bg-hegra-turquoise text-white rounded-md font-semibold text-sm"
          aria-expanded={isMobileActionsOpen}
          aria-controls="mobile-actions-sheet"
        >
          <span>Aksi & Kontak</span>
          {isMobileActionsOpen ? <X size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Mobile Actions Sheet */}
      {isMobileActionsOpen && (
         <div 
            id="mobile-actions-sheet"
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-hegra-yellow p-4 transition-transform duration-300 ease-out max-h-[75vh] overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-hegra-deep-navy">Aksi Cepat & Kontak</h3>
                <button onClick={() => setIsMobileActionsOpen(false)} className="p-1 text-gray-500 hover:text-hegra-navy">
                    <X size={22}/>
                </button>
            </div>
            <div className="space-y-3">
                <ActionButtonsList />
                <QuickCollabForm isMobile={true} />
                <MiniCalendar availability={availability} companyName={companyName} isMobileContext={true} />
                <ContactDetails />
            </div>
        </div>
      )}
    </>
  );
};

export default StickyActionSidebar;
