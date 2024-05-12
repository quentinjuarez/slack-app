import { App } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

import checkEnvVariables from "./config/env";
import logger from "./config/logger";
import generateBounceLetters from "./utils/generateBounceLetters";

checkEnvVariables();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command("/bounce", async ({ command, ack, say, payload }) => {
  await ack();

  logger.info(JSON.stringify(command));

  const text = payload.text;

  if (!text) {
    await say("Please provide a valid text to bounce.");
    return;
  }

  const letters = generateBounceLetters(text);

  await say(letters);
});

(async () => {
  await app.start(process.env.PORT || 4002);
  logger.info("Bolt app is running!");
})();
