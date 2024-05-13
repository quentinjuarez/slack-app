import { App, ExpressReceiver } from '@slack/bolt';
import { FileInstallationStore } from '@slack/oauth';
import dotenv from 'dotenv';
dotenv.config();

import checkEnvVariables from './config/env';
import logger from './config/logger';
import generateBounceLetters from './utils/generateBounceLetters';

checkEnvVariables();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events',
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  receiver,
  stateSecret: process.env.API_KEY,
  scopes: ['emoji:read', 'chat:write', 'commands'],
  installationStore: new FileInstallationStore(),
});

// health check
receiver.router.get('/', async (_, res) => {
  res.status(200).send({ status: process.env.APP_ID + ' is up and running!' });
});

const isDev = process.env.NODE_ENV === 'development';

const commandName = (command: string) => {
  return isDev ? `/${command}-dev` : `/${command}`;
};

app.command(commandName('bounce'), async ({ command, ack, respond }) => {
  try {
    await ack();

    const { text } = command;

    if (!text) {
      await respond('Please provide a valid text to bounce.');
      return;
    }

    const letters = generateBounceLetters(text);

    await respond(letters);

    // await respond({
    //   response_type: "ephemeral",
    //   delete_original: true,
    //   text: `Preview: *${letters}*\n Do you want to send it?`,
    //   blocks: [
    //     {
    //       type: "section",
    //       text: {
    //         type: "mrkdwn",
    //         text: `Preview: *${letters}*\n Do you want to send it?`,
    //       },
    //     },
    //     {
    //       type: "actions",
    //       elements: [
    //         {
    //           type: "button",
    //           text: {
    //             type: "plain_text",
    //             text: "Yes",
    //           },
    //           action_id: "confirmation_yes",
    //           value: JSON.stringify({
    //             letters,
    //           }),
    //         },
    //         {
    //           type: "button",
    //           text: {
    //             type: "plain_text",
    //             text: "No",
    //           },
    //           action_id: "confirmation_no",
    //         },
    //       ],
    //     },
    //   ],
    // });
  } catch (error) {
    logger.error(error);
  }
});

// Subscribe to button click events
app.action('confirmation_yes', async ({ ack, action, body, say }) => {
  try {
    await ack();

    logger.info(
      JSON.stringify(
        {
          action,
          body,
        },
        null,
        2
      )
    );

    // Extract letters and channelId from the action value
    // @ts-ignore
    const { letters, channelId } = JSON.parse(action.value);

    await say({
      text: letters,
    });
  } catch (error) {
    logger.error(error);
  }
});

app.action('confirmation_no', async ({ ack, action, body, client }) => {
  try {
    await ack();

    logger.info(
      JSON.stringify(
        {
          action,
          body,
        },
        null,
        2
      )
    );

    // Delete the ephemeral message
    // @ts-ignore
    const { channel_id, message_ts } = body.container;

    await client.chat.delete({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel_id,
      ts: message_ts,
    });
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 4002);
  logger.info('Bolt app is running!');
})();
