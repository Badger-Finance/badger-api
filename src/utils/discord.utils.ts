import axios from 'axios';
import { DISCORD_WEBHOOK_URL } from '../config/constants';

export function sendErrorToDiscord(e: Error, errorMsg: string, errorType: string) {
  sendMessageToDiscord(
    `**${errorType}**`,
    `:x: ${errorMsg}`,
    [
      {
        name: 'Error Name',
        value: e.name,
        inline: true,
      },
      {
        name: 'Error Description',
        value: e.message,
        inline: true,
      },
      {
        name: 'Error Stack',
        value: e.stack?.toString() ?? '',
        inline: false,
      },
    ],
    'Error Bot',
  );
}

export async function sendMessageToDiscord(
  title: string,
  description: string,
  fields: { name: string; value: string; inline: boolean }[],
  username: string,
  url: string = DISCORD_WEBHOOK_URL,
) {
  try {
    await axios.post(url, {
      embeds: [
        {
          title,
          description,
          fields,
        },
      ],
      username,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function sendPlainTextToDiscord(message: string, username: string, url: string = DISCORD_WEBHOOK_URL) {
  try {
    await axios.post(url, { content: message, username });
  } catch (error) {
    console.log(error);
  }
}

export async function sendCodeBlockToDiscord(message: string, username: string, url: string = DISCORD_WEBHOOK_URL) {
  const msg = '```\n' + message + '\n```';
  try {
    await axios.post(url, { content: msg, username });
  } catch (error) {
    console.log(error);
  }
}
