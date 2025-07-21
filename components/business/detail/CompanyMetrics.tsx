
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Award } from 'lucide-react'; // Default icon

interface Metric {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface CompanyMetricsProps {
  metrics: Metric[];
}

const CompanyMetrics: React.FC<CompanyMetricsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <section aria-labelledby="company-metrics-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 id="company-metrics-title" className="sr-only">Metrik Perusahaan</h2>
        <p className="text-sm text-gray-500">Data metrik perusahaan tidak tersedia saat ini.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="company-metrics-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 id="company-metrics-title" className="sr-only">Metrik Utama Perusahaan</h2> {/* Changed to sr-only as cards are self-descriptive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon || Award;
          return (
            <div key={index} className="bg-gradient-to-br from-hegra-turquoise/10 via-hegra-turquoise/5 to-white p-4 rounded-lg border border-hegra-turquoise/20 text-center transition-all duration-300 hover:shadow-md hover:border-hegra-turquoise/30">
              <IconComponent size={26} className="text-hegra-turquoise mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-hegra-deep-navy">{metric.value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{metric.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CompanyMetrics;
