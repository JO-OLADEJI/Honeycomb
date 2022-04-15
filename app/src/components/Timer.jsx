import React from 'react';
import '../styles/Timer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const Timer = ({ seconds, size }) => {
  return (
    <div className="timer">
      <div className="count-down" style={{ 'fontSize': `${size}rem` }}>
        <h1 className="minutes">00</h1>
        <h1 className="seperator">:</h1>
        <h1 className="seconds">00</h1>
        <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
      </div>
    </div>
  );
}
 
export default Timer;