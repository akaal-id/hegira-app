/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center">
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Asia Karya Lumina. Semua Hak Dilindungi.
      </p>
    </footer>
  );
};

export default DashboardFooter;