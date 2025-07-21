/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompanyAboutSectionProps {
  description: string;
  specializations?: string[];
}

const CompanyAboutSection: React.FC<CompanyAboutSectionProps> = ({ description, specializations }) => {
  return (
    <section aria-labelledby="about-company-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 id="about-company-title" className="text-xl font-semibold text-hegra-deep-navy mb-3">
        Tentang Perusahaan
      </h2>
      <div 
        className="prose prose-sm max-w-none text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: description || '<p>Deskripsi perusahaan belum tersedia.</p>' }}
      />

      {specializations && specializations.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-hegra-deep-navy mb-2.5">Spesialisasi & Keunggulan:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {specializations.map((spec, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <CheckCircle size={15} className="text-hegra-turquoise mr-1.5 flex-shrink-0" />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default CompanyAboutSection;