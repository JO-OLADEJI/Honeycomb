import React, { useState } from 'react';
import '../styles/Stake.css';
import Timer from './Timer.jsx';
import atrac from '../assets/atrac.png';

const Stake = ({ network, address, connect }) => {
  const actions = ['Stake', 'Approve ATRAC', 'Connect Wallet'];
  const [action, setAction] = useState(actions[0]);
  const [erc20Bal, setErc20Bal] = useState(0.272964);

  return (
    <div className="stake">
      <h3>Stake</h3>
      <div className="form">
        <div className="pseudo-info">
          <p>Amount</p>
          <p className="balance">Balance: {erc20Bal}</p>
        </div>
        <div className="form-wrapper">
          <input type="number" placeholder='0.0' />
          <button>MAX</button>
          <div className="divider" />
          <div className="token">
            <img 
              src={atrac}
              alt=""
              className="symbol"
            />
            <p className="name">
              ATRAC
            </p>
          </div>
        </div>
      </div>
      <Timer 
        seconds={180}
        size={2}
      />
      <div className="stake-buttons">
        <button>
          {action}
        </button>
      </div>
    </div>
  );
}

export default Stake;