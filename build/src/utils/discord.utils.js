"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCodeBlockToDiscord =
  exports.sendPlainTextToDiscord =
  exports.sendMessageToDiscord =
  exports.sendErrorToDiscord =
  exports.VAULT_MANAGER_ROLE_ID =
  exports.BADGER_API_ROLE_ID =
  exports.SENTRY_NAME =
    void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constants_1 = require("../config/constants");
exports.SENTRY_NAME = "Lord Brocktree";
// TODO: once we have more generalized errors for other things - use the badger api role
exports.BADGER_API_ROLE_ID = "804758043727233044";
exports.VAULT_MANAGER_ROLE_ID = "1003408385170997299";
function sendErrorToDiscord(e, errorMsg, errorType) {
  var _a, _b;
  sendMessageToDiscord(
    `**${errorType}**`,
    `:x: ${errorMsg}`,
    [
      {
        name: "Error Name",
        value: e.name,
        inline: true
      },
      {
        name: "Error Description",
        value: e.message,
        inline: true
      },
      {
        name: "Error Stack",
        value:
          (_b = (_a = e.stack) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
        inline: false
      }
    ],
    "Error Bot"
  );
}
exports.sendErrorToDiscord = sendErrorToDiscord;
async function sendMessageToDiscord(title, description, fields, username, url = constants_1.DISCORD_WEBHOOK_URL) {
  try {
    await axios_1.default.post(url, {
      embeds: [
        {
          title,
          description: `${description} <@&${exports.VAULT_MANAGER_ROLE_ID}>`,
          fields
        }
      ],
      username
    });
  } catch (error) {
    console.error(error);
  }
}
exports.sendMessageToDiscord = sendMessageToDiscord;
async function sendPlainTextToDiscord(message, username = exports.SENTRY_NAME, url = constants_1.DISCORD_WEBHOOK_URL) {
  try {
    await axios_1.default.post(url, { content: `${message} <@&${exports.VAULT_MANAGER_ROLE_ID}>`, username });
  } catch (error) {
    console.error(error);
  }
}
exports.sendPlainTextToDiscord = sendPlainTextToDiscord;
async function sendCodeBlockToDiscord(message, username = exports.SENTRY_NAME, url = constants_1.DISCORD_WEBHOOK_URL) {
  const msg = "```\n" + message + "\n``` <@&" + exports.VAULT_MANAGER_ROLE_ID + ">";
  try {
    await axios_1.default.post(url, { content: msg, username });
  } catch (error) {
    console.error(error);
  }
}
exports.sendCodeBlockToDiscord = sendCodeBlockToDiscord;
//# sourceMappingURL=discord.utils.js.map
