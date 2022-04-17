import dayjs from 'dayjs';


/**
 * function to calculate the remaining seconds, minutes, hours and day from now until a target timestamp
 * @param {Number} timestampMs target time in milliseconds
 * @returns {Object} containing the following keys [seconds, minutes, hours, days]
 */
export const tick = (timestampMs) => {
  const timestamp = dayjs(timestampMs);
  const now = dayjs();

  return {
    'seconds': timestamp.diff(now, 'seconds') % 60,
    'minutes': timestamp.diff(now, 'minutes') % 60,
    'hours': timestamp.diff(now, 'hours') % 24,
    'days': timestamp.diff(now, 'days')
  }
}


export const getRemainingMinutes = (now, target) => {
  
}


export const getRemainingHours = (now, target) => {
  
}


export const getRemainingDays = (now, target) => {
  
}