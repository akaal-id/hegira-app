
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  slug: string;
  imageUrl: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  onNavigate: (slug: string) => void; // For navigating to full article page
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  slug,
  imageUrl,
  category,
  title,
  excerpt,
  author,
  date,
  onNavigate,
}) => {
  const categoryColors: { [key: string]: string } = {
    'Tips & Trik': 'bg-hegra-turquoise text-white',
    'Studi Kasus': 'bg-hegra-yellow text-hegra-navy',
    'Wawasan': 'bg-hegra-navy text-white',
    'Berita': 'bg-red-500 text-white', // Example additional category
    'Default': 'bg-gray-500 text-white',
  };

  const categoryStyle = categoryColors[category] || categoryColors['Default'];

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 hover:border-hegra-turquoise/30 overflow-hidden transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-lg"
      role="article"
      aria-labelledby={`article-title-${slug}`}
    >
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <img
          src={imageUrl}
          alt={`Gambar untuk artikel ${title}`}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60&text=Image+Not+Found')}
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow ${categoryStyle}`}
        >
          {category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 
            id={`article-title-${slug}`}
            className="text-lg font-bold font-jakarta text-hegra-deep-navy mb-2 leading-tight group-hover:text-hegra-gradient-start transition-colors cursor-pointer"
            onClick={() => onNavigate(slug)}
        >
            {title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div className="flex items-center">
                <User size={13} className="mr-1.5 text-gray-400" />
                <span>Oleh: {author}</span>
            </div>
            <div className="flex items-center">
                <Calendar size={13} className="mr-1.5 text-gray-400" />
                <span>{date}</span>
            </div>
        </div>

        <button
          onClick={() => onNavigate(slug)}
          className="mt-auto w-full sm:w-auto self-start bg-transparent text-hegra-turquoise font-semibold py-2 px-0 rounded-lg
                     transition-all duration-300
                     flex items-center group/button
                     hover:text-hegra-navy"
          aria-label={`Baca selengkapnya tentang ${title}`}
        >
          Baca Selengkapnya
          <ArrowRight size={16} className="ml-1.5 transition-transform duration-300 group-hover/button:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;