import React from 'react';
import { MapPin, Building2, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  sellerName: string;
  location: string;
  onContactSeller: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  sellerName,
  location,
  onContactSeller
}) => {
  return (
    <div className="bg-white rounded-xl border border-hegra-navy/10 hover:border-hegra-turquoise/20 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Product Title */}
        <h3 className="font-semibold text-hegra-deep-navy text-lg leading-tight line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-hegra-yellow">Rp {price}</span>
        </div>
        
        {/* Seller Details */}
        <div className="space-y-2">
          {/* Seller Name */}
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium truncate">{sellerName}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm truncate">{location}</span>
          </div>
        </div>
        
        {/* Contact Seller Button */}
        <button
          onClick={onContactSeller}
          className="w-full bg-teal-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Contact Seller
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
