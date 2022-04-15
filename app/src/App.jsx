import React from 'react';
import './styles/App.css';
import Nav from './components/Nav.jsx';
import Stake from './components/Stake.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Stake />} />
        <Route path="/stake" element={<Stake />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <p className="add-to-wallet">Add ATRAC to Wallet</p>
    </div>
  );
}

export default App;
