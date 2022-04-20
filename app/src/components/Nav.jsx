import React from 'react';
import '../styles/Nav.css';
import { Link } from 'react-router-dom';
import logo from '../assets/honeycomb-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { requestSwitchNetwork, networks } from '../utils/connect-wallet.js';


const Nav = ({ address, connect, display, network, APP_CHAIN }) => {


  return (
    <div className="nav">
      <div className="logo">
        <img
          src={logo}
          alt="honeycomb logo"
        />
        <h1>Honeycomb</h1>
      </div>
      <div className="sections">
        <div className="wrapper">
          <Link 
            to="/stake" 
            className={display === 'stake' ? 'selected': null}>
            Stake
          </Link>
          <Link 
            to="/dashboard"
            className={display === 'dashboard' ? 'selected': null}>
            Dashboard
          </Link>
        </div>
      </div>
      <div className="buttons">
        {network !== networks[APP_CHAIN]['chainId'] && 
        <div 
          className={'network-display'}
          title="Switch to Rinkeby Testnet"
          onClick={() => requestSwitchNetwork(APP_CHAIN)}>
          <p>
            <FontAwesomeIcon icon={faTriangleExclamation} className="network-icon" /> Network
          </p>
        </div>}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (address === null) connect();
          }}>
          <p>
            {address === null ? 
            <>
              connect <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
            </>
            :
            String(address).substring(0, 5) + '...' + String(address).substring(38)}
          </p>
        </button>
      </div>
    </div>
  );
}

export default Nav;