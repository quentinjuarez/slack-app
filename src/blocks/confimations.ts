import type { RespondArguments } from "@slack/bolt";

const confirmationButtons = (test: string) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Do you want to send these letters?\n*${test}*\n`,
      },
      accessory: {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Yes",
            },
            action_id: "confirmation_yes",
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
    },
  ] as RespondArguments;
};

export default confirmationButtons;
