"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredEnvVariables = void 0;
const logger_1 = __importDefault(require("./logger"));
exports.requiredEnvVariables = [
    "PORT",
    "APP_ID",
    "LOG_LEVEL",
    "NODE_ENV",
    "SLACK_SIGNING_SECRET",
    "SLACK_BOT_TOKEN",
];
const checkEnvVariables = () => {
    let failed = false;
    for (const envVariable of exports.requiredEnvVariables) {
        if (!process.env[envVariable]) {
            logger_1.default.error(`Missing required environment variable: ${envVariable}`);
            failed = true;
        }
    }
    if (failed) {
        process.exit(1);
    }
};
exports.default = checkEnvVariables;
