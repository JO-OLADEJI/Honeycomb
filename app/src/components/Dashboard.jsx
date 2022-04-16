import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Timer from './Timer.jsx';

const Dashboard = ({ network, address, connect, liquidity, stake, share, reward }) => {
  const withdrawals = [
    { 'time': 180, 'size': 1.2, 'info': 'nothing for now' },
    { 'time': 150, 'size': 1.2, 'info': 'nothing for now' },
    { 'time': 120, 'size': 1.2, 'info': 'nothing for now' }
  ];
  const actions = ['Withdraw', 'Connect Wallet'];
  const [action, setAction] = useState(actions[0]);

  return (
    <div className="dashboard">
      <h3>Dashboard</h3>
      <div className="content">
        <div className="left-side">
          {withdrawals.map((epoch, index) => (
            <div className="timer-padding" key={index}>
              <Timer
                seconds={epoch['time']}
                size={epoch['size']}
              />
            </div>
          ))}
        </div>
        <div className="right-side">
          <div className="info-container">
            <h3>Pool Liquidity:</h3>
            <span>
              {liquidity}
            </span>
          </div>
          <div className="info-container">
            <h3>Your Stake:</h3>
            <span>
              {stake}
            </span>
          </div>
          <div className="info-container">
            <h3>Pool Share:</h3>
            <span>
              {share}%
            </span>
          </div>
          <div className="info-container">
            <h3>Potential Reward:</h3>
            <span>
              {reward}
            </span>
          </div>
          <div className="dashboard-buttons">
            <button>
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;