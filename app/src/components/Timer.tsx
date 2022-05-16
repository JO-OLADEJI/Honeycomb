// modules
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

// utils
import { ticker } from '../utils/countdown.js';

// types
import { Countdown } from '../types/countdown';


const TimerWrapper = styled.div`
  background-color: transparent;
`;

const TimerTitle = styled.h6`
  position: absolute;
  left: 50%;
  top: .2rem;
  transform: translateX(-50%);
  font-size: .7rem;
  color: #432929c9;
`;

const CountDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: ${({ size }: { size: number }) => size + 'rem' || '2rem'};
  font-weight: bold;
`;

const Time = styled.h1`
  color: #432929;
`;

const Seperator = styled(Time)`
  margin: 0 .25rem;
  color: #432929dc;
`;

const IconWrapper = styled.div`
  font-size: .8rem;
  cursor: pointer;
  color: #432929a1;
  padding-left: .5rem;
  display: inline-block;
  width: fit-content;
`;


interface TimerProps {
  targetTimeMs: number,
  size: number,
  info: string,
  title?: string
}

const Timer = (
  {
    targetTimeMs,
    size,
    info,
    title
  }: TimerProps
) => {
  const [remainingTime, setRemainingTime] = useState<Countdown>({
    'seconds': 0,
    'minutes': 0,
    'hours': 0,
    'days': 0
  });

  useEffect(() => {
    const repeat = setInterval(() => {
      setRemainingTime(() => ticker(targetTimeMs));
    }, 1 * 1000);

    return () => clearInterval(repeat);
  }, [targetTimeMs]);


  return (
    <TimerWrapper>
      <CountDown size={size}>
        {remainingTime['days'] > 0 ?
        <Time>
          {remainingTime['days'] + 1} days
        </Time>
        :
        <>
          <Time>
            {remainingTime['hours'] < 0 ? '00' : String(remainingTime['hours']).padStart(2, '0')}
          </Time>
          <Seperator>:</Seperator>
          <Time>
            {remainingTime['minutes'] < 0 ? '00' : String(remainingTime['minutes']).padStart(2, '0')}
          </Time>
          <Seperator>:</Seperator>
          <Time>
            {remainingTime['seconds'] < 0 ? '00' : String(remainingTime['seconds']).padStart(2, '0')}
          </Time>
        </>}

        <IconWrapper>
          <FontAwesomeIcon
            icon={faCircleInfo}
            title={info}
          />
        </IconWrapper>
        <TimerTitle>
          {title}
        </TimerTitle>
      </CountDown>
    </TimerWrapper>
  );
}

export default Timer;