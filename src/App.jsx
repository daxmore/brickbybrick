import React from 'react';
import { useProject } from './context/ProjectContext';
import Dashboard from './pages/Dashboard';
import BlankCanvas from './pages/BlankCanvas';

function App() {
  const { activeView } = useProject();

  return (
    <div className="app-container">
      {activeView === 'dashboard' && <Dashboard />}
      {activeView === 'canvas' && <BlankCanvas />}
      {activeView === 'template' && <BlankCanvas />} {/* Templates also use the canvas but with preset data */}
    </div>
  );
}

export default App;
