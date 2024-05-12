import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

import checkEnvVariables from "./config/env";
import logger from "./config/logger";
import generateBounceLetters from "./utils/generateBounceLetters";

checkEnvVariables();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/slack/events",
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// health check
receiver.router.get("/", async (_, res) => {
  res.send("OK");
});

app.command("/bounce", async ({ command, ack, respond }) => {
  await ack();

  logger.info(JSON.stringify(command, null, 2));

  const text = command.text;

  if (!text) {
    await respond("Please provide a valid text to bounce.");
    return;
  }

  const letters = generateBounceLetters(text);

  await respond({
    text: `Preview: *${letters}*\n Do you want to send it?`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Preview: *${letters}*\n Do you want to send it?`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Yes",
            },
            action_id: "confirmation_yes",
            value: letters,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "No",
            },
            action_id: "confirmation_no",
          },
        ],
      },
    ],
  });
});

// Subscribe to button click events
app.action("confirmation_yes", async ({ ack, action, body, client }) => {
  await ack();
  try {
    logger.info(JSON.stringify(body, null, 2));

    // @ts-ignore
    const letters = action.value;

    await client.chat.postMessage({
      // @ts-ignore
      channel: body.channel.id,
      text: letters,
    });
  } catch (error) {
    logger.error(error);
  }
});

app.action("confirmation_no", async ({ ack }) => {
  await ack();

  logger.info("User cancelled the action.");
});

(async () => {
  await app.start(process.env.PORT || 4002);
  logger.info("Bolt app is running!");
})();
