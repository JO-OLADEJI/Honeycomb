import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Nav from './components/Nav.jsx';
import Stake from './components/Stake.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const [liquidity, setLiquidity] = useState(185.267);
  const [stake, setStake] = useState(25);
  const [share, setShare] = useState(25);
  const [reward, setReward] = useState(0);
  const calculateShare = (contribution, total) => {
    return (contribution / total) * 100;
  }

  useEffect(() => {
    setShare(() => calculateShare(stake, liquidity));
  }, [stake, liquidity]);

  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Stake />} />
        <Route path="/stake" element={<Stake />} />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard
              liquidity={liquidity}
              stake={stake}
              share={share}
              reward={reward}
            />
          }
        />
      </Routes>
      <p className="add-to-wallet">Add ATRAC to Wallet</p>
    </div>
  );
}

export default App;
