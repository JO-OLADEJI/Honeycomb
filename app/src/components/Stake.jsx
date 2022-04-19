import React, { useEffect, useState } from 'react';
import '../styles/Stake.css';
import Timer from './Timer.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


const Stake = ({ network, address, symbol, connect, stake, approve, epoch2, balance, allowance, token, setDisplay }) => {
  const [actions] = useState(['Stake', 'Approve ATRAC', 'Insufficient ATRAC', 'Connect Wallet']);
  const [action, setAction] = useState(actions[0]);
  const [amount, setAmount] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    document.title = 'Stake | Honeycomb';
    setDisplay('stake');
  }, [setDisplay]);

  useEffect(() => {
    if (address === null) {
      setAction(() => actions[3]);
      setDisableButton(() => false);
    }
    else if (Number(amount) > balance) {
      setAction(() => actions[2]);
      setDisableButton(() => true);
    }
    else if (Number(amount) > allowance && epoch2 > new Date().getTime()) {
      setAction(() => actions[1]);
      setDisableButton(() => false);
    }
    else if (epoch2 < new Date().getTime()) {
      setDisableButton(() => true);
    }
    else {
      setAction(() => actions[0]);
      setDisableButton(() => false);
    }
  }, [address, action, balance, amount, actions, allowance, epoch2]);


  return (
    <div className="stake">
      <h3>Stake</h3>
      <div className="form">
        <div className="pseudo-info">
          <p>Amount</p>
          <p className="balance">Balance: {balance}</p>
        </div>
        <div className="form-wrapper">
          <input 
            type="number" 
            placeholder='0.0'
            value={amount}
            onChange={(e) => setAmount(() => e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setAmount(() => balance);
            }}>
            MAX
          </button>
          <div className="divider" />
          <div className="token">
            <p className="name">
              {symbol}
            </p>
            <abbr title="copy address" onClick={() => navigator.clipboard.writeText(token)}>
              <FontAwesomeIcon icon={faCopy} className="copy-icon" />
            </abbr>
          </div>
        </div>
      </div>
      <Timer 
        targetTimeMs={epoch2}
        size={2}
        info={'Countdown till end of staking epoch.\nTime may vary slightly due to block \ntimestamp being set by different miners'}
      />
      <div className="stake-buttons">
        <button
          disabled={disableButton}
          onClick={(e) => {
            e.preventDefault();
            if (action === actions[0] && amount !== '') {
              stake(amount);
              setAmount(() => '');
            }
            else if (action === actions[1] && amount !== '') {
              approve(amount);
            }
            else if (action === actions[3]) {
              connect();
            }
          }}>
          {action}
        </button>
      </div>
    </div>
  );
}

export default Stake;