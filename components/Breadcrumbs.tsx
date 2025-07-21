/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageName } from '../HegiraApp'; // Renamed import

interface BreadcrumbsProps {
  eventName: string;
  onNavigate: (page: PageName) => void; // This will trigger confirmation logic in EventDetailPage
}

const BreadcrumbItem: React.FC<{ children: React.ReactNode; isCurrent?: boolean; onClick?: () => void }> = ({ children, isCurrent, onClick }) => {
  if (isCurrent) {
    return (
      <span className="text-sm font-medium text-gray-500" aria-current="page">
        {children}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-gray-700 hover:text-hegra-turquoise transition-colors flex items-center gap-1"
    >
      {children}
    </button>
  );
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ eventName, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2">
        <li>
          <BreadcrumbItem onClick={() => onNavigate('landing')}>
            <Home size={16} className="mr-1.5 flex-shrink-0" />
            Beranda
          </BreadcrumbItem>
        </li>
        <li>
          <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
        </li>
        <li>
          <BreadcrumbItem onClick={() => onNavigate('events')}>
            Event
          </BreadcrumbItem>
        </li>
        <li>
          <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
        </li>
        <li>
          <BreadcrumbItem isCurrent>{eventName}</BreadcrumbItem>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;