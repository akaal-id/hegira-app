/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageName, EventData } from '../HegiraApp'; // Renamed import

interface HeroSliderProps {
  events: EventData[];
  onNavigate: (page: PageName, data?: any) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ events, onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const AUTOPLAY_INTERVAL = 7000;

  const nextSlide = useCallback(() => {
    if (events.length === 0) return;
    setCurrentSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  }, [events.length]);

  const prevSlide = () => {
    if (events.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    if (events.length === 0) return;
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (events.length <= 1) return () => {}; // No autoplay for 0 or 1 slide
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide, events.length]);

  if (events.length === 0) {
    return (
      <section
        className="my-4 md:my-6 lg:my-8"
        aria-roledescription="carousel"
        aria-label="Promosi Unggulan Hegira"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-hegra-white overflow-hidden rounded-3xl border border-hegra-navy/10">
            <div className="relative w-full aspect-[16/6] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Tidak ada event unggulan saat ini.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const renderSlideContent = (event: EventData) => {
    const displayPosterUrl = event.posterUrl || event.coverImageUrl || 'https://picsum.photos/seed/defaultbanner/1280/480?text=Event+Poster';
    return (
      <div 
        className="w-full h-full relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-hegra-turquoise focus-visible:ring-offset-2 rounded-lg"
        onClick={() => onNavigate('eventDetail', event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('eventDetail', event); }}
        aria-label={`Lihat detail untuk event ${event.name}`}
      >
        <img
          src={displayPosterUrl}
          alt={`Poster untuk ${event.name}`}
          className="w-full h-full object-cover"
          loading={events.indexOf(event) === 0 ? "eager" : "lazy"}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/slidererror/1280/480?text=Error+Loading+Image')}
        />
      </div>
    );
  };

  return (
    <section
      className="my-4 md:my-6 lg:my-8"
      aria-roledescription="carousel"
      aria-label="Promosi Unggulan Hegira"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-hegra-white overflow-hidden rounded-3xl border border-hegra-navy/10">
          <div className="relative w-full aspect-[16/6] bg-gray-200">
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {events.map((event, slideIndex) => (
                <div
                  key={event.id}
                  className={`min-w-full h-full`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${slideIndex + 1} dari ${events.length}: ${event.name}`} // Keep for overall slide context
                  aria-hidden={currentSlide !== slideIndex}
                >
                  {renderSlideContent(event)}
                </div>
              ))}
            </div>

            {events.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full transition-colors focus:outline-none z-20"
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full transition-colors focus:outline-none z-20"
                  aria-label="Slide berikutnya"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ease-in-out
                                  ${currentSlide === index ? 'bg-hegra-turquoise scale-125' : 'bg-white/60 hover:bg-white/90'}`}
                      aria-label={`Ke slide ${index + 1}`}
                      aria-current={currentSlide === index ? "true" : "false"}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;