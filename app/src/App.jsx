import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Nav from './components/Nav.jsx';
import Stake from './components/Stake.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';
import { connectWallet, refreshConnectWallet, getChainId } from './utils/connect-wallet.js';

const App = () => {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [liquidity, setLiquidity] = useState(185.267);
  const [stake, setStake] = useState(25);
  const [share, setShare] = useState(25);
  const [reward, setReward] = useState(0);

  const calculateShare = (contribution, total) => {
    return (contribution / total) * 100;
  }

  const handleConnectWallet = async () => {
    const account = await connectWallet();
    setAddress(() => account);
  }

  useEffect(() => {
    const getWalletInfo = async () => {
      const address = await refreshConnectWallet();
      setAddress(() => address);
    };
    const getChainInfo = async () => {
      const chain = await getChainId();
      setNetwork(() => chain);
    }
    const addWalletListener = () => {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          accounts.length > 0 ? setAddress(() => accounts[0]) : setAddress(() => null);
        });
      }
    }
    const addChainListener = () => {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId) => {
          setNetwork(() => chainId);
        });
      }
    }

    getWalletInfo();
    getChainInfo();
    addWalletListener();
    addChainListener();
  }, []);

  useEffect(() => {
    setShare(() => calculateShare(stake, liquidity));
  }, [stake, liquidity]);


  return (
    <div className="App">
      <Nav 
        address={address}
        connect={handleConnectWallet} 
      />

      <Routes>
        <Route path="/" element={<Stake />} />
        <Route 
          path="/stake" 
          element={
            <Stake
              network={network}
              address={address}
              connect={handleConnectWallet}
            />
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard
              network={network}
              address={address}
              connect={handleConnectWallet}
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
