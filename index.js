import TelegramBot from "node-telegram-bot-api";

import { TELEGRAM_BOT_TOKEN } from "./js/config/envConfig.js";
import { setBotCommands } from "./js/bot/setCommands.js";
import { handleMessage } from "./js/handlers/handleMessage.js";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
setBotCommands(bot);

bot.on("message", async (msg) => {
  try {
    await handleMessage(msg, bot);
  } catch (err) {
    console.error("💥 Error handling message:", err);
    bot.sendMessage(
      msg.chat.id,
      "❌ Сталася помилка. Спробуйте ще раз пізніше."
    );
  }
});
