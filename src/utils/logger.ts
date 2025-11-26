/**
 * Simple structured logger utility
 */

const DEBUG = process.env.DEBUG === 'true';

export const logger = {
  info: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[INFO] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },

  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`);
    if (error) {
      if (error instanceof Error) {
        console.error(`  Error: ${error.message}`);
        console.error(`  Stack: ${error.stack}`);
      } else {
        console.error(`  Details: ${JSON.stringify(error, null, 2)}`);
      }
    }
  },

  debug: (message: string, data?: any) => {
    if (DEBUG) {
      const timestamp = new Date().toISOString();
      console.error(`[DEBUG] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },

  warn: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[WARN] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};
