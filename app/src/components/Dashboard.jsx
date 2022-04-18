import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import Timer from './Timer.jsx';

const Dashboard = ({ network, address, connect, harvest, epoch3, epoch4, epoch5, liquidity, stake, share, rewardRemaining, symbol }) => {
  const withdrawalInfo = [
    { 'size': 1.2, 'info': 'withdrawal 1 start-time' },
    { 'size': 1.2, 'info': 'withdrawal 2 start-time' },
    { 'size': 1.2, 'info': 'withdrawal 3 start-time' }
  ];
  const [actions] = useState(['Harvest', 'Connect Wallet']);
  const [action, setAction] = useState(actions[0]);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (address === null) {
      setAction(() => actions[1]);
      setDisableButton(() => false);
    }
    else if (stake === 0 || epoch3 - new Date().getTime() > 0) {
      setAction(() => actions[0]);
      setDisableButton(() => true);
    }
  }, [address, actions, stake, epoch3]);


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
            <h3>Locked Rewards:</h3>
            <span>
              {rewardRemaining} {symbol}
            </span>
          </div>
          <div className="dashboard-buttons">
            <button 
              disabled={disableButton}
              onClick={(e) => {
                e.preventDefault();
                if (action === actions[0]) {
                  harvest();
                }
                else if (action === actions[1]) {
                  connect();
                }
              }}>
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;