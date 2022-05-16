// modules
import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

// components
import { MiniButton } from './Button';

// constants
import { networks, SUPPORTED_NETWORKS } from 'constants/networks';

// utils
import { shortenAddress } from 'utils/format-text';
import { requestSwitchNetwork } from 'utils/wallet';

// types
import { Tabs } from 'types/tabs';

// assets
const logo = require('assets/honeycomb-logo.png');


const NavWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1rem 7vw;
  margin-bottom: 2.5rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const LogoText = styled.h1`
  font-family: 'Satisfy', cursive;
  font-weight: bold;
  margin-left: .4rem;
  background-image: linear-gradient(#C68627, #C6A264);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const LogoIcon = styled.img`
  width: 5rem;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabsOutline = styled.div`
  background-color: #ebc98b;
  padding: .4rem;
  font-family: 'Fredoka', sans-serif;
  border-radius: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabLink = styled(Link)`
  display: inline-block;
  padding: .5rem 1.2rem;
  margin: 0 .1rem;
  text-decoration: none;
  font-weight: 600;
  color: #432929;
  ${({ selected }: { selected?: boolean }) => selected && css`
    background-color: #C6A05D;
    border-radius: .8rem;
  `}
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: 'Fredoka', sans-serif;
`;

const NetworkErrorButton = styled.div`
  padding: .5rem 1rem .5rem 1.8rem;
  font-size: .8rem;
  font-weight: 600;
  position: relative;
  background-color: #d45f5f;
  border: 1px solid black;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  cursor: pointer;
`;

const NetworkErrorIcon = styled.span`
  color: white;
  position: absolute;
  left: 0;
  bottom: -.4rem;
  transform: translate(-50%, 0);
  font-size: 1.5rem;
  border: 2px solid black;
  background-color: #d45f5f;
  border-radius: 50%;
  padding: .5rem .52rem;
`;

const MiniButtonIcon = styled.span`
  font-size: .85rem;
  margin-left: .3rem;
`;


interface NavProps {
  address: string,
  connect: () => Promise<void>,
  network: string,
  display: Tabs,
  APP_CHAIN: SUPPORTED_NETWORKS
}

const Nav = (
  {
    address,
    connect,
    display,
    network,
    APP_CHAIN
  }: NavProps
) => {
  return (
    <NavWrapper>
      <LogoWrapper>
        <LogoIcon
          src={logo}
          alt="honeycomb logo"
        />
        <LogoText>
          Honeycomb
        </LogoText>
      </LogoWrapper>
      <TabsWrapper>
        <TabsOutline>
          <TabLink
            to="/stake"
            selected={display === 'stake' ? true : false}>
            Stake
          </TabLink>
          <TabLink
            to="/dashboard"
            selected={display === 'dashboard' ? true : false}>
            Dashboard
          </TabLink>
        </TabsOutline>
      </TabsWrapper>
      <ButtonsWrapper>
        {network !== networks[APP_CHAIN]['chainId'] &&
        <NetworkErrorButton
          title="Switch to Rinkeby Testnet"
          onClick={() => requestSwitchNetwork(APP_CHAIN)}>
          <p>
            <NetworkErrorIcon>
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </NetworkErrorIcon>
            Network
          </p>
        </NetworkErrorButton>}
        <MiniButton
          onClick={(e: any) => {
            e.preventDefault();
            if (address === null) connect();
          }}>
          <p>
            {!address ?
            <>
              connect
              <MiniButtonIcon>
                <FontAwesomeIcon icon={faWallet} />
              </MiniButtonIcon>
            </>
            :
            shortenAddress(address)}
          </p>
        </MiniButton>
      </ButtonsWrapper>
    </NavWrapper>
  );
}

export default Nav;