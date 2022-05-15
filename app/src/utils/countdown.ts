import dayjs from 'dayjs';
import { Countdown } from '../types/countdown'

export const ticker = (timestampMs: number): Countdown => {
  const timestamp = dayjs(timestampMs);
  const now = dayjs();

  return {
    seconds: timestamp.diff(now, 'seconds') % 60,
    minutes: timestamp.diff(now, 'minutes') % 60,
    hours: timestamp.diff(now, 'hours') % 24,
    days: timestamp.diff(now, 'days')
  }
}