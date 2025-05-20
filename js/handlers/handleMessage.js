import {
  getAliExpressPromoLinks,
  getOriginalUrlFromShort,
  getSuccessMessage,
  getAliExpressLinkType,
  extractUrl,
  wrapWithRedirectLink,
} from "../utils/index.js";
import aliexpressApiService from "../services/aliAPI.js";

export const handleMessage = async (msg, bot) => {
  const chatId = msg.chat.id;
  const text = msg.text || msg.caption;

  const HTMLOptions = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  // Якщо повідомлення не текст і не має caption — не обробляємо
  if (!text) {
    return bot.sendMessage(
      chatId,
      "📩 Надішли текстове повідомлення з посиланням на товар з AliExpress.\n\n❗ Я не можу обробити фото, відео чи інші типи повідомлень."
    );
  }

  // Команди типу /start
  if (text.startsWith("/")) {
    const { handleCommand } = await import("./handleCommand.js");
    return handleCommand(text, chatId, bot, HTMLOptions);
  }

  const url = extractUrl(text);
  if (!url) {
    return bot.sendMessage(
      chatId,
      "🔗 Надішли посилання на товар з AliExpress, і я знайду знижки на нього."
    );
  }

  const typeUrl = getAliExpressLinkType(url);

  if (typeUrl !== "product" && typeUrl !== "short") {
    return bot.sendMessage(
      chatId,
      "❌ Це посилання не схоже на товар з AliExpress. Надішли пряме посилання на товар або коротке aliexpress лінк."
    );
  }

  bot.sendChatAction(chatId, "typing");

  let productUrl = url;

  if (typeUrl === "short") {
    try {
      productUrl = await getOriginalUrlFromShort(url);
    } catch (error) {
      console.error("Помилка при розшифруванні короткого посилання:", error);
      return bot.sendMessage(
        chatId,
        "🚫 Не вдалося розшифрувати коротке посилання. Спробуй ще раз або надішли інше."
      );
    }
  }

  try {
    const linksWithTypeChennal = getAliExpressPromoLinks(productUrl);
    let data = await aliexpressApiService.getAffiliateLinks(
      linksWithTypeChennal
    );

    const successResult =
      data?.aliexpress_affiliate_link_generate_response.resp_result?.result
        ?.promotion_links?.promotion_link[0]?.promotion_link;

    console.log("successResult", successResult);
    if (!successResult) {
      const linksWithRedirect = linksWithTypeChennal.map(wrapWithRedirectLink);
      data = await aliexpressApiService.getAffiliateLinks(linksWithRedirect);
    }

    const affiliateLinks =
      data.aliexpress_affiliate_link_generate_response.resp_result.result
        .promotion_links.promotion_link;
    console.log("affiliateLinks: ", affiliateLinks);

    const answer = getSuccessMessage(affiliateLinks);
    console.log("answer: ", answer);

    return bot.sendMessage(chatId, answer, {
      ...HTMLOptions,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 Підписатися на канал",
              url: "https://t.me/ali_vygidno", // <-- сюди встав свій URL
            },
          ],
          [
            {
              text: "💬 Питання та пропозицій",
              url: "https://t.me/ali_vygidno",
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Помилка при отриманні реферальних лінків:", error);
    return bot.sendMessage(
      chatId,
      "🚫 Щось пішло не так під час пошуку знижок. Спробуй пізніше або перевір посилання."
    );
  }
};
