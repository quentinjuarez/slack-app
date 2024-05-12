"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bolt_1 = require("@slack/bolt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
(0, env_1.default)();
const app = new bolt_1.App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});
app.command("/hello", async ({ command, ack, say }) => {
    await ack();
    await say(`Hello, <@${command.user_id}>`);
});
(async () => {
    await app.start(process.env.PORT || 4002);
    logger_1.default.info("Bolt app is running!");
})();
