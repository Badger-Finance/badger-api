import axios from 'axios';

import {
  BADGER_API_ROLE_ID,
  sendCodeBlockToDiscord,
  sendErrorToDiscord,
  sendPlainTextToDiscord,
} from './discord.utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('discord.utils', () => {
  mockedAxios.post.mockImplementation(() => Promise.resolve('success'));

  it('Should send error to discord', () => {
    try {
      throw new Error('Whoops!');
    } catch (e: any) {
      sendErrorToDiscord(e, 'Error with subgraph', 'Subgraph Error');
      expect(mockedAxios.post).toBeCalled();
    }
  });

  it('Should send plain text to discord', () => {
    sendPlainTextToDiscord('INCORRECT REWARDS DISTRIBTION', 'Rewards Bot');
    expect(mockedAxios.post).toHaveBeenCalledWith('Missing value', {
      content: `INCORRECT REWARDS DISTRIBTION <@&${BADGER_API_ROLE_ID}>`,
      username: 'Rewards Bot',
    });
  });

  it('Should code block to discord', () => {
    sendCodeBlockToDiscord('INCORRECT REWARDS DISTRIBTION', 'Rewards Bot');
    expect(mockedAxios.post).toHaveBeenCalledWith('Missing value', {
      content: '```\n' + 'INCORRECT REWARDS DISTRIBTION' + '\n```' + ' <@&' + BADGER_API_ROLE_ID + '>',
      username: 'Rewards Bot',
    });
  });
});
