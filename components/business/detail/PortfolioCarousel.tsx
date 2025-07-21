/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  imageUrl: string;
}

interface PortfolioCarouselProps {
  projects: Project[];
}

const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!projects || projects.length === 0) {
    return (
         <section aria-labelledby="portfolio-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 id="portfolio-title" className="text-xl font-semibold text-hegra-deep-navy mb-4">Portofolio Proyek</h2>
            <div className="flex flex-col items-center justify-center text-gray-400 h-40 bg-gray-50 rounded-md">
                <ImageIcon size={32} className="mb-2" />
                <p className="text-sm">Portofolio proyek belum tersedia.</p>
            </div>
        </section>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? projects.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === projects.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const currentProject = projects[currentIndex];

  return (
    <section aria-labelledby="portfolio-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 id="portfolio-title" className="text-xl font-semibold text-hegra-deep-navy mb-4">
        Portofolio Proyek Unggulan
      </h2>
      <div className="relative group">
        {/* Image Container */}
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 mb-3 relative shadow">
          <img 
            src={currentProject.imageUrl} 
            alt={currentProject.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x450/E0E0E0/BDBDBD?text=Image+Error')}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
             <h3 className="text-md font-semibold text-white line-clamp-1">{currentProject.title}</h3>
             <p className="text-xs text-white/80 line-clamp-2">{currentProject.description}</p>
           </div>
        </div>
        
        {/* Static title and description below image - provides context even without hover */}
        <h3 className="text-md font-semibold text-hegra-deep-navy/90 mt-3 mb-1 line-clamp-1" title={currentProject.title}>{currentProject.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[2.5rem]">{currentProject.description}</p>


        {projects.length > 1 && (
            <>
            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-2 -translate-y-1/2 transform bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                aria-label="Proyek Sebelumnya"
                style={{ top: 'calc(50% - 2.5rem)' }} 
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                aria-label="Proyek Berikutnya"
                style={{ top: 'calc(50% - 2.5rem)' }}
            >
                <ChevronRight size={18} />
            </button>
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-1.5 mt-2">
                {projects.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300
                    ${ currentIndex === index ? 'bg-hegra-turquoise scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Lihat proyek ${index + 1}`}
                />
                ))}
            </div>
            </>
        )}
      </div>
    </section>
  );
};

export default PortfolioCarousel;