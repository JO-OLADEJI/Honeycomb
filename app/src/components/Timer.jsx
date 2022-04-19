import React, { useEffect, useState } from 'react';
import '../styles/Timer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { tick } from '../utils/countdown.js';

const Timer = ({ targetTimeMs, size, info, title }) => {
  const [remainingTime, setRemainingTime] = useState({ 'seconds': 0, 'minutes': 0, 'hours': 0, 'days': 0 });

  useEffect(() => {
    const repeat = setInterval(() => {
      setRemainingTime(() => tick(targetTimeMs));
    }, 1 * 1000);

    return () => clearInterval(repeat);
  }, [targetTimeMs]);


  return (
    <div className="timer">
      <div className="count-down" style={{ 'fontSize': `${size}rem` }}>
        {remainingTime['days'] > 0 ?
        <h1 className="days">{remainingTime['days'] + 1} days</h1>
        :
        <>
          <h1 className="hours">{remainingTime['hours'] < 0 ? '00' : String(remainingTime['hours']).padStart(2, '0')}</h1>
          <h1 className="seperator">:</h1>
          <h1 className="minutes">{remainingTime['minutes'] < 0 ? '00' : String(remainingTime['minutes']).padStart(2, '0')}</h1>
          <h1 className="seperator">:</h1>
          <h1 className="seconds">{remainingTime['seconds'] < 0 ? '00' : String(remainingTime['seconds']).padStart(2, '0')}</h1>
        </>}
        <FontAwesomeIcon 
          icon={faCircleInfo} 
          className="info-icon"
          title={info}
        />
        <h6 className="timer-title">{title}</h6>
      </div>
    </div>
  );
}
 
export default Timer;