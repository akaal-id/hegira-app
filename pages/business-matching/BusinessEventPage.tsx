/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EventData, PageName, formatEventTime, formatDisplayDate } from '../../HegiraApp';
import Breadcrumbs from '../../components/Breadcrumbs';
import BusinessMatchingCard from '../../components/BusinessMatchingCard';
import ExhibitorSlot, { ExhibitorSlotData } from '../../components/business/ExhibitorSlot';
import { Share2, Link as LinkIcon, MapPin, CalendarDays, Clock, Users, ParkingCircle, Info, Instagram, Facebook, Twitter, Linkedin, MessageCircle as WhatsAppIcon, ChevronDown, ChevronUp, CheckCircle, Award, Phone, Mail as MailIcon, Briefcase, Building2, Users2, Package } from 'lucide-react';
import ProductCard from '../../components/business/ProductCard';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// Utility function to format description with lists
const formatDescriptionWithLists = (description: string | undefined): string => {
  if (!description) return '<p>Detailed information about this event will be available soon.</p>';

  const lines = description.split('\n');
  const outputLines: string[] = [];
  let listType: 'ol' | 'ul' | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const olMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
    const ulMatch = trimmedLine.match(/^[-*]\s+(.*)/);

    if (olMatch) {
      if (listType !== 'ol') {
        if (listType === 'ul') outputLines.push('</ul>');
        outputLines.push('<ol class="list-decimal pl-5 space-y-1">');
        listType = 'ol';
      }
      outputLines.push(`  <li>${olMatch[2]}</li>`);
    } else if (ulMatch) {
      if (listType !== 'ul') {
        if (listType === 'ol') outputLines.push('</ol>');
        outputLines.push('<ul class="list-disc pl-5 space-y-1">');
        listType = 'ul';
      }
      outputLines.push(`  <li>${ulMatch[1]}</li>`);
    } else {
      if (listType) {
        outputLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        listType = null;
      }
      if (trimmedLine) {
        outputLines.push(`<p class="my-2">${trimmedLine}</p>`);
      }
    }
  }
  if (listType) {
    outputLines.push(listType === 'ol' ? '</ol>' : '</ul>');
  }
  return outputLines.join('\n');
};

// Mock data for business cards (buyer tab)
const mockBusinessCards = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logoUrl: "https://via.placeholder.com/150/F0F3F7/8D94A8?text=TC",
    matchScore: 95,
    sector: "Technology",
    location: "Jakarta Selatan",
    budget: "Rp 500.000.000",
    specialFeatures: ["Verified", "Fast Response", "OJK Registered"]
  },
  {
    id: 2,
    name: "Digital Innovations Ltd",
    logoUrl: "https://via.placeholder.com/150/F0F3F7/8D94A8?text=DI",
    matchScore: 88,
    sector: "Digital Marketing",
    location: "Bandung",
    budget: "Rp 300.000.000",
    specialFeatures: ["Premium Partner", "24/7 Support", "ISO Certified"]
  },
  {
    id: 3,
    name: "Green Energy Corp",
    logoUrl: "https://via.placeholder.com/150/F0F3F7/8D94A8?text=GE",
    matchScore: 92,
    sector: "Renewable Energy",
    location: "Surabaya",
    budget: "Rp 750.000.000",
    specialFeatures: ["Eco-Friendly", "Government Partner", "Award Winner"]
  }
];

