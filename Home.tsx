/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { PageName } from './HegiraApp'; // Assuming PageName is in HegiraApp or a types file

// Temporary Home component.
// In a real scenario, if Home.tsx is the GenAI part, it might be conditionally rendered
// or have its own navigation logic within a sub-router.
// For now, this component will simply redirect to the landing page or display a message.

interface HomeProps {
  onNavigate: (page: PageName) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  useEffect(() => {
    // For this iteration, if user lands on 'home', redirect to 'landing'
    // as GenAI features are not the current focus.
    // onNavigate('landing'); 
    // Commenting out direct navigation to allow the message to be shown,
    // actual navigation is handled in HegiraApp.tsx if currentPage is 'home'.
  }, [onNavigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-hegra-navy mb-4">Halaman Beranda (Home)</h1>
      <p className="text-gray-700">
        Ini adalah placeholder untuk halaman utama.
        Fitur Image-to-Code dengan GenAI akan diintegrasikan di sini atau sebagai modul terpisah.
      </p>
      <button 
        onClick={() => onNavigate('landing')}
        className="mt-6 bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Kembali ke Landing Page
      </button>
    </div>
  );
};

export default Home;