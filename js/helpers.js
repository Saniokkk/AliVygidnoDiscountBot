import crypto from "crypto";
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

export function getSuccessMessage(promoLinks) {
  const template = [
    { label: "З монетними знижками", emoji: "🪙" },
    { label: 'З купоном "Земля призів"', emoji: "🌱" },
    { label: "З суперзнижкою", emoji: "🔥" },
    { label: "Big save (велика економія)", emoji: "💯" },
    { label: "Пропозиція для комплектів", emoji: "🛍" },
  ];
  console.log("promoLinks", promoLinks);
  const arr = template.map((obj, index) => {
    return { ...obj, ...promoLinks[index] };
  });

  return arr
    .map(
      ({ promotion_link, emoji, label }) =>
        `${emoji} <a href="${promotion_link}">${label}</a>`
    )
    .join("\n\n");
}

export async function getOriginalUrlFromShort(url) {
  const data = await axios.get(url);
  return data?.request?.res?.responseUrl;
}

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

// /**
//  * Генерація підпису для Open Platform AliExpress API
//  * @param {Object} params - об'єкт з параметрами запиту (без sign)
//  * @param {string} appSecret - твій App Secret
//  * @returns {string} - підпис (sign)
//  */
// export function generateAliSign(params, appSecret) {
//   const sortedKeys = Object.keys(params).sort(); // ASCII sort

//   let signStr = "";
//   for (const key of sortedKeys) {
//     const value = params[key];
//     if (key && value !== undefined && value !== "") {
//       signStr += key + value;
//     }
//   }

//   const fullStr = appSecret + signStr + appSecret;

//   const hmac = crypto.createHmac("sha256", appSecret);
//   hmac.update(fullStr, "utf8");
//   return hmac.digest("hex").toUpperCase(); // Обовʼязково верхнім регістром
// }

// const stringForTest =
//   "Я щойно знайшов це на AliExpress: грн.1,608.50 | Зарядний пристрій Vention 20 Вт GaN PD3.0 Швидка зарядка для iPhone 16 15 14 13 Pro Max iPad Samsung USB Type C Зарядний пристрій з кабелем C до Lhttps://a.aliexpress.com/_EuARbgK";
// const stringForTest2 =
//   "Я щойно знайшов це на AliExpress:грн.1,836.83 | FNIRSI HS-01 Паяльник з регульованою температурою DC 24V 80-420 ℃   Зварювальна паяльна станція PD 65W Портативний інструмент для ремонтуhttps://www.aliexpress.com/item/1005008924982938.html?sourceType=620&channel=coin&aff_fcid=965ea0a8ebd6439f89c7813c9b397c57-1747050339875-03933-_oC0Rfen&aff_fsk=_oC0Rfen&aff_platform=api-new-link-generate&sk=_oC0Rfen&aff_trace_key=965ea0a8ebd6439f89c7813c9b397c57-1747050339875-03933-_oC0Rfen&terminal_id=d92e85522c7c4448ac452b492dad038d&gatewayAdapt=vnm2glo ";
// console.log(extractUrl(stringForTest2));
// console.log(
//   "getAliExpressPromoLinks: ",
//   getAliExpressPromoLinks(extractUrl(stringForTest2))
// );
