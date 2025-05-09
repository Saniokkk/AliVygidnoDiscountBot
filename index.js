import TelegramBot from "node-telegram-bot-api";
import {
  startMessage,
  messageForHelp,
  messageForInfo,
} from "./js/templateMessages.js";

import { getAffiliateLink } from "./js/aliApi.js";

const token = "7752901325:AAGi70K3vhQPYSZtxd4kBemOjRFMTRXV7S4";

const aliConfig = {
  appKey: "514752",
  appSecret: "eFENhEA5lrwvcJQfQhsH0tpiOsbhRjcD ",
  trackingId: "kAshyrinxEpo07qOvu18521aLex",
};

const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  {
    command: "/start",
    description: "Запуск бота, отримання початквої інформації",
  },
  { command: "/help", description: "Допомога" },
  { command: "/info", description: "Як користуватись монетками" },
]);

bot.on("message", async (msg) => {
  //   console.log(msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log("text: ", text);

  //   if (!msg?.text?.startsWith("/")) {
  //     return bot.sendMessage(chatId, "");
  //   }

  const HTMLOptions = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  if (text === "/start") {
    bot.sendMessage(chatId, startMessage, HTMLOptions);
  }

  if (text === "/info") {
    bot.sendMessage(chatId, messageForHelp, HTMLOptions);
  }

  if (text === "/help") {
    bot.sendMessage(chatId, messageForInfo, HTMLOptions);
  }

  const aliexpressRegex =
    /^https?:\/\/(www\.)?(aliexpress\.com|a\.aliexpress\.com)\//i;

  if (!aliexpressRegex.test(msg.text)) {
    return bot.sendMessage(
      chatId,
      "🔗 Надішли посилання на товар з AliExpress, і я знайду знижки на нього."
    );
  } else {
    aliConfig.productUrl = msg.text;
    const data = await getAffiliateLink(aliConfig);
    console.log(data);
  }
});
