import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HegiraApp from '../HegiraApp';

const App: React.FC = () => {
  return (
    <Router>
      <HegiraApp />
    </Router>
  );
};

export default App;
