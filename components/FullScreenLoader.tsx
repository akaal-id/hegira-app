/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-hegra-light-bg/95 backdrop-blur-sm">
      <div className="flex space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-hegra-turquoise rounded-full animate-dot-walk delay-0"></div>
        <div className="w-3 h-3 bg-hegra-turquoise rounded-full animate-dot-walk delay-200"></div>
        <div className="w-3 h-3 bg-hegra-turquoise rounded-full animate-dot-walk delay-400"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-hegra-navy">Memuat Halaman...</p>
      <style>
        {`
          @keyframes dot-walk-animation {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          .animate-dot-walk {
            animation: dot-walk-animation 1.4s infinite ease-in-out both;
          }
          .delay-0 { 
            animation-delay: 0s; 
          }
          .delay-200 { 
            animation-delay: 0.2s; 
          }
          .delay-400 { 
            animation-delay: 0.4s; 
          }
        `}
      </style>
    </div>
  );
};

export default FullScreenLoader;