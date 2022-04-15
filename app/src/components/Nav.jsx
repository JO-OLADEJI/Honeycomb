import React, { useState } from 'react';
import '../styles/Nav.css';
import { Link } from 'react-router-dom';
import logo from '../assets/honeycomb-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

const Nav = (props) => {
  const [selected, setSelected] = useState('stake');

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
            onClick={() => setSelected('stake')}
            className={selected === 'stake' ? 'selected': null}>
            Stake
          </Link>
          <Link 
            to="/dashboard"
            onClick={() => setSelected('dashboard')}
            className={selected === 'dashboard' ? 'selected': null}>
            Dashboard
          </Link>
        </div>
      </div>
      <div className="buttons">
        <button>
          connect <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
        </button>
      </div>
    </div>
  );
}

export default Nav;