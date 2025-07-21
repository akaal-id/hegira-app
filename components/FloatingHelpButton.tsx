/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Mail, MessageCircle, Info, X } from 'lucide-react';
import { PageName } from '../HegiraApp';

interface FloatingHelpButtonProps {
  onNavigate: (page: PageName) => void;
}

const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents click from immediately closing if click lands on main button again
    setIsOpen(!isOpen);
  };

  const subButtons = [
    {
      label: 'Bantuan',
      icon: HelpCircle,
      action: () => { onNavigate('help'); setIsOpen(false); },
      bgColor: 'bg-hegra-turquoise',
      textColor: 'text-white',
    },
    {
      label: 'Email Kami',
      icon: Mail,
      action: () => { window.location.href = 'mailto:support@hegra.com?subject=Bantuan%20Hegra'; setIsOpen(false); },
      bgColor: 'bg-red-500',
      textColor: 'text-white',
    },
    {
      label: 'WhatsApp Kami',
      icon: MessageCircle,
      action: () => { window.open('https://wa.me/6281234567890?text=Halo%20Hegra,%20saya%20butuh%20bantuan.', '_blank'); setIsOpen(false); },
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
  ];

  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-[999]">
      {/* Sub Buttons Area */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end space-y-2">
          {subButtons.map((btn, index) => (
            <div
              key={btn.label}
              className="flex items-center justify-end group cursor-pointer"
              onClick={btn.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') btn.action();}}
              aria-label={btn.label}
            >
              <span
                className={`text-sm ${btn.textColor} ${btn.bgColor} px-3 py-1.5 rounded-l-full shadow-md
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform
                           translate-x-4 group-hover:translate-x-0 whitespace-nowrap`}
                style={{ transitionDelay: `${index * 50}ms`}} // Staggered appearance on hover can be tricky with pure tailwind
              >
                {btn.label}
              </span>
              <button
                className={`${btn.bgColor} ${btn.textColor} w-12 h-12 rounded-full flex items-center justify-center
                           shadow-lg hover:opacity-90 transition-all duration-300 transform
                           hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
                style={{
                    transform: `translateY(${(subButtons.length - 1 - index) * -5}px) scale(0)`, // Start scaled down
                    animation: `fab-item-appear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 75}ms forwards`
                }}
              >
                <btn.icon size={22} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleOpen}
        className="w-16 h-16 bg-hegra-navy text-white rounded-full flex items-center justify-center
                   shadow-xl hover:bg-hegra-turquoise focus:outline-none focus:ring-2
                   focus:ring-offset-2 focus:ring-hegra-yellow transition-all duration-300 ease-in-out transform hover:scale-110"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="fab-menu"
        aria-label={isOpen ? "Tutup menu bantuan" : "Buka menu bantuan"}
      >
        {isOpen ? <X size={28} className="transition-transform duration-300 rotate-0" /> : <Info size={28} className="transition-transform duration-300 rotate-0" />}
      </button>
      <div id="fab-menu" role="menu"></div>

      <style>{`
        @keyframes fab-item-appear {
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .fab-sub-button-enter {
          opacity: 0;
          transform: translateY(20px) scale(0.5);
        }
        .fab-sub-button-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .fab-sub-button-exit {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .fab-sub-button-exit-active {
          opacity: 0;
          transform: translateY(20px) scale(0.5);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
};

export default FloatingHelpButton;