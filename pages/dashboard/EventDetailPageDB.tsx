/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { PageName, EventData, formatEventTime, formatDisplayDate } from '../../HegiraApp';
import { DashboardViewId } from '../../pages/DashboardPage';
import { X, Edit, Power, PowerOff, CheckCircle, ChevronDown, ChevronUp, Link as LinkIcon, Upload, Eye, ArrowLeft } from 'lucide-react';

interface EventDetailPageDBProps {
  eventData: EventData;
  onSwitchView: (viewId: DashboardViewId, data?: any) => void;
  onToggleEventStatus: (event: EventData, newStatus?: string) => void;
  onNavigate: (page: PageName, data?: any) => void; 
}

const FALLBACK_PAGE_POSTER_URL = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80&h=480';
const ERROR_PAGE_POSTER_URL = 'https://via.placeholder.com/1280x480/f0f0f0/969696?text=Image+Error';

const slugify = (text: string | undefined): string => {
  if (!text) return 'untitled-event';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const DetailRightColumnItem: React.FC<{ label: string; value?: string | number | null; valueClassName?: string; isLink?: boolean; href?: string; }> = ({ label, value, valueClassName = "text-hegra-deep-navy text-right", isLink, href }) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const content = isLink && href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`hover:underline ${valueClassName}`}>{String(value)}</a>
  ) : (
    String(value)
  );
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center text-xs text-gray-500">
        {label}
      </div>
      <span className={`text-xs ${!isLink ? valueClassName : ''} ml-2 break-words`}>{content}</span>
    </div>
  );
};

