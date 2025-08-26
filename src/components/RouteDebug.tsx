import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const RouteDebug: React.FC = () => {
  const location = useLocation();
  const params = useParams();

  return (
    <div className="fixed top-0 left-0 z-50 bg-black text-white p-2 text-xs font-mono">
      <div>Path: {location.pathname}</div>
      <div>Params: {JSON.stringify(params)}</div>
    </div>
  );
};

export default RouteDebug;
