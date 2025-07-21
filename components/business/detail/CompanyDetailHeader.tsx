
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';

interface CompanyDetailHeaderProps {
  bannerImageUrl?: string;
  logoUrl?: string;
  companyName: string;
  rating?: number; 
  onBack: () => void;
}

const CompanyDetailHeader: React.FC<CompanyDetailHeaderProps> = ({
  bannerImageUrl,
  logoUrl,
  companyName,
  rating,
  onBack,
}) => {
  const defaultBanner = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400&q=80";
  const displayBanner = bannerImageUrl || defaultBanner;

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="w-full h-48 md:h-60 lg:h-72 bg-cover bg-center" style={{ backgroundImage: `url(${displayBanner})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 md:-mt-20 lg:-mt-24">
          <button
            onClick={onBack}
            className="absolute top-0 left-0 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 flex items-center text-sm text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-lg transition-colors group backdrop-blur-sm"
            aria-label="Kembali ke daftar bisnis"
          >
            <ArrowLeft size={18} className="mr-1.5 transform transition-transform group-hover:-translate-x-0.5" />
            Kembali
          </button>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 md:gap-6 pt-4">
            {logoUrl && (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                <img 
                    src={logoUrl} 
                    alt={`${companyName} logo`} 
                    className="w-full h-full object-contain p-1" 
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150/F0F3F7/8D94A8?text=Logo')}
                />
              </div>
            )}
            <div className="pb-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-hegra-deep-navy bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm inline-block">{companyName}</h1>
              {rating !== undefined && (
                <div className="flex items-center mt-1.5 justify-center sm:justify-start bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm max-w-fit mx-auto sm:mx-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(rating) ? 'text-hegra-yellow' : 'text-gray-300'}
                      fill={i < Math.round(rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-1.5 text-xs text-hegra-deep-navy font-medium">({rating.toFixed(1)} dari 5)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailHeader;
