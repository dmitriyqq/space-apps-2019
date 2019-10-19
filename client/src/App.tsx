import React from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleExample from './pages/map'

const App: React.FC = () => {
  return (
    <div className="App" style={{width: '100%', height: '100%'}}>
        <SimpleExample/>
    </div>
  );
}

export default App;
