import crypto from "crypto";
import puppeteer from "puppeteer";
import axios from "axios";

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

/**
 * Створення посиланнь з прив'язкою різних розділів
 * @param {string} url - url чисте посилання на товар
 * @returns {Array} - масив посилань з прив'язкою до різних розділів
 **/

export function getAliExpressPromoLinks(url) {
  const baseUrl = new URL(url);
  baseUrl.search = ""; // очищаємо всі параметри
  console.log("baseUrl", baseUrl.toString());
  const channelsParams = [
    { sourceType: "620", channel: "coin" },
    { sourceType: "562", channel: "coin" },
    { sourceType: "561", channel: "coin" },
    { sourceType: "680", channel: "coin" },
    { sourceType: "591", channel: "coin" },
    // { sourceType: "570", channel: "coin", afSmartRedirect: "y" },
  ];

  // const channelsParams = [
  //   { sourceType: "620", channel: "coin", afSmartRedirect: "y" },
  //   { sourceType: "562", channel: "sd", afSmartRedirect: "y" },
  //   { sourceType: "561", channel: "limitedoffers", afSmartRedirect: "y" },
  //   { sourceType: "680", channel: "bigSave", afSmartRedirect: "y" },
  //   { sourceType: "591", channel: "choice", afSmartRedirect: "y" },
  //   { sourceType: "570", channel: "choice", afSmartRedirect: "y" },
  // ];

  // 620 монеты
  // 562 З суперзнижкою
  // 561 Лімітовані знижки:
  // 680 Big Save::
  // 591 Земля призів:
  // 570 Choice (3+ товарів):

  // Генеруємо 4 версії посилання
  const links = channelsParams.map(
    ({ sourceType, channel, afSmartRedirect }) => {
      const urlCopy = new URL(baseUrl); // створюємо копію базового URL
      urlCopy.searchParams.set("sourceType", sourceType);
      urlCopy.searchParams.set("channel", channel);
      // urlCopy.searchParams.set("afSmartRedirect", afSmartRedirect);
      return urlCopy.toString();
    }
  );

  return links;
}

// Регулярки
const URL_REGEX =
  /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|\b(?:s\.click\.|a\.)?aliexpress\.(?:com|ru|es|fr|pt|it|pl|nl|co\.kr|co\.jp|com\.br|com\.tr|com\.vn|us|id|th|ar)(?:\.[\w-]+)?\/[^\s<>"]*/i;
const PRODUCT_ID_REGEX = /\/item\/(\d+)\.html/i;
const STANDARD_ALIEXPRESS_DOMAIN_REGEX =
  /https?:\/\/(?!a\.|s\.click\.)([\w-]+\.)?aliexpress\.(com|ru|es|fr|pt|it|pl|nl|co\.kr|co\.jp|com\.br|com\.tr|com\.vn|us|id\.aliexpress\.com|th\.aliexpress\.com|ar\.aliexpress\.com)(\.([\w-]+))?(\/.*)?/i;
const SHORT_LINK_DOMAIN_REGEX =
  /https?:\/\/(?:s\.click\.aliexpress\.com\/e\/|a\.aliexpress\.com\/_)[a-zA-Z0-9_-]+\/?/i;

// Тестова функція
function testRegex(regex, str) {
  return regex.test(str);
}

// Функція визначення типу
export function getAliExpressLinkType(url) {
  if (PRODUCT_ID_REGEX.test(url)) return "product";
  if (SHORT_LINK_DOMAIN_REGEX.test(url)) return "short";
  // if (STANDARD_ALIEXPRESS_DOMAIN_REGEX.test(url)) return 'standard';
  // if (URL_REGEX.test(url)) return 'url';
  return "unknown";
}

export function getSuccessMessage(promotionLinks) {
  const dataByType = {
    620: { label: "З монетними знижками", emoji: "💰", order: 1 },
    561: { label: "З суперзнижкою", emoji: "🔥", order: 2 },
    680: { label: "Big save (велика економія)", emoji: "💯", order: 3 },
    562: { label: 'З купоном "Земля призів"', emoji: "🌱", order: 4 },
    591: { label: "Пропозиція для комплектів", emoji: "🛍", order: 5 },
  };

  return promotionLinks
    .map(({ promotion_link, source_value }) => {
      const sourceType = defineSourceTypeParamFromFullLink(source_value);
      const typeData = dataByType[sourceType];

      if (!typeData) return null;

      return {
        ...typeData,
        promotion_link,
      };
    })
    .filter(Boolean) // видаляємо null якщо sourceType не знайдено
    .sort((a, b) => a.order - b.order)
    .map(
      ({ emoji, label, promotion_link }) =>
        `${emoji} <a href="${promotion_link}">${label}</a>`
    )
    .join("\n\n");
}

export async function getOriginalUrlFromShort(url) {
  const res = await axios.get(url, { maxRedirects: 5 });
  const responseUrl = res?.request?.res?.responseUrl;
  const urlCopy = new URL(responseUrl);

  if (urlCopy.origin === "https://star.aliexpress.com") {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const finalUrl = page.url();
    await browser.close();
    console.log("https://star.aliexpress.com");
    return finalUrl;
  }
  console.log("NO");
  return responseUrl;
}

function defineSourceTypeParamFromFullLink(fullLink) {
  const urlCopy = new URL(fullLink); // створюємо копію базового URL
  const sourceType = urlCopy.searchParams.get("sourceType");
  return sourceType;
}

console.log(
  defineSourceTypeParamFromFullLink(
    "https://www.aliexpress.com/item/1005007550235757.html?sourceType=561&channel=coin"
  )
);

console.log(await getOriginalUrlFromShort("https://a.aliexpress.com/_EuARbgK"));
// Приклади
console.log(getAliExpressLinkType("https://a.aliexpress.com/_EuARbgK")); // 'short'
console.log(
  getAliExpressLinkType("https://www.aliexpress.com/item/1005001234567890.html")
); // 'product'
console.log(
  getAliExpressLinkType(
    "https://www.aliexpress.com/category/100003109/women-clothing.html"
  )
); // 'standard'
console.log(getAliExpressLinkType("https://example.com")); // 'unknown'
