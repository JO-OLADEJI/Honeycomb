import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Nav from './components/Nav.jsx';
import Stake from './components/Stake.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import { connectWallet, refreshConnectWallet, getChainId } from './utils/connect-wallet.js';
import { init } from './utils/honeycomb.js';

const App = () => {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [liquidity, setLiquidity] = useState(0);
  const [stake, setStake] = useState(0);
  const [share, setShare] = useState(0);
  const [rewardRemaining, setRewardRemaining] = useState(0);
  const [Honeycomb, setHoneycomb] = useState(null);
  const [epoch2, setEpoch2] = useState(0);
  const [epoch3, setEpoch3] = useState(0);
  const [epoch4, setEpoch4] = useState(0);
  const [epoch5, setEpoch5] = useState(0);

  const calculateShare = (contribution, total) => {
    return contribution === 0 || total === 0 ? 0 : (contribution / total) * 100;
  }

  const handleConnectWallet = async () => {
    const account = await connectWallet();
    const contract = await init();
    setHoneycomb(() => contract);
    setAddress(() => account);
  }

  useEffect(() => {
    const getWalletInfo = async () => {
      const address = await refreshConnectWallet();
      const contract = await init();
      setHoneycomb(() => contract);
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
    const getHoneycombInfo = async () => {
      if (Honeycomb != null) {
        // const deployTime = await Honeycomb.deployTime();
        const rewardRemaining = await Honeycomb.rewardRemaining();
        const stakingPool = await Honeycomb.stakingPool();
        const amountStaked = await Honeycomb.amountStaked(address);
        const secondEpochStart = await Honeycomb.secondEpochStart();
        const thirdEpochStart = await Honeycomb.thirdEpochStart();
        const fourthEpochStart = await Honeycomb.fourthEpochStart();
        const fifthEpochStart = await Honeycomb.fifthEpochStart();

        setLiquidity(() => Number(ethers.utils.formatEther(stakingPool.toString())));
        setStake(() => Number(ethers.utils.formatEther(amountStaked.toString())));
        setRewardRemaining(() => Number(ethers.utils.formatEther(rewardRemaining.toString())));
        setEpoch2(() => Number(secondEpochStart.toString()) * 1000);
        setEpoch3(() => Number(thirdEpochStart.toString()) * 1000);
        setEpoch4(() => Number(fourthEpochStart.toString()) * 1000);
        setEpoch5(() => Number(fifthEpochStart.toString()) * 1000);
      }
    }
    getHoneycombInfo();
  }, [Honeycomb, address]);

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
              epoch2={epoch2}
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
              epoch3={epoch3}
              epoch4={epoch4}
              epoch5={epoch5}
              network={network}
              address={address}
              connect={handleConnectWallet}
              liquidity={liquidity}
              stake={stake}
              share={share}
              rewardRemaining={rewardRemaining}
            />
          }
        />
      </Routes>
      <p className="add-to-wallet">Add ATRAC to Wallet</p>
    </div>
  );
}

export default App;
