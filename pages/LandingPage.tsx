
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import HeroSlider from '../components/HeroSlider';
import EventCard from '../components/EventCard';
import FeatureItem from '../components/FeatureItem'; 
import ArticleCard from '../components/ArticleCard'; 
import BusinessMatchingCard, { BusinessMatchingCardData } from '../components/BusinessMatchingCard';
import { Briefcase, Users, Mail, TrendingUp, Zap, Ticket as TicketIconLucide, BookOpen, Edit3, Users2, BarChart3, PlusCircle, CalendarPlus, Settings, Lightbulb, ShieldCheck, Search, CalendarCheck } from 'lucide-react'; 
import { PageName, EventData } from '../HegiraApp'; 

const sampleArticles = [
  {
    slug: '5-tips-success-hybrid-event',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Tips & Tricks',
    title: '5 Tips for Successfully Organizing an Engaging Hybrid Event',
    excerpt: 'Hybrid events are becoming increasingly popular. Combine physical and virtual experiences with smart strategies for maximum engagement.',
    author: 'Hegira Team',
    date: 'July 15, 2024',
  },
  {
    slug: 'case-study-xyz-concert-hegira',
    imageUrl: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Case Study',
    title: 'Case Study: XYZ Concert Success with Full Hegira Support',
    excerpt: 'How did XYZ Concert successfully sell thousands of tickets and provide an unforgettable experience for its audience? Read the story.',
    author: 'Andini Putri',
    date: 'July 10, 2024',
  },
  {
    slug: 'event-trends-2025-must-know',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Insights',
    title: 'Event Trends 2025: Innovation and Technology That Will Dominate',
    excerpt: 'From AI to sustainability, what trends will shape the event industry in the coming year? Prepare yourself!',
    author: 'Budi Santoso',
    date: 'July 5, 2024',
  },
];

const sampleBusinessMatchingPartners: BusinessMatchingCardData[] = [
  {
    id: 1001,
    name: "Best Event Property Vendor",
    sector: "Event Equipment & Production",
    location: "Jakarta & Surroundings",
    budget: "Flexible, Starting from Rp 5 Million",
    matchScore: 4.8,
    specialFeatures: ["Guaranteed Quality", "Extensive Experience", "Fast Response"],
    logoUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=FFA500&sat=-100&bri=0&bm=multiply",
  },
  {
    id: 1002,
    name: "National Brand Sponsorship",
    sector: "Corporate & Media Sponsor",
    location: "All Indonesia",
    budget: "Starting from Rp 50 Million per Event",
    matchScore: 4.5,
    specialFeatures: ["National Reach", "Strong Brand Image", "Creative Activation"],
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=4B998E&sat=-100&bri=0&bm=multiply",
  },
  {
    id: 1003,
    name: "Venture & Angel Investor",
    sector: "Investment & Early Funding",
    location: "Southeast Asia",
    budget: "Seed & Series A Funding",
    matchScore: 4.2,
    specialFeatures: ["Strategic Funding", "Extensive Network", "Mentorship"],
    logoUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80&blend=18093B&sat=-100&bri=0&bm=multiply",
  },
];


const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [elements, setElements] = React.useState<HTMLElement[]>([]);
  const observer = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (elements.length === 0) return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    elements.forEach(element => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [elements, options]);

  return setElements;
};


interface LandingPageProps {
  heroEvents: EventData[]; 
  featuredEvents: EventData[];
  onNavigate: (page: PageName, data?: any) => void;
  onOpenLoginModal?: () => void; 
  openSubscriptionModal: () => void; 
}

