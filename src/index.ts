import { App } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

import checkEnvVariables from "./config/env";
import logger from "./config/logger";

checkEnvVariables();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command("/hello", async ({ command, ack, say }) => {
  await ack();
  await say(`Hello, <@${command.user_id}>`);
});

(async () => {
  await app.start(process.env.PORT || 4002);
  logger.info("Bolt app is running!");
})();
