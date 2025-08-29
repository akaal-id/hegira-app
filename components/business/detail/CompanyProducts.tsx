/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import ProductCard from '../ProductCard';

interface Product {
  id: string;
  companyId: number;
  image: string;
  title: string;
  price: string;
  sellerName: string;
  location: string;
}

interface CompanyProductsProps {
  products: Product[];
  companyName: string;
}

const CompanyProducts: React.FC<CompanyProductsProps> = ({ products, companyName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // 3x2 grid
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (!products || products.length === 0) {
    return (
      <section aria-labelledby="products-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 id="products-title" className="text-xl font-semibold text-hegra-deep-navy mb-4">Company Products</h2>
        <div className="flex flex-col items-center justify-center text-gray-400 h-40 bg-gray-50 rounded-md">
          <Package size={32} className="mb-2" />
          <p className="text-sm">No products available yet.</p>
        </div>
      </section>
    );
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleContactSeller = (productTitle: string) => {
    alert(`Contact request sent for ${productTitle} from ${companyName}`);
  };

  return (
    <section aria-labelledby="products-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 id="products-title" className="text-xl font-semibold text-hegra-deep-navy mb-6">
        Company Products
      </h2>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            sellerName={product.sellerName}
            location={product.location}
            onContactSeller={() => handleContactSeller(product.title)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-hegra-turquoise text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </section>
  );
};

export default CompanyProducts;
