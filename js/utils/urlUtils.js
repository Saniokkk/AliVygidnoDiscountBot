/**
 * Очишення посилань від квері параметрів
 * @param {string} приймає текст з повідомлення і парсить з нього посилання на ALi
 * @returns {string} - повертає чисте посилання без квері-параметрів
 **/
export function extractUrl(text) {
  // Регулярний вираз для знаходження URL в тексті
  const regex = /https?:\/\/[^\s]+/g;

  // Пошук всіх URL у тексті
  const matches = text.match(regex);

  // Якщо знайшли хоча б один URL, повертаємо перший
  return matches ? matches[0] : null;
}

export function extractAliExpressProductsId(url) {
  const match = url.match(/\/item\/(\d+)\.html/);
  return match ? match[1] : null;
}

/**
 * Очишення посилань від квері параметрів
 * @param {string} url - зпарсений url з повідомлення від користувача
 * @returns {string} - повертає чисте посилання без квері параметрів
 **/

export function cleanAliUrlFromAff(url) {
  const urlObj = new URL(url);
  urlObj.search = ""; // очищає повністю всі параметри після ?
  return urlObj.toString();
}

export function defineSourceTypeParamFromFullLink(fullLink) {
  const url = new URL(fullLink);
  console.log("fullLink", fullLink);
  // Перевіряємо, чи це редірект на star.aliexpress.com
  const redirectParam = url.searchParams.get("redirectUrl");

  let targetUrl = fullLink;

  if (redirectParam) {
    // Якщо є redirectUrl — працюємо з ним
    const restOfParams = fullLink.split("redirectUrl=")[1];
    targetUrl = decodeURIComponent(restOfParams);
  }
  console.log("TTTTTTTtargetUrl", targetUrl);
  // Тепер парсимо справжній URL, щоб витягнути параметри
  const parsedTargetUrl = new URL(targetUrl);
  console.log("parsedTargetUrl", parsedTargetUrl);
  const sourceType = parsedTargetUrl.searchParams.get("sourceType");
  if (!sourceType) {
    const fromSyicon = parsedTargetUrl.searchParams.get("from") === "syicon";

    if (!fromSyicon) {
      const setspmb =
        parsedTargetUrl.searchParams.get("setspmb") === "game_center_p4p_feeds";
      return setspmb ? 2 : null;
    }
    return 1;
  }

  return sourceType;
}

export function generateCoinDiscountLink(productId) {
  return `https://m.aliexpress.com/p/coin-index/index.html?_immersiveMode=true&from=syicon&productIds=${productId}`;
}

export function generatePlayAndWinLink(productId) {
  return `https://m.aliexpress.com/p/aep4p_interactive_promotion/custom-feeds.html?_immersiveMode=true&channel=coin&scenario=tpp_browse_mixedrecommend_gamecenter_adpriority&setspmb=game_center_p4p_feeds&productIds=${productId}`;
}

export function toMobileAliExpressLink(desktopUrl) {
  try {
    const url = new URL(desktopUrl);
    console.log("URLtoMobileAliExpressLink: ", url);

    // Проверка, что это ссылка на товар
    if (
      !url.hostname.includes("aliexpress.com")
      // || !url.pathname.startsWith("/item/")
    ) {
      throw new Error("Это не ссылка на товар AliExpress");
    }

    // Меняем поддомен на мобильный
    url.hostname = "m.aliexpress.com";

    return url.toString();
  } catch (error) {
    return `Ошибка: ${error.message}`;
  }
}
