import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'

const App: React.FC = () => {
  return (
    <div className="App" style={{width: '100%', height: '100%'}}>
        <LeafletMap />
    </div>
  );
}

export default App;
