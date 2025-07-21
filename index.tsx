/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import HegiraApp from './HegiraApp'; // Corrected import path

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HegiraApp /> {/* Component name is HegiraApp, matching export */}
    </React.StrictMode>
  );
} else {
  console.error("Root element 'root' not found in the DOM.");
}