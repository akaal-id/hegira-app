
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PageName } from '../../HegiraApp';
import { BusinessMatchingCardData } from '../../components/BusinessMatchingCard';
import CompanyDetailHeader from '../../components/business/detail/CompanyDetailHeader';
import CompanyMetrics from '../../components/business/detail/CompanyMetrics';
import CompanyAboutSection from '../../components/business/detail/CompanyAboutSection';
import CompanyProducts from '../../components/business/detail/CompanyProducts';
import CompanyReviews from '../../components/business/detail/CompanyReviews';
import StickyActionSidebar from '../../components/business/detail/StickyActionSidebar';
import MeetingSchedulerModal from '../../components/business/MeetingSchedulerModal';
import { Briefcase, MapPin, DollarSign, Users, BarChart3, Heart, Award, CalendarCheck, MessageSquare, Send } from 'lucide-react';

// Dummy data for products that can be linked to companies
const dummyProducts = [
  // PT Digital Innovation Nusantara Products (ID: 1)
  {
    id: 'prod_001',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Custom Software Development',
    price: '25,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },
  {
    id: 'prod_002',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Data Analytics Platform',
    price: '35,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },
  {
    id: 'prod_003',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Cloud Infrastructure Setup',
    price: '45,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },
  {
    id: 'prod_004',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Mobile App Development',
    price: '30,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },
  {
    id: 'prod_005',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'AI Chatbot Solution',
    price: '20,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },
  {
    id: 'prod_006',
    companyId: 1,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Cybersecurity Audit',
    price: '40,000,000',
    sellerName: 'PT Digital Innovation Nusantara',
    location: 'South Jakarta, DKI Jakarta'
  },

  // Creative Studio Together Products (ID: 2)
  {
    id: 'prod_007',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Brand Identity Design',
    price: '15,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },
  {
    id: 'prod_008',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Marketing Campaign Design',
    price: '12,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },
  {
    id: 'prod_009',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'UI/UX Design Services',
    price: '18,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },
  {
    id: 'prod_010',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Video Production & Editing',
    price: '25,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },
  {
    id: 'prod_011',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Social Media Content Package',
    price: '8,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },
  {
    id: 'prod_012',
    companyId: 2,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Print Design Services',
    price: '10,000,000',
    sellerName: 'Creative Studio Together',
    location: 'Bandung, West Java'
  },

  // Precision Manufacturing Indonesia Products (ID: 3)
  {
    id: 'prod_013',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Custom Metal Fabrication',
    price: '150,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },
  {
    id: 'prod_014',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Industrial Equipment Manufacturing',
    price: '250,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },
  {
    id: 'prod_015',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Precision CNC Machining',
    price: '180,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },
  {
    id: 'prod_016',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Quality Control Services',
    price: '75,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },
  {
    id: 'prod_017',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Supply Chain Management',
    price: '120,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },
  {
    id: 'prod_018',
    companyId: 3,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Custom Tooling Solutions',
    price: '200,000,000',
    sellerName: 'Precision Manufacturing Indonesia',
    location: 'Surabaya, East Java'
  },

  // Brilliant Education Solutions Products (ID: 4)
  {
    id: 'prod_019',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Corporate Training Programs',
    price: '12,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  },
  {
    id: 'prod_020',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Online Learning Platform',
    price: '18,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  },
  {
    id: 'prod_021',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Leadership Development Course',
    price: '15,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  },
  {
    id: 'prod_022',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Skills Assessment Tools',
    price: '8,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  },
  {
    id: 'prod_023',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Educational Content Creation',
    price: '10,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  },
  {
    id: 'prod_024',
    companyId: 4,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    title: 'Student Performance Analytics',
    price: '14,000,000',
    sellerName: 'Brilliant Education Solutions',
    location: 'Yogyakarta, DIY'
  }
];

// Sample detailed data for a company (PT Digital Innovation Nusantara)
const ptDigitalInnovationData: BusinessMatchingCardData = {
  id: 1,
  name: 'PT Digital Innovation Nusantara',
  logoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', // Example logo
  matchScore: 4.7, 
  sector: 'Information Technology',
  location: 'South Jakarta, DKI Jakarta',
  budget: 'Rp 50M - Rp 100M',
  lat: -6.1751, 
  lng: 106.8650,
  isOnline: true,
  specialFeatures: ['Professional Team', 'Extensive Portfolio', 'Fast Response', 'Latest Technology'],
  description: `PT Digital Innovation Nusantara is a leading technology company dedicated to delivering innovative digital solutions for businesses across Indonesia. With a team of experienced developers, designers, and technology consultants, we specialize in custom software development, data analytics, cloud infrastructure, and emerging technologies like AI and machine learning.<br/><br/>
                Our focus is on creating scalable, secure, and user-friendly solutions that drive business growth and digital transformation. We believe in building long-term partnerships with our clients, understanding their unique challenges, and delivering solutions that exceed expectations.`,
  keyMetrics: [
    { label: "Projects Completed", value: "200+", icon: Briefcase },
    { label: "Corporate Clients Served", value: "80+", icon: Users },
    { label: "Client Satisfaction Rating", value: "4.8/5", icon: Heart },
    { label: "Team Members", value: "50+", icon: BarChart3 },
  ],
  portfolio: [
    { title: "E-Commerce Platform for Retail Chain", description: "Custom e-commerce solution with inventory management, payment gateway integration, and analytics dashboard for a major Indonesian retail chain.", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Data Analytics Dashboard for Manufacturing", description: "Real-time data visualization and analytics platform for manufacturing operations, helping optimize production efficiency.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Cloud Migration for Financial Services", description: "Secure cloud infrastructure migration for a financial services company, ensuring compliance and scalability.", imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
    { title: "Mobile Banking App", description: "Cross-platform mobile banking application with biometric authentication and real-time transaction monitoring.", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" },
  ],
  reviews: [
    { author: "PT Retail Indonesia", rating: 5, comment: "Excellent team and delivery! Our e-commerce platform exceeded all expectations.", date: "July 15, 2024" },
    { author: "Bank Digital Nusantara", rating: 4, comment: "Professional service and on-time delivery. The mobile app is performing excellently.", date: "June 10, 2024" },
    { author: "Manufacturing Corp", rating: 5, comment: "The analytics dashboard has transformed our operations. Highly recommended!", date: "May 20, 2024" },
    { author: "Tech Startup Indonesia", rating: 4, comment: "Great technical expertise and responsive team. Delivered quality solutions.", date: "April 1, 2024" },
  ],
  contact: {
    phone: "+62 21 555 0101",
    email: "info@digitalinnovation.co.id",
    website: "https://www.digitalinnovation.co.id",
  },
   availability: [
    { day: "Monday", slots: ["09:00", "10:00", "14:00"] },
    { day: "Tuesday", slots: ["10:00", "11:00", "15:00"] },
    { day: "Wednesday", slots: ["09:30", "13:30", "15:30"] },
    { day: "Thursday", slots: ["10:00", "14:00"] },
    { day: "Friday", slots: ["09:00", "11:00", "13:00"] },
  ],
};

// Function to get products for a specific company
const getCompanyProducts = (companyId: number) => {
  return dummyProducts.filter(product => product.companyId === companyId);
};

interface CompanyDetailPageProps {
  company: BusinessMatchingCardData; 
  onNavigate: (page: PageName, data?: any) => void;
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ company = ptDigitalInnovationData, onNavigate }) => {
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [schedulingForVendor, setSchedulingForVendor] = useState<string | null>(null);

  const handleOpenMeetingScheduler = (vendorName: string) => {
    setSchedulingForVendor(vendorName);
    setIsMeetingModalOpen(true);
  };

  const handleMeetingScheduled = (details: {vendorName: string, date: Date, timeSlot: string, duration: string, type: string, agenda: string}) => {
    alert(`Meeting request for ${details.vendorName} on ${details.date.toLocaleDateString('en-US',{day:'2-digit', month:'long', year:'numeric'})} slot ${details.timeSlot} has been sent!\nDuration: ${details.duration}\nType: ${details.type}\nAgenda: ${details.agenda}`);
    setIsMeetingModalOpen(false);
    setSchedulingForVendor(null);
  };
  
  const handleCollaborationSubmit = (formData: { projectIdea: string; budget: string }) => {
    alert(`Collaboration interest sent:\nProject Idea: ${formData.projectIdea}\nBudget Estimate: ${formData.budget || 'Not determined yet'}`);
  };

  // Get products for the current company
  const companyProducts = getCompanyProducts(company.id);

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-0"> {/* Padding bottom for mobile sticky bar */}
      <CompanyDetailHeader
        bannerImageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=500&q=80" // Generic banner for detail page
        logoUrl={company.logoUrl}
        companyName={company.name}
        rating={company.matchScore} 
        onBack={() => {
          // Clear the selected business when going back
          onNavigate('business', null);
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Main Content (Left Column on Desktop) */}
          <div className="lg:w-[calc(100%-24rem-2rem)] xl:w-[calc(100%-26rem-2rem)] space-y-8 mb-8 lg:mb-0"> {/* Adjust width based on sidebar */}
            <CompanyMetrics metrics={company.keyMetrics || []} />
            <CompanyAboutSection 
              description={company.description || "Company description not available."}
              specializations={company.specialFeatures || ["Professional Services"]}
            />
            <CompanyProducts products={companyProducts} companyName={company.name} />
            <CompanyReviews reviews={company.reviews || []} />
          </div>

          {/* Sticky Sidebar (Right Column on Desktop) */}
          <div className="lg:w-96 xl:w-[26rem] flex-shrink-0"> {/* Fixed width for sidebar */}
            <StickyActionSidebar
              companyName={company.name}
              contactInfo={company.contact}
              availability={company.availability} 
              onOpenMeetingScheduler={() => handleOpenMeetingScheduler(company.name)}
              onCollaborationSubmit={handleCollaborationSubmit}
            />
          </div>
        </div>
      </div>

      {isMeetingModalOpen && schedulingForVendor && (
        <MeetingSchedulerModal
          isOpen={isMeetingModalOpen}
          onClose={() => { setIsMeetingModalOpen(false); setSchedulingForVendor(null); }}
          vendorName={schedulingForVendor}
          onSchedule={handleMeetingScheduled}
        />
      )}
    </div>
  );
};

export default CompanyDetailPage;