// Mock data for exhibitor slots (seller tab)
const mockExhibitorSlots: ExhibitorSlotData[] = [
  {
    id: "row-1a",
    name: "Row 1A",
    location: "Main Hall - Front",
    size: "3m x 3m",
    price: 2500000,
    isAvailable: true,
    features: ["Premium Location", "Power Outlet", "WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  },
  {
    id: "row-1b",
    name: "Row 1B",
    location: "Main Hall - Front",
    size: "3m x 3m",
    price: 2500000,
    isAvailable: true,
    features: ["Premium Location", "Power Outlet", "WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  },
  {
    id: "row-2a",
    name: "Row 2A",
    location: "Main Hall - Middle",
    size: "3m x 3m",
    price: 2000000,
    isAvailable: true,
    features: ["Power Outlet", "WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  },
  {
    id: "row-2b",
    name: "Row 2B",
    location: "Main Hall - Middle",
    size: "3m x 3m",
    price: 2000000,
    isAvailable: false,
    features: ["Power Outlet", "WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  },
  {
    id: "row-3a",
    name: "Row 3A",
    location: "Main Hall - Back",
    size: "3m x 3m",
    price: 1500000,
    isAvailable: true,
    features: ["WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  },
  {
    id: "row-3b",
    name: "Row 3B",
    location: "Main Hall - Back",
    size: "3m x 3m",
    price: 1500000,
    isAvailable: true,
    features: ["WiFi Access"],
    eventDate: "25 - 26 Agustus 2025",
    eventTime: "08:30 - 17:00 WIB"
  }
];

// Mock data for products (products tab) - PT Digital Innovation Nusantara Only
const mockCompanyProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Custom Software Development",
    price: "25,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Custom software development solutions tailored to your business needs. We specialize in web applications, mobile apps, and enterprise software.",
    contactInfo: "info@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Data Analytics Platform",
    price: "35,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Advanced data analytics platform for business intelligence, reporting, and data-driven decision making.",
    contactInfo: "analytics@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Cloud Infrastructure Setup",
    price: "45,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Complete cloud infrastructure setup, migration, and management services for enterprise clients.",
    contactInfo: "cloud@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Mobile App Development",
    price: "30,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Cross-platform mobile application development for iOS and Android with modern UI/UX design.",
    contactInfo: "mobile@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "AI Chatbot Solution",
    price: "20,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Intelligent chatbot solutions powered by AI for customer service and business automation.",
    contactInfo: "ai@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    title: "Cybersecurity Audit",
    price: "40,000,000",
    sellerName: "PT Digital Innovation Nusantara",
    location: "South Jakarta, DKI Jakarta",
    companyName: "PT Digital Innovation Nusantara",
    description: "Comprehensive cybersecurity audit and penetration testing services to protect your digital assets.",
    contactInfo: "security@digitalinnovation.co.id",
    phone: "021-5550101",
    website: "https://www.digitalinnovation.co.id"
  }
];

interface BusinessEventPageProps {
  event: EventData;
  onNavigate: (page: PageName, data?: any) => void;
  onNavigateRequestWithConfirmation: (page: PageName, data?: any, resetCallback?: () => void) => void;
}

const BusinessEventPage: React.FC<BusinessEventPageProps> = ({ event, onNavigate, onNavigateRequestWithConfirmation }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'products'>('buyer');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');

  // Reset states when event changes
  useEffect(() => {
    setIsDescriptionExpanded(false);
    setShowShareOptions(false);
    setSelectedSlot(null);
  }, [event.id]);

  const currentEventUrl = `${window.location.origin}/business-event/${event.id}`;

  const shareActions = {
    copyLink: () => navigator.clipboard.writeText(currentEventUrl).then(() => alert('Event link copied!')),
    whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(event.name + ' - ' + currentEventUrl)}`, '_blank'),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentEventUrl)}`, '_blank'),
    twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentEventUrl)}&text=${encodeURIComponent(event.name)}`, '_blank'),
    linkedin: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentEventUrl)}&title=${encodeURIComponent(event.name)}&summary=${encodeURIComponent(event.summary || '')}`, '_blank'),
    instagram: () => alert('Share on Instagram through your mobile app! Copy the link and open Instagram.'),
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    // You can add navigation logic here or show a modal
    alert(`Selected slot: ${slotId}`);
  };

  const handleContactSeller = (productTitle: string, companyName: string) => {
    alert(`Contact request sent for ${productTitle} from ${companyName}`);
  };

  // Filter products based on search term and company filter
  const filteredProducts = useMemo(() => {
    let filtered = mockCompanyProducts;
    
    // Filter by search term
    if (productSearchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.companyName.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
    }
    
    // Filter by company
    if (selectedCompanyFilter !== 'all') {
      filtered = filtered.filter(product => product.companyName === selectedCompanyFilter);
    }
    
    return filtered;
  }, [productSearchTerm, selectedCompanyFilter]);

  // Get unique company names for filter dropdown
  const uniqueCompanies = useMemo(() => {
    const companies = [...new Set(mockCompanyProducts.map(product => product.companyName))];
    return companies.sort();
  }, []);

  const handleBreadcrumbNavigate = useCallback((targetPage: PageName) => {
    onNavigate(targetPage);
  }, [onNavigate]);

  const cleanPhoneNumber = (phone: string | undefined) => phone ? phone.replace(/\D/g, '') : '';

  // Determine which description to use
  let descriptionHtml = formatDescriptionWithLists(event.fullDescription);

  const heroImageStyle: React.CSSProperties = event.coverImageUrl ? {
    backgroundImage: `url(${event.coverImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `${(6 / 16) * 100}%`,
  } : (event.posterUrl ? {
    backgroundImage: `url(${event.posterUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `${(6 / 16) * 100}%`,
  } : {});

  return (
    <div className="bg-gray-50 pb-28 lg:pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs eventName={event.name} onNavigate={handleBreadcrumbNavigate} />
      </div>
      
      {/* Hero Banner */}
      <div 
        className={`w-full bg-gray-300 relative ${!(event.coverImageUrl || event.posterUrl) && 'h-48 md:h-64 lg:h-80'}`}
        style={heroImageStyle}
        role="img"
        aria-label={`Poster event ${event.name}`}
      >
        {!(event.coverImageUrl || event.posterUrl) && <div className="absolute inset-0 flex items-center justify-center text-gray-500">Event Poster</div>}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Area - Full Width */}
        <div className="w-full">
          {/* Island Card for Core Info */}
          <section aria-labelledby="event-main-info" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8 -mt-16 lg:-mt-24 relative z-10">
            <h1 id="event-main-info" className="text-3xl md:text-4xl font-bold font-jakarta text-hegra-navy mb-3">{event.name}</h1>
            {event.summary && (
              <p className="text-gray-700 mb-6 text-lg">{event.summary}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
              <div className="flex items-start">
                <CalendarDays size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-hegra-navy">Date & Time</strong>
                  <span>{formatDisplayDate(event.dateDisplay)}</span>
                  <span className="block text-gray-600 text-sm mt-0.5">{formatEventTime(event.timeDisplay, event.timezone)}</span>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-hegra-navy">Location</strong>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.googleMapsQuery || event.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-hegra-turquoise"
                  >
                    {event.location}
                  </a>
                </div>
              </div>
              {event.parkingAvailable !== undefined && (
                <div className="flex items-start">
                  <ParkingCircle size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-hegra-navy">Parking:</strong> {event.parkingAvailable ? 'Available' : 'Limited/Not Available'}</div>
                </div>
              )}
              {event.ageRestriction && (
                <div className="flex items-start">
                  <Users size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-hegra-navy">Age Restriction:</strong> {event.ageRestriction}</div>
                </div>
              )}
              {event.arrivalInfo && (
                <div className="flex items-start md:col-span-2">
                  <Clock size={20} className="text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-hegra-navy">Arrival Info:</strong> {event.arrivalInfo}</div>
                </div>
              )}
            </div>
            
            {/* Event Creator Profile Section */}
            {(event.organizerName || event.narahubungPhone || event.narahubungEmail) && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-md font-jakarta font-semibold text-gray-700 mb-3">Organized by:</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {event.organizerLogoUrl ? (
                      <img src={event.organizerLogoUrl} alt={event.organizerName} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-hegra-turquoise/20 text-hegra-turquoise flex items-center justify-center text-lg font-semibold mr-3">
                        {event.organizerName ? event.organizerName.charAt(0).toUpperCase() : <Briefcase size={20}/>}
                      </div>
                    )}
                    <span className="text-sm font-medium text-hegra-navy">{event.organizerName || 'Event Organizer'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.narahubungPhone && (
                      <a 
                        href={`https://wa.me/${cleanPhoneNumber(event.narahubungPhone)}`} 
                        target="_blank" rel="noopener noreferrer" 
                        className="p-2 text-gray-500 hover:text-green-500 bg-gray-100 hover:bg-green-50 rounded-full transition-colors"
                        title={`WhatsApp ${event.narahubungName || event.organizerName}`}
                        aria-label="Contact via WhatsApp"
                      >
                        <WhatsAppIcon size={18} />
                      </a>
                    )}
                    {event.narahubungEmail && (
                      <a 
                        href={`mailto:${event.narahubungEmail}`} 
                        className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full transition-colors"
                        title={`Email ${event.narahubungName || event.organizerName}`}
                        aria-label="Contact via Email"
                      >
                        <MailIcon size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <hr className="my-6 border-gray-100"/>
            
            <div className="relative w-full">
              <button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="w-full flex items-center justify-center gap-2 text-hegra-turquoise hover:text-hegra-navy font-semibold py-2.5 px-4 border border-hegra-turquoise rounded-lg transition-colors"
                aria-expanded={showShareOptions}
                aria-controls="share-options-menu"
              >
                <Share2 size={18} /> Share This Event
              </button>
              {showShareOptions && (
                <div id="share-options-menu" className="absolute left-0 right-0 bottom-full mb-2 w-full bg-white border rounded-md shadow-lg z-20 p-2 space-y-1">
                  <button onClick={shareActions.copyLink} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <LinkIcon size={16} /> Copy Link
                  </button>
                  <button onClick={shareActions.whatsapp} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <WhatsAppIcon size={16}/> WhatsApp
                  </button>
                  <button onClick={shareActions.facebook} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <Facebook size={16}/> Facebook
                  </button>
                  <button onClick={shareActions.twitter} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <Twitter size={16}/> Twitter
                  </button>
                  <button onClick={shareActions.linkedin} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <Linkedin size={16}/> LinkedIn
                  </button>
                  <button onClick={shareActions.instagram} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <Instagram size={16}/> Instagram
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Full Event Description */}
          <section aria-labelledby="event-description-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 id="event-description-heading" className="text-2xl font-jakarta font-bold text-hegra-navy">Event Description</h2>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors"
                aria-expanded={isDescriptionExpanded}
              >
                {isDescriptionExpanded ? 'Hide' : 'Show More'}
                {isDescriptionExpanded ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
              </button>
            </div>
            <div 
              className={`prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
            />
          </section>

          {/* Business Matching Section with Tabs */}
          <section aria-labelledby="business-matching-heading" className="bg-white p-6 rounded-xl border border-hegra-navy/10">
            <div className="flex items-center gap-3 mb-6">
              <Building2 size={28} className="text-hegra-turquoise" />
              <h2 id="business-matching-heading" className="text-2xl font-jakarta font-bold text-hegra-navy">Business Matching</h2>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === 'buyer'
                    ? 'border-hegra-turquoise text-hegra-turquoise'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users2 size={18} className="inline mr-2" />
                Buyer
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === 'seller'
                    ? 'border-hegra-turquoise text-hegra-turquoise'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 size={18} className="inline mr-2" />
                Seller
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-hegra-turquoise text-hegra-turquoise'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package size={18} className="inline mr-2" />
                Products
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'buyer' && (
              <div>
                <h3 className="text-lg font-semibold text-hegra-navy mb-4">Available Business Partners</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockBusinessCards.map((business) => (
                    <BusinessMatchingCard
                      key={business.id}
                      {...business}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div>
                <h3 className="text-lg font-semibold text-hegra-navy mb-4">Available Exhibitor Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockExhibitorSlots.map((slot) => (
                    <ExhibitorSlot
                      key={slot.id}
                      {...slot}
                      onSelect={handleSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h3 className="text-lg font-semibold text-hegra-navy mb-4">Company Products & Services</h3>
                <p className="text-gray-600 mb-6">Discover products and services from companies participating in this event.</p>
                
                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products or companies..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hegra-turquoise focus:border-transparent"
                    />
                  </div>
                  
                  {/* Company Filter */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Filter by Company:</label>
                    <select
                      value={selectedCompanyFilter}
                      onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hegra-turquoise focus:border-transparent"
                    >
                      <option value="all">All Companies</option>
                      {uniqueCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                    
                    {/* Reset Filters Button */}
                    {(productSearchTerm || selectedCompanyFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setProductSearchTerm('');
                          setSelectedCompanyFilter('all');
                        }}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard
                          image={product.image}
                          title={product.title}
                          price={product.price}
                          sellerName={product.sellerName}
                          location={product.location}
                          onContactSeller={() => handleContactSeller(product.title, product.companyName)}
                        />
                        {/* Company Badge */}
                        <div className="absolute top-2 left-2 bg-hegra-turquoise/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {product.companyName}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">No products found</h4>
                    <p className="text-gray-500">
                      {productSearchTerm || selectedCompanyFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'No products are currently available for this event'
                      }
                    </p>
                  </div>
                )}

                {/* Products Summary */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-hegra-turquoise">{filteredProducts.length}</div>
                      <div className="text-sm text-gray-600">Products Found</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hegra-turquoise">
                        {uniqueCompanies.length}
                      </div>
                      <div className="text-sm text-gray-600">Companies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hegra-turquoise">
                        {mockCompanyProducts.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessEventPage;
