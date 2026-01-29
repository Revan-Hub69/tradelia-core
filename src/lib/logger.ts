/* eslint-disable no-console */
type LogArgs = ReadonlyArray<unknown>;

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  debug: (...args: LogArgs) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },
  info: (...args: LogArgs) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  log: (...args: LogArgs) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  warn: (...args: LogArgs) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args: LogArgs) => {
    console.error(...args);
  },
};
