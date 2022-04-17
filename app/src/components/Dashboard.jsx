import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Timer from './Timer.jsx';

const Dashboard = ({ network, address, connect, epoch3, epoch4, epoch5, liquidity, stake, share, rewardRemaining }) => {
  const withdrawalInfo = [
    { 'size': 1.2, 'info': 'withdrawal 1 start-time' },
    { 'size': 1.2, 'info': 'withdrawal 2 start-time' },
    { 'size': 1.2, 'info': 'withdrawal 3 start-time' }
  ];
  const actions = ['Withdraw', 'Connect Wallet'];
  const [action, setAction] = useState(actions[0]);


  return (
    <div className="dashboard">
      <h3>Dashboard</h3>
      <div className="content">
        <div className="left-side">
          <div className="timer-padding">
            <Timer
              targetTimeMs={epoch3}
              size={withdrawalInfo[0]['size']}
              info={withdrawalInfo[0]['info']}
            />
          </div>
          <div className="timer-padding">
            <Timer
              targetTimeMs={epoch4}
              size={withdrawalInfo[1]['size']}
              info={withdrawalInfo[1]['info']}
            />
          </div>
          <div className="timer-padding">
            <Timer
              targetTimeMs={epoch5}
              size={withdrawalInfo[2]['size']}
              info={withdrawalInfo[2]['info']}
            />
          </div>
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
            <h3>Unsettled Reward:</h3>
            <span>
              {rewardRemaining}
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