const LandingPage: React.FC<LandingPageProps> = ({ heroEvents, featuredEvents, onNavigate, onOpenLoginModal, openSubscriptionModal }) => {
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const validRefs = sectionRefs.current.filter(el => el !== null) as HTMLElement[];
    setObservedElements(validRefs);
  }, [setObservedElements]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert(`Thank you! Email ${emailInput.value} has been registered for Hegira newsletter.`);
      emailInput.value = ''; // Clear input
    } else {
      alert('Please enter your email address.');
    }
  };

  return (
    <>
      {/* Section 1: Hero Slider */}
      <HeroSlider events={heroEvents} onNavigate={onNavigate} />

      {/* Section 2: Temukan Event Menarik */}
      <section id="events" className="py-16 md:py-24 bg-hegra-card-bg animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-0 sm:px-6 lg:px-8"> {/* Adjusted padding for full-bleed scroll */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16  px-4 sm:px-0"> {/* Padding for title section */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy text-center md:text-left">Discover <span className="text-gradient">Exciting</span> Events</h2>
              <p className="text-neutral-700 mt-2 text-center md:text-left">Explore the latest and most popular events.</p>
            </div>
            <button 
              onClick={() => onNavigate('events')} 
              className="mt-4 md:mt-0 text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center"
            >
              View All Events <TrendingUp size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {/* Horizontal Scroll Container for Event Cards */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8"> {/* Negative margins for full bleed effect */}
            <div className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 py-4 px-4 sm:px-6 lg:px-8 horizontal-event-scroll">
              {featuredEvents.length > 0 ? featuredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="flex-shrink-0 w-[90%] xs:w-[80%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                >
                  <EventCard {...event} posterUrl={event.posterUrl || event.coverImageUrl} onNavigate={onNavigate} />
                </div>
              )) : (
                 <div className="w-full text-center py-10 px-4">
                    <p className="text-gray-500">No featured events available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: About Hegira - Reconstructed */}
      <section id="about-hegira" className="py-16 md:py-24 bg-hegra-chino/20 animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="bg-hegra-turquoise/20 text-hegra-turquoise font-semibold px-4 py-1.5 rounded-full text-xs inline-block">
              ABOUT US
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta text-hegra-deep-navy mb-8">
            What is <span className="text-hegra-turquoise">Hegira?</span>
          </h2>
          
          <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 mb-12 text-gray-700 text-base md:text-lg leading-relaxed space-y-4 md:space-y-0">
            <p>
              Hegira is an integrated event platform designed to revolutionize how you discover, manage, and enjoy various events. We believe that every event is an opportunity—to learn, grow, network, and create memories.
            </p>
            <p>
              Our mission is to empower event organizers with intuitive and comprehensive tools, while providing a seamless and enjoyable experience for participants. From grand music concerts to intimate business workshops, Hegira is here for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12 md:mb-16">
            <FeatureItem
              icon={TicketIconLucide}
              title="Integrated Tickets"
              description="Buy and sell tickets for various types of events (B2C, B2B, B2G) easily, safely, and quickly."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users}
              title="Wide Reach"
              description="Find a wider audience for your events or explore thousands of exciting events across Indonesia."
              iconBgClass="bg-hegra-yellow/20"
              iconColorClass="text-hegra-yellow"
            />
            <FeatureItem
              icon={Briefcase}
              title="Easy Event Management"
              description="Complete tools for event creators to professionally manage ticket sales, promotions, and analytics."
              iconBgClass="bg-hegra-chino/20"
              iconColorClass="text-hegra-chino"
            />
          </div>

          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hegira - Connecting Visions and Solutions"
            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      </section>
      
      {/* Section 4: Buat Event Anda */}
      <section id="create-your-event" className="py-16 md:py-24 bg-hegra-white animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Create Your <span className="text-gradient">Dream Event</span>
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              Hegira provides a complete platform to help you plan, promote, and manage events successfully. From concerts, seminars, to workshops, everything becomes easier.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            <FeatureItem
              icon={Edit3}
              title="Easy Event Creation"
              description="Create and customize your event page quickly and intuitively."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={TicketIconLucide}
              title="Advanced Ticket Management"
              description="Set various ticket categories, prices, quotas, and promo codes."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={BarChart3} 
              title="Deep Analytics" 
              description="Monitor sales performance, participant demographics, and other important data."
              iconBgClass="bg-hegra-turquoise/20" 
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Lightbulb}
              title="Smart Promotion"
              description="Leverage integrated promotion features to reach the right audience."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={ShieldCheck}
              title="Secure Payment"
              description="Safe and trusted payment system with various method options."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users2}
              title="Participant Management"
              description="Manage participant data, check-in, and communication easily."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Briefcase}
              title="Business Matching Tools"
              description="Facilitate networking and business meetings between participants or sponsors (B2B/B2G)."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Settings}
              title="Page Customization"
              description="Customize your event page appearance to match your brand."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
          </div>
          <div className="text-center">
            <button 
              onClick={() => onNavigate('createEventInfo')} 
              className="bg-hegra-yellow text-hegra-navy font-bold py-3.5 px-8 rounded-lg text-lg 
                         hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg 
                         inline-flex items-center gap-2.5"
            >
              <PlusCircle size={22} /> Start Creating Your Event
            </button>
          </div>
        </div>
      </section>

      {/* Section 5: Business Matching */}
      <section id="business-matching" className="py-16 md:py-24 bg-hegra-chino/20 animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Find <span className="text-gradient">Business Connections</span> Potential
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
              Expand your network, find vendors, strategic partners, or investors for your events and business through Hegira's Business Matching platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {sampleBusinessMatchingPartners.map((partner) => (
              <BusinessMatchingCard
                key={partner.id}
                {...partner}
                onNavigate={onNavigate} // For general navigation if not overridden
                onActionClick={() => onNavigate('business')} // Redirect to business matching page
              />
            ))}
          </div>
          <div className="text-center">
            <button 
              onClick={() => onNavigate('business')} // Redirect to business matching page
              className="bg-hegra-turquoise text-white font-bold py-3.5 px-8 rounded-lg text-lg
                         hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg 
                         inline-flex items-center gap-2.5"
            >
              <Briefcase size={22} /> Explore Business Matching Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Articles & Insights */}
      <section id="articles" className="py-16 md:py-24 bg-hegra-white  animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-hegra-deep-navy">
              Articles & <span className="text-gradient">Insights</span> Latest
            </h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Get the latest tips, trends, and case studies about the world of events and business matching.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {sampleArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} onNavigate={(slug) => onNavigate('articlesPage', { articleSlug: slug })} />
            ))}
          </div>
          <div className="text-center">
            <button 
              onClick={() => onNavigate('articlesPage')}
              className="text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center mx-auto"
            >
              View All Articles <BookOpen size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 7: Call to Action / Newsletter */}
      <section id="newsletter" className="py-16 md:py-24 bg-gradient-to-r from-hegra-turquoise to-hegra-yellow animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap size={48} className="mx-auto mb-4 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold font-jakarta text-hegra-white mb-4">
            Don't Miss the Latest Updates from Hegira!
          </h2>
          <p className="text-lg text-hegra-light-bg/90 mb-8 max-w-xl mx-auto">
            Register your email to get the latest event information, special promotions, and exclusive tips.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
            <input
              type="email"
              id="newsletter-email"
              name="email"
              required
              placeholder="Enter your email address..."
              className="flex-grow py-3 px-4 rounded-lg border border-transparent 
                         focus:ring-2 focus:ring-hegra-navy focus:border-hegra-navy 
                         text-base shadow-md text-hegra-deep-navy"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="bg-hegra-navy text-white font-semibold py-3 px-6 rounded-lg 
                         hover:bg-opacity-90 transition-colors shadow-md
                         transform hover:scale-105"
            >
              <Mail size={20} className="inline mr-2 -mt-0.5" /> Register Now
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LandingPage;