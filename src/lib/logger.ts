// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) console.log('📝', ...args);
  },
  error: (...args: any[]) => {
    if (isDevelopment) console.error('❌', ...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) console.info('ℹ️', ...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn('⚠️', ...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment) console.debug('🐛', ...args);
  }
};