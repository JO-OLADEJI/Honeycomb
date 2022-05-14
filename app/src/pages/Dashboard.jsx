// modules
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// components
import Timer from '../components/Timer';
import { Button } from '../components/Button';

// constants
import { timerInfo } from '../constants/dashboardTimer';


const Wrapper = styled.div`
  margin: auto;
  width: 50rem;
  height: 25rem;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  background-color: #ebc98b;
  font-family: 'Fredoka', sans-serif;
`;

export const Header3 = styled.h3`
  text-align: left;
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 1rem;
  color: #432929;
`;

const Flexer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeftWrapper = styled.div`
  width: 35%;
`;

const RightWrapper = styled.div`
  width: 65%;
  height: 19.4rem;
  padding: 0 1.5rem;
  position: relative;
`;

const TimerWrapper = styled.div`
  background-color: #C6A05D;
  margin-bottom: 1.2rem;
  border-radius: 1rem;
  padding: 1.4rem 0;
  position: relative;
`;

const TextInfoWrapper = styled.div`
  margin-bottom: .8rem;
  text-align: left;
`;


const InfoText = styled.p`
  font-size: 1.5rem;
  color: #432929;
  font-weight: 500;
  display: inline-block;
`;

const InfoTitle = styled(InfoText)`
  color: #432929de;
  font-size: .9rem;
  width: 8rem;
`;

const ButtonPosition = styled.div`
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
`;



export const Dashboard = ({ address, connect, harvest, epochs, liquidity, stake, share, rewardRemaining, setDisplay, symbol }) => {
  const [actions] = useState(['Harvest', 'Connect Wallet']);
  const [action, setAction] = useState(actions[0]);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | Honeycomb';
    setDisplay('dashboard');
  }, [setDisplay]);

  useEffect(() => {
    if (address === null) {
      setAction(() => actions[1]);
      setDisableButton(() => false);
    }
    else if (stake === 0 || epochs[0] - new Date().getTime() > 0) {
      setAction(() => actions[0]);
      setDisableButton(() => true);
    }
  }, [address, actions, stake, epochs]);


  return (
    <Wrapper>
      <Header3>
        Dashboard
      </Header3>
      <Flexer>
        <LeftWrapper>
          {epochs.map((epoch, index) => (
            <TimerWrapper key={index}>
              <Timer
                targetTimeMs={epoch[index]}
                size={timerInfo[index]['size']}
                info={timerInfo[index]['info']}
                title={timerInfo[index]['title']}
              />
            </TimerWrapper>
          ))}
        </LeftWrapper>

        <RightWrapper>
          <TextInfoWrapper>
            <InfoTitle>Pool Liquidity:</InfoTitle>
            <InfoText>
              {liquidity}
            </InfoText>
          </TextInfoWrapper>
          <TextInfoWrapper>
            <InfoTitle>Your Stake:</InfoTitle>
            <InfoText>
              {stake}
            </InfoText>
          </TextInfoWrapper>
          <TextInfoWrapper>
            <InfoTitle>Pool Share:</InfoTitle>
            <InfoText>
              {share}%
            </InfoText>
          </TextInfoWrapper>
          <TextInfoWrapper>
            <InfoTitle>Locked Rewards:</InfoTitle>
            <InfoText>
              {rewardRemaining} {symbol}
            </InfoText>
          </TextInfoWrapper>
          <ButtonPosition>
            <Button
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
            </Button>
          </ButtonPosition>
        </RightWrapper>
      </Flexer>
    </Wrapper>
  );
}