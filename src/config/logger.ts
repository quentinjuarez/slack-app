import pino from "pino";

const pinoLogger = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
});

export default pinoLogger;
