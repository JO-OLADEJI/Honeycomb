// modules
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

// components
import Timer from '../components/Timer';
import { Header3 } from './Dashboard';
import { Button, PuckButton } from '../components/Button';


const StakeWrapper = styled.div`
  margin: auto;
  width: 50rem;
  height: 25rem;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  background-color: #ebc98b;
  font-family: 'Fredoka', sans-serif;
  position: relative;
`;

const FormWrapper = styled.div`
  width: fit-content;
  margin: auto;
  margin-bottom: 1rem;
`;

const AccountInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: .3rem 1rem;
  font-size: .85rem;
  color: #432929;
`;

const InputWrapper = styled.div`
  border: 1px solid #b89354;
  border-radius: .8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .7rem;
  background-color: #C6A05D;
`;

const Input = styled.input`
  font-size: 1.5rem;
  font-family: inherit;
  width: 11rem;
  border: none;
  background: transparent;
  margin-right: .5rem;
  border: 1px solid transparent;
  border-radius: .5rem;
  transition: border .3s ease-out;
  &:hover {
    border: 1px solid #43292923;
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #0000009a;
  }
  &::-webkit-outer-spin-button {
    display: none;
  }
  &::-webkit-inner-spin-button {
    display: none;
  }
`;

const TokenWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
  color: #432929;
`;

const TokenName = styled.p`
  width: 3rem;
  text-align: left;
`;

const TokenIcon = styled.span`
  cursor: pointer;
  opacity: .5;
  transition: opacity .4s ease-out;
  margin-left: .5rem;
  &:hover {
    opacity: 1;
  }
`;

const ButtonPosition = styled.div`
  position: absolute;
  bottom: 1.35rem;
  right: 50%;
  transform: translateX(50%);
`;

const Divider = styled.div`
  border-left: 1px solid #432929;
  height: 2rem;
  margin: 0 .5rem;
`;


const Stake = ({ address, symbol, connect, stake, approve, epoch2, balance, allowance, token, setDisplay }) => {
  const [actions] = useState(['Stake', `Approve ${symbol}`, `Insufficient ${symbol}`, 'Connect Wallet']);
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
    <StakeWrapper>
      <Header3>
        Stake
      </Header3>
      <FormWrapper>
        <AccountInfo>
          <p>Amount</p>
          <p className="balance">Balance: {balance}</p>
        </AccountInfo>
        <InputWrapper>
          <Input
            type="number" 
            placeholder='0.0'
            value={amount}
            onChange={(e) => setAmount(() => e.target.value)}
          />
          <PuckButton
            onClick={(e) => {
              e.preventDefault();
              setAmount(() => balance);
            }}>
            MAX
          </PuckButton>
          <Divider />
          <TokenWrapper>
            <TokenName>
              {symbol}
            </TokenName>
            <TokenIcon
              onClick={() => navigator.clipboard.writeText(token)}>
              <FontAwesomeIcon icon={faCopy} />
            </TokenIcon>
          </TokenWrapper>
        </InputWrapper>
      </FormWrapper>
      <Timer
        targetTimeMs={epoch2}
        size={2}
        info={'Countdown till end of staking epoch.\nTime may vary slightly due to block \ntimestamp being set by different miners'}
      />
      <ButtonPosition>
        <Button
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
        </Button>
      </ButtonPosition>
    </StakeWrapper>
  );
}

export default Stake;