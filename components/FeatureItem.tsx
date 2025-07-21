
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBgClass: string;
  iconColorClass: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description, iconBgClass, iconColorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow duration-300">
    <div className={`p-3 rounded-full ${iconBgClass} mb-4 inline-block`}>
      <Icon size={28} className={iconColorClass} />
    </div>
    <h3 className="text-lg font-semibold font-jakarta text-hegra-deep-navy mb-2">{title}</h3>
    <p className="text-xs text-gray-600 flex-grow leading-relaxed">{description}</p>
  </div>
);

export default FeatureItem;