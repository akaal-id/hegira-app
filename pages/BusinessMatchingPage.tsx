/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PageName } from '../HegiraApp';
import { Leaf, Factory, Users, Package, MapPin, Search, Filter, Star, Building2, MapPin as MapPinIcon, DollarSign } from 'lucide-react';
import ProductCard from '../components/business/ProductCard';
import BusinessMatchingCard from '../components/BusinessMatchingCard';
import BusinessEventCard from '../components/business/BusinessEventCard';
import { EventData } from '../HegiraApp';

interface BusinessMatchingPageProps {
  onNavigate: (page: PageName, data?: any) => void;
}

const BusinessMatchingPage: React.FC<BusinessMatchingPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'business' | 'events'>('products');

  // Sample business data based on the image
  const sampleBusinesses = [
    {
      id: 1,
      name: 'PT Digital Innovation Nusantara',
      logoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      matchScore: 95,
      sector: 'Information Technology',
      location: 'South Jakarta, DKI Jakarta',
      budget: 'Rp 50M - Rp 100M',
      specialFeatures: ['Verified', 'Fast Response']
    },
    {
      id: 2,
      name: 'Creative Studio Together',
      logoUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      matchScore: 88,
      sector: 'Creative Industry',
      location: 'Bandung, West Java',
      budget: 'Rp 10M - Rp 50M',
      specialFeatures: ['Strong Portfolio']
    },
    {
      id: 3,
      name: 'Precision Manufacturing Indonesia',
      logoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      matchScore: 92,
      sector: 'Manufacturing',
      location: 'Surabaya, East Java',
      budget: 'Rp 100M - Rp 500M',
      specialFeatures: ['ISO Certified', 'Verified']
    },
    {
      id: 4,
      name: 'Brilliant Education Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      matchScore: 85,
      sector: 'Education',
      location: 'Yogyakarta, DIY',
      budget: 'Rp 5M - Rp 20M',
      specialFeatures: ['Accredited']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Section: Text and Statistics */}
            <div className="space-y-8">
              {/* Top Banner */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                ID Indonesia's Premier B2B Platform
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-700 leading-tight">
                Connecting Indonesian Businesses, from Source to Market
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Discover trusted suppliers, showcase your products, and grow your business through Indonesia's premier B2B marketplace platform.
              </p>
              
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                  Browse Full Catalog
                </button>
                <button className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300">
                  Join as Seller
                </button>
              </div>
              
              {/* Key Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">10K+</div>
                  <div className="text-sm text-gray-600">Active Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">50K+</div>
                  <div className="text-sm text-gray-600">Products Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>
            
            {/* Right Section: Visual Content */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Indonesian business professionals meeting around a traditional wooden table"
                  className="w-full h-full object-cover"
                />
                
                {/* Top Left Overlay Card */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Agriculture</div>
                      <div className="text-sm text-gray-600">2,500+ Products</div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Right Overlay Card */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Factory className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Manufacturing</div>
                      <div className="text-sm text-gray-600">1,800+ Products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                 </div>
               </section>

        {/* Tab Navigation */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'products'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'business'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Business
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Events
              </button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className={`py-16 ${activeTab === 'products' ? 'block' : 'hidden'} bg-gray-50`}>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           {/* Section Header */}
           <div className="mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
               All Products
             </h2>
             <p className="text-lg text-gray-600 max-w-2xl">
               Discover cutting-edge IT solutions and digital services from trusted Indonesian technology companies.
             </p>
           </div>

                       {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

           {/* Filters and Product Grid */}
           <div className="flex flex-col lg:flex-row gap-8">
             {/* Left Sidebar - Filters */}
             <div className="lg:w-64 flex-shrink-0">
               <div className="bg-white rounded-xl border border-hegra-navy/10 p-6">
                                   <div className="mb-6">
                    <h3 className="text-lg font-semibold text-hegra-deep-navy">Filters</h3>
                  </div>
                 
                 {/* Category Filter */}
                 <div className="mb-6">
                   <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                   <div className="space-y-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                       <span className="text-sm text-gray-600">All Categories</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                       <span className="text-sm text-gray-600">Information Technology</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                       <span className="text-sm text-gray-600">Creative Design</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                       <span className="text-sm text-gray-600">Agriculture</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                       <span className="text-sm text-gray-600">Manufacturing</span>
                     </label>
                   </div>
                 </div>

                 {/* Reset Filter Button */}
                 <div className="pt-4 border-t border-gray-100">
                   <button className="w-full bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200">
                     Reset Filter
                   </button>
                 </div>
               </div>
             </div>

             {/* Right Side - Product Grid */}
             <div className="flex-1">
               {/* Product Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 <ProductCard
                   image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Custom Software Development"
                   price="25,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for Custom Software Development')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Data Analytics Platform"
                   price="35,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for Data Analytics Platform')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Cloud Infrastructure Setup"
                   price="45,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for Cloud Infrastructure Setup')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Mobile App Development"
                   price="30,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for Mobile App Development')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="AI Chatbot Solution"
                   price="20,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for AI Chatbot Solution')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Cybersecurity Audit"
                   price="40,000,000"
                   sellerName="PT Digital Innovation Nusantara"
                   location="South Jakarta, DKI Jakarta"
                   onContactSeller={() => console.log('Contact seller for Cybersecurity Audit')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Brand Identity Design"
                   price="15,000,000"
                   sellerName="Creative Studio Together"
                   location="Bandung, West Java"
                   onContactSeller={() => console.log('Contact seller for Brand Identity Design')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Marketing Campaign Design"
                   price="12,000,000"
                   sellerName="Creative Studio Together"
                   location="Bandung, West Java"
                   onContactSeller={() => console.log('Contact seller for Marketing Campaign Design')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="UI/UX Design Services"
                   price="18,000,000"
                   sellerName="Creative Studio Together"
                   location="Bandung, West Java"
                   onContactSeller={() => console.log('Contact seller for UI/UX Design Services')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                   title="Video Production & Editing"
                   price="25,000,000"
                   sellerName="Creative Studio Together"
                   location="Bandung, West Java"
                   onContactSeller={() => console.log('Contact seller for Video Production & Editing')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                   title="Premium Organic Arabica Coffee Beans"
                   price="45.000"
                   sellerName="Kopi Aceh Premium"
                   location="Aceh, Indonesia"
                   onContactSeller={() => console.log('Contact seller for coffee beans')}
                 />
                 <ProductCard
                   image="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                   title="Grade A Indonesian Palm Oil"
                   price="12.500"
                   sellerName="Minyak Sawit Nusantara"
                   location="Sumatra, Indonesia"
                   onContactSeller={() => console.log('Contact seller for palm oil')}
                 />
               </div>

               {/* Pagination */}
               <div className="mt-12 flex items-center justify-center">
                 <nav className="flex items-center space-x-2" aria-label="Pagination">
                   <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                     Previous
                   </button>
                   <button className="px-3 py-2 text-sm font-medium text-white bg-teal-600 border border-teal-600 rounded-md hover:bg-teal-700">
                     1
                   </button>
                   <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                     2
                   </button>
                   <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                     3
                   </button>
                   <span className="px-3 py-2 text-sm text-gray-700">...</span>
                   <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                     8
                   </button>
                   <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                     Next
                   </button>
                 </nav>
               </div>
             </div>
           </div>
                   </div>
        </section>

        {/* Business Section */}
        <section className={`py-16 ${activeTab === 'business' ? 'block' : 'hidden'} bg-gray-50`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
                Business Directory
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover trusted Indonesian businesses across various sectors and connect with verified partners.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Location, Sector..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Filters and Business Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl border border-hegra-navy/10 p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-hegra-deep-navy">Smart Filter</h3>
                  </div>

                  {/* Business Sector Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Business Sector</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" defaultChecked />
                        <span className="text-sm text-gray-600">All Sectors</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Information Technology</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Creative Industry</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Manufacturing</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Education</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Agriculture</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Healthcare</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Financial Services</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Retail</span>
                      </label>
                    </div>
                  </div>

                  {/* Special Features Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Special Features</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Verified</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Fast Response</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Strong Portfolio</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">ISO Certified</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Accredited</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">Large Scale</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-sm text-gray-600">OJK Registered</span>
                      </label>
                    </div>
                  </div>

                  {/* Location Search */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Search Location on Map</h4>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g.: Central Jakarta"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Radius Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Radius Filter: 50 km</h4>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200">
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Business Grid */}
              <div className="flex-1">
                {/* Business Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleBusinesses.map((business) => (
                    <BusinessMatchingCard
                      key={business.id}
                      {...business}
                      onNavigate={onNavigate}
                      onActionClick={() => onNavigate('businessDetail', business)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className={`py-16 ${activeTab === 'events' ? 'block' : 'hidden'} bg-gray-50`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
                B2B Events
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover business networking events, conferences, and workshops to grow your professional network.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample B2B Events */}
              <BusinessEventCard
                id={2}
                category="B2B"
                name="Creator Connect 2025"
                location="Margo City Depok"
                posterUrl="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                coverImageUrl="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80"
                dateDisplay="2025/07/19"
                timeDisplay="09:00 - 17:00"
                timezone="WIB"
                fullDescription="Annual conference for content creators, influencers, and agencies. Networking sessions, workshops, and panel discussions with experts in the digital creative industry."
                ticketCategories={[
                  { id: 'early-bird-creator', name: 'Early Bird Creator Pass', price: 200000, description: 'Access to all sessions, valid until June 30.', availabilityStatus: 'sold-out', useEventSchedule: true, maxQuantity: 100, ticketsPurchased: 100 },
                  { id: 'creator-pass', name: 'Creator Pass', price: 250000, description: 'Access to all conference sessions.', availabilityStatus: 'available', useEventSchedule: false, ticketStartDate: '2025-07-01', ticketEndDate: '2025-07-19', ticketStartTime: '08:00', ticketEndTime: '18:00', ticketIsTimeRange: true, ticketTimezone: 'WIB', maxQuantity: 300, ticketsPurchased: 5 },
                  { id: 'business-pass', name: 'Business Pass', price: 500000, description: 'Access to all sessions + B2B networking area.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 150, ticketsPurchased: 0 }
                ]}
                displayPrice="Mulai Rp 250.000"
                organizerName="Hegira Event Management"
                organizerLogoUrl="/image/hegiralogo.png"
                summary="Networking conference and workshop for content creators & influencers."
                googleMapsQuery="Margo City, Depok"
                parkingAvailable={true}
                ageRestriction="17+"
                arrivalInfo="Registration at Main Atrium Margo City, ground floor."
                status="Active"
                theme="Conference & Workshop"
                address="Jl. Margonda Raya No.358, Kemiri Muka, Kecamatan Beji, Kota Depok, Jawa Barat 16423"
                eventSlug="creator-connect-2025-conference"
                narahubungName="Tim Hegira Events"
                                 narahubungPhone="081211112222"
                 narahubungEmail="events@hegira.com"
                 quotaProgress={25}
                 onNavigate={onNavigate}
               />
              
              <BusinessEventCard
                id={3}
                category="B2G"
                name="Forum Digitalisasi UMKM Nasional"
                location="Hotel Indonesia Kempinski, Jakarta"
                posterUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                coverImageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=450&q=80"
                dateDisplay="2025/08/25 - 2025/08/26"
                timeDisplay="08:30 - 17:00"
                timezone="WIB"
                fullDescription="Forum strategis yang mempertemukan perwakilan pemerintah, pelaku UMKM, dan penyedia teknologi untuk akselerasi transformasi digital UMKM di Indonesia. Diskusi kebijakan, showcase solusi, dan business matching."
                ticketCategories={[
                  { id: 'umkm-delegate', name: 'Delegasi UMKM', price: 0, description: 'Gratis untuk UMKM terpilih (perlu registrasi & seleksi).', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 500, ticketsPurchased: 120 },
                  { id: 'gov-delegate', name: 'Delegasi Pemerintah', price: 0, description: 'Khusus perwakilan instansi pemerintah.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 200, ticketsPurchased: 50 },
                  { id: 'tech-provider', name: 'Penyedia Teknologi/Umum', price: 750000, description: 'Akses ke semua sesi dan area pameran.', availabilityStatus: 'available', useEventSchedule: true, maxQuantity: 100, ticketsPurchased: 30 }
                ]}
                displayPrice="Gratis / Rp 750.000"
                organizerName="Kementerian Koperasi dan UKM & Hegira"
                organizerLogoUrl="https://picsum.photos/seed/kemenkop/50/50"
                summary="Forum pemerintah & UMKM untuk akselerasi transformasi digital."
                googleMapsQuery="Hotel Indonesia Kempinski Jakarta"
                status="Draft"
                theme="Forum & Exhibition"
                address="Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10310"
                eventSlug="forum-digitalisasi-umkm-nasional-2025"
                narahubungName="Sekretariat Forum"
                                 narahubungPhone="0215550011"
                 narahubungEmail="info@forumumkm.go.id"
                 quotaProgress={40}
                 onNavigate={onNavigate}
               />
            </div>
          </div>
        </section>
      </div>
    );
  };

export default BusinessMatchingPage;