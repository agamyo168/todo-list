import pino from 'pino';
import pretty from 'pino-pretty';
import dayjs from 'dayjs';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}`,
});
if (pretty.PinoPretty()) {
  console.log('Yes');
}
export default logger;
