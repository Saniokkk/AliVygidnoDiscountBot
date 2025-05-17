import TelegramBot from "node-telegram-bot-api";
import {
  startMessage,
  messageForHelp,
  messageForInfo,
} from "./js/templateMessages.js";
import {
  extractUrl,
  cleanAliUrlFromAff,
  getAliExpressPromoLinks,
  getAliExpressLinkType,
  getSuccessMessage,
  getOriginalUrlFromShort,
} from "./js/helpers.js";

import aliexpressApiService from "./js/aliApi.js";

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
  { command: "/help", description: "Що робить цей бот" },
  { command: "/info", description: "Як користуватись монетками" },
]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  // const text = msg.text;

  const text = msg.text || msg.caption;
  console.log("text: ", text);

  if (!text) {
    bot.sendMessage(
      msg.chat.id,
      "📩 Надішліть, будь ласка, посилання на товар з AliExpress у вигляді тексту."
    );
    return;
  }

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

  const url = extractUrl(text);

  if (!url) {
    return bot.sendMessage(
      chatId,
      "🔗 Надішли посилання на товар з AliExpress, і я знайду знижки на нього."
    );
  } else {
    const typeUrl = getAliExpressLinkType(url);
    {
      if (typeUrl === "product") {
        const linksWithTypeChennal = getAliExpressPromoLinks(url);
        const data = await aliexpressApiService.getAffiliateLinks(
          linksWithTypeChennal
        );

        const affiliateLinks =
          data.aliexpress_affiliate_link_generate_response.resp_result.result
            .promotion_links.promotion_link;

        bot.sendMessage(chatId, getSuccessMessage(affiliateLinks), HTMLOptions);
      } else if (typeUrl === "short") {
        const originalUrlProduct = await getOriginalUrlFromShort(url);
        const linksWithTypeChannal =
          getAliExpressPromoLinks(originalUrlProduct);
        const data = await aliexpressApiService.getAffiliateLinks(
          linksWithTypeChannal
        );
        const affiliateLinks =
          data.aliexpress_affiliate_link_generate_response.resp_result.result
            .promotion_links.promotion_link;
        bot.sendMessage(chatId, getSuccessMessage(affiliateLinks), HTMLOptions);
      }
    }

    // const refLink =
    //   data.aliexpress_affiliate_link_generate_response.resp_result.result
    //     .promotion_links;
    // // console.log(refLink);
    // console.log(data.aliexpress_affiliate_link_generate_response.resp_result);

    // bot.sendMessage(chatId, refLink.promotion_link[0].promotion_link);
  }
});
