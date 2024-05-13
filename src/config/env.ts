import l from './logger';

export interface Env {
  PORT: string;
  APP_ID: string;
  LOG_LEVEL: string;
  NODE_ENV: string;
  SLACK_SIGNING_SECRET: string;
  SLACK_BOT_TOKEN: string;
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  API_KEY: string;
}

export const requiredEnvVariables: Array<keyof Env> = [
  'PORT',
  'APP_ID',
  'LOG_LEVEL',
  'NODE_ENV',
  'SLACK_SIGNING_SECRET',
  'SLACK_BOT_TOKEN',
  'SLACK_CLIENT_ID',
  'SLACK_CLIENT_SECRET',
  'API_KEY',
];

const checkEnvVariables = () => {
  let failed = false;
  for (const envVariable of requiredEnvVariables) {
    if (!process.env[envVariable]) {
      l.error(`Missing required environment variable: ${envVariable}`);
      failed = true;
    }
  }
  if (failed) {
    process.exit(1);
  }
};

export default checkEnvVariables;
