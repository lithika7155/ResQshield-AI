import React from 'react';
import ResQShieldDashboard from './pages/ResQShieldDashboard';
import { MissionProvider } from './context/MissionContext';
import './index.css';

export default function App() {
  return (
    <MissionProvider>
      <ResQShieldDashboard />
    </MissionProvider>
  );
}
