import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'
import { DataService } from './services/DataService';

const App: React.FC = () => {

  return (
    <div className="App" style={{width: '100%', height: '100%'}}>
        <LeafletMap dataService={new DataService()}/>
    </div>
  );
}

export default App;
