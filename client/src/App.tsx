import React from 'react';
import './App.css';
import { LeafletMap } from './pages/Map'
import { DataService } from './services/DataService';
import { City } from './interfaces/IDataService';

const App: React.FC = () => {
  const handleClick = (city: City) => {
    console.log(city);
  }

  return (
    <div className="App" style={{width: '100%', height: '100%'}}>
        <LeafletMap onClick={handleClick} dataService={new DataService()}/>
    </div>
  );

  
}

export default App;