const EventDetailPageDB: React.FC<EventDetailPageDBProps> = ({
  eventData,
  onSwitchView,
  onToggleEventStatus,
  onNavigate, 
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [isTermsExpanded, setIsTermsExpanded] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(true);
    setIsTermsExpanded(true);
    setIsLinkCopied(false);
  }, [eventData.id]);

  const eventPageLink = `https://hegira.id/event/${slugify(eventData.eventSlug || eventData.name)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventPageLink);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy event link.');
    }
  };

  const handlePreviewLink = () => {
    onNavigate('eventDetail', eventData); 
  };

  const getStatusButtonConfig = () => {
    if (eventData.status === 'Aktif') {
      return { text: 'End Event', icon: PowerOff, action: () => onToggleEventStatus(eventData, 'Selesai'), className: 'bg-red-500 hover:bg-red-600 text-white' };
    } else if (eventData.status === 'Draf') {
      return { text: 'Activate Event', icon: Power, action: () => onToggleEventStatus(eventData, 'Aktif'), className: 'bg-green-500 hover:bg-green-700 text-white' };
    }
    return { text: 'Event Completed', icon: CheckCircle, action: () => {}, className: 'bg-gray-300 text-gray-600 cursor-not-allowed', disabled: true };
  };
  const statusButtonConfig = getStatusButtonConfig();

  const statusBadgeStyle: { [key: string]: string } = {
    Aktif: 'bg-green-100 text-green-700 border border-green-300',
    Selesai: 'bg-blue-100 text-blue-700 border border-blue-300',
    Draf: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    Default: 'bg-gray-100 text-gray-700 border border-gray-300',
  };
  const currentStatusBadgeStyle = statusBadgeStyle[eventData.status as keyof typeof statusBadgeStyle] || statusBadgeStyle.Default;

  return (
    <div className="pb-8">
      {/* Button "Kembali ke Daftar Event" has been removed from here */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header and Action Buttons */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 id="event-detail-page-title" className="text-xl md:text-2xl font-bold text-hegra-deep-navy leading-tight">
              {eventData.name}
            </h1>
            <span className={`mt-1.5 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${currentStatusBadgeStyle}`}>
              Status: {eventData.status}
            </span>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => onSwitchView('editEventView', eventData)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Edit size={16} /> Edit Event
            </button>
            <button
              onClick={statusButtonConfig.action}
              disabled={statusButtonConfig.disabled}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${statusButtonConfig.className}`}
            >
              <statusButtonConfig.icon size={16} /> {statusButtonConfig.text}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Cover, Link, Descriptions */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1 p-4 sm:p-6 lg:pr-3 xl:pr-6">
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover Photo</h3>
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-[16/6]">
                <img
                  src={eventData.coverImageUrl || eventData.posterUrl || FALLBACK_PAGE_POSTER_URL}
                  alt={`Poster ${eventData.name}`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = ERROR_PAGE_POSTER_URL; }}
                />
              </div>
            </section>
            
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Public Event Link</h3>
              <div className="flex items-center gap-2">
                <div className="flex-grow flex items-center border border-gray-300 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <LinkIcon size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                  <span className="truncate" title={eventPageLink}>{eventPageLink}</span>
                </div>
                <button onClick={handleCopyLink} title="Copy Link" className="p-2.5 text-gray-600 hover:text-hegra-turquoise bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"><Upload size={18} /></button>
                <button onClick={handlePreviewLink} title="Preview Link" className="p-2.5 text-gray-600 hover:text-hegra-turquoise bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"><Eye size={18} /></button>
              </div>
              {isLinkCopied && <p className="text-xs text-green-600 mt-1.5">Link copied!</p>}
            </section>

            <section className="mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Event Description</h3>
                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-xs text-hegra-turquoise hover:underline flex items-center">
                  {isDescriptionExpanded ? 'Hide' : 'Show More'}
                  {isDescriptionExpanded ? <ChevronUp size={16} className="ml-0.5" /> : <ChevronDown size={16} className="ml-0.5" />}
                </button>
              </div>
              <div className={`prose prose-sm max-w-none text-gray-700 ${!isDescriptionExpanded ? 'line-clamp-5' : ''}`}
                   dangerouslySetInnerHTML={{ __html: eventData.fullDescription || '<p>No description available.</p>'}} />
            </section>

            <section>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Terms and Conditions</h3>
                <button onClick={() => setIsTermsExpanded(!isTermsExpanded)} className="text-xs text-hegra-turquoise hover:underline flex items-center">
                  {isTermsExpanded ? 'Hide' : 'Show More'}
                  {isTermsExpanded ? <ChevronUp size={16} className="ml-0.5" /> : <ChevronDown size={16} className="ml-0.5" />}
                </button>
              </div>
               <div className={`prose prose-sm max-w-none text-gray-700 ${!isTermsExpanded ? 'line-clamp-5' : ''}`}
                   dangerouslySetInnerHTML={{ __html: eventData.termsAndConditions || '<p>Terms and conditions not set.</p>'}} />
            </section>
          </div>
          
          {/* Right Column: Details */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 p-4 sm:p-6 lg:border-l lg:border-gray-200">
            <section className="mb-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Information</h3>
              <div className="space-y-1 text-sm">
                <DetailRightColumnItem label="Category" value={eventData.category} valueClassName="text-hegra-deep-navy font-medium text-right"/>
                <DetailRightColumnItem label="Theme" value={eventData.theme} valueClassName="text-hegra-deep-navy font-medium text-right"/>
                <DetailRightColumnItem label="Date" value={formatDisplayDate(eventData.dateDisplay)} valueClassName="text-hegra-deep-navy text-right"/>
                <DetailRightColumnItem label="Time" value={formatEventTime(eventData.timeDisplay, eventData.timezone)} valueClassName="text-hegra-deep-navy text-right"/>
                <DetailRightColumnItem label="Location" value={eventData.location} valueClassName="text-hegra-deep-navy text-right"/>
                <DetailRightColumnItem label="Address" value={eventData.address} valueClassName="text-hegra-deep-navy text-right"/>
                <DetailRightColumnItem label="Google Maps" value={eventData.googleMapsQuery || "Not set"} isLink={!!eventData.googleMapsQuery} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.googleMapsQuery || eventData.location)}`} valueClassName="text-hegra-turquoise text-right"/>
              </div>
            </section>

            <section className="mb-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Information</h3>
              <div className="space-y-1 text-sm">
                <DetailRightColumnItem label="Parking" value={eventData.parkingAvailable === false ? 'Paid/Limited' : (eventData.parkingAvailable === true ? 'Free/Available' : 'N/A')} />
                <DetailRightColumnItem label="Age Restriction" value={eventData.ageRestriction || 'All Ages'} />
                <DetailRightColumnItem label="Arrival Info" value={eventData.arrivalInfo || 'As scheduled'} />
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Event Contact Person</h3>
              <div className="space-y-1 text-sm">
                <DetailRightColumnItem label="Name" value={eventData.narahubungName || eventData.organizerName || 'Admin Hegira'} />
                <DetailRightColumnItem label="Phone No." value={eventData.narahubungPhone || 'N/A'} />
                <DetailRightColumnItem label="Email" value={eventData.narahubungEmail || 'N/A'} />
              </div>
            </section>
          </div>
        </div>
      </div>
      <style>{`
        .prose-sm { font-size: 0.875rem; line-height: 1.65; } 
        .prose-sm ul, .prose-sm ol { padding-left: 1.5rem; margin-top: 0.5em; margin-bottom: 0.5em; }
        .prose-sm li { margin-top: 0.25em; margin-bottom: 0.25em; }
        .prose-sm p { margin-top: 0.5em; margin-bottom: 0.75em; }
        .prose-sm h1, .prose-sm h2, .prose-sm h3, .prose-sm h4, .prose-sm h5, .prose-sm h6 { margin-top: 1em; margin-bottom: 0.5em; line-height: 1.3;}
        .line-clamp-5 {
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventDetailPageDB;