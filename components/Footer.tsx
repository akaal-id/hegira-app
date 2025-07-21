
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { PageName } from '../HegiraApp'; // Renamed import

interface FooterProps {
  onNavigate: (page: PageName) => void;
  currentPage: PageName; // Added to handle conditional margin for sticky footers
}

const Footer: React.FC<FooterProps> = ({ onNavigate, currentPage }) => {
  const quickLinks = [
    { name: 'Tentang Hegira', target: 'landing' as PageName },
    { name: 'Pusat Bantuan', target: 'help' as PageName },
    { name: 'Event Terbaru', target: 'events' as PageName },
    { name: 'Business Matching', target: 'business' as PageName },
  ];

  const legalLinks = [
    { name: 'Syarat & Ketentuan', href: '#' },
    { name: 'Kebijakan Privasi', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  const socialMedia = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Youtube', href: '#', icon: Youtube },
  ];

  const pagesWithStickyMobileFooters: PageName[] = ['eventDetail', 'checkout', 'transactionSuccess'];
  const needsMobileMargin = pagesWithStickyMobileFooters.includes(currentPage);

  let mobileMarginClass = '';
  if (needsMobileMargin) {
    if (currentPage === 'eventDetail') mobileMarginClass = 'mb-20'; // Approx 5rem for EventDetailPage sticky bar
    else if (currentPage === 'checkout') mobileMarginClass = 'mb-28'; // Approx 7rem for CheckoutPage sticky bar
    else if (currentPage === 'transactionSuccess') mobileMarginClass = 'mb-32'; // Approx 8rem for TransactionSuccessPage sticky bar
  }
  
  const footerBaseClasses = "bg-hegra-turquoise text-hegra-deep-navy pt-16 pb-8";

  return (
    <footer className={`${footerBaseClasses} ${needsMobileMargin ? mobileMarginClass : ''} md:mb-0`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-4 md:gap-x-8 lg:gap-x-10 mb-12">
          {/* Section 1: Logo, About, Social Media (Full width on mobile, 1st column on desktop) */}
          <div className="space-y-4 mb-10 md:mb-0 md:col-span-1">
            <button 
              onClick={() => onNavigate('landing')} 
              className="inline-block focus:outline-none mb-2" 
              aria-label="Hegira Beranda"
            >
              <Logo className="h-10 w-auto text-hegra-white" useGradient={true} />
            </button>
            <p className="text-sm leading-relaxed text-hegra-white">
              Platform terintegrasi untuk event dan ticketing. Menghubungkan peluang, menciptakan pengalaman.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialMedia.map(social => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Hegira di ${social.name}`}
                  className="text-hegra-white hover:text-hegra-yellow transition-colors duration-300 transform hover:scale-110"
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Links (Navigasi, Legal, Hubungi Kami) 
              Mobile: 2-column grid. 
              Desktop: Spans 3 columns, with each link section as a column within that.
          */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:col-span-3 md:grid-cols-3">
            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold font-jakarta text-hegra-yellow mb-5">Navigasi</h5>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => link.target && onNavigate(link.target)} 
                      className="text-sm text-hegra-white hover:underline transition-colors duration-300"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h5 className="text-lg font-semibold font-jakarta text-hegra-yellow mb-5">Legal & Bantuan</h5>
              <ul className="space-y-3">
                {legalLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-hegra-white hover:underline transition-colors duration-300">
                      {link.name}
                    </a>
                  </li>
                ))}
                 <li>
                    <button 
                      onClick={() => onNavigate('help')} 
                      className="text-sm text-hegra-white hover:underline transition-colors duration-300"
                    >
                      FAQ
                    </button>
                  </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="text-lg font-semibold font-jakarta text-hegra-yellow mb-5">Hubungi Kami</h5>
              <ul className="space-y-3 text-sm text-hegra-white">
                <li className="flex items-start">
                  <Mail size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" />
                  <a href="mailto:asiakaryalumina@gmail.com" className="hover:underline transition-colors">asiakaryalumina@gmail.com</a>
                </li>
                <li className="flex items-start">
                  <Phone size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" />
                  <a href="tel:+622112345678" className="hover:underline transition-colors">+62 21 1234 5678</a>
                </li>
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-1 text-hegra-white flex-shrink-0" />
                  <span>Jl. Sudirman No.1, Jakarta Pusat, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-hegra-white/30 pt-8 mt-8 text-center text-sm text-hegra-white">
          <p>&copy; 2025 asia karya lumina. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;