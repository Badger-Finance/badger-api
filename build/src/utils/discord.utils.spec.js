"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const discord_utils_1 = require("./discord.utils");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('discord.utils', () => {
    mockedAxios.post.mockImplementation(() => Promise.resolve('success'));
    it('Should send error to discord', () => {
        try {
            throw new Error('Whoops!');
        }
        catch (e) {
            (0, discord_utils_1.sendErrorToDiscord)(e, 'Error with subgraph', 'Subgraph Error');
            expect(mockedAxios.post).toBeCalled();
        }
    });
    it('Should send plain text to discord', () => {
        (0, discord_utils_1.sendPlainTextToDiscord)('INCORRECT REWARDS DISTRIBTION', 'Rewards Bot');
        expect(mockedAxios.post).toHaveBeenCalledWith('Missing value', {
            content: `INCORRECT REWARDS DISTRIBTION <@&${discord_utils_1.VAULT_MANAGER_ROLE_ID}>`,
            username: 'Rewards Bot',
        });
    });
    it('Should code block to discord', () => {
        (0, discord_utils_1.sendCodeBlockToDiscord)('INCORRECT REWARDS DISTRIBTION', 'Rewards Bot');
        expect(mockedAxios.post).toHaveBeenCalledWith('Missing value', {
            content: '```\n' + 'INCORRECT REWARDS DISTRIBTION' + '\n```' + ' <@&' + discord_utils_1.VAULT_MANAGER_ROLE_ID + '>',
            username: 'Rewards Bot',
        });
    });
});
//# sourceMappingURL=discord.utils.spec.js.map