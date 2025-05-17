// Регулярки
const URL_REGEX =
  /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|\b(?:s\.click\.|a\.)?aliexpress\.(?:com|ru|es|fr|pt|it|pl|nl|co\.kr|co\.jp|com\.br|com\.tr|com\.vn|us|id|th|ar)(?:\.[\w-]+)?\/[^\s<>"]*/i;
const PRODUCT_ID_REGEX = /\/item\/(\d+)\.html/i;
const STANDARD_ALIEXPRESS_DOMAIN_REGEX =
  /https?:\/\/(?!a\.|s\.click\.)([\w-]+\.)?aliexpress\.(com|ru|es|fr|pt|it|pl|nl|co\.kr|co\.jp|com\.br|com\.tr|com\.vn|us|id\.aliexpress\.com|th\.aliexpress\.com|ar\.aliexpress\.com)(\.([\w-]+))?(\/.*)?/i;
const SHORT_LINK_DOMAIN_REGEX =
  /https?:\/\/(?:s\.click\.aliexpress\.com\/e\/|a\.aliexpress\.com\/_)[a-zA-Z0-9_-]+\/?/i;

// Функція визначення типу
export function getAliExpressLinkType(url) {
  if (PRODUCT_ID_REGEX.test(url)) return "product";
  if (SHORT_LINK_DOMAIN_REGEX.test(url)) return "short";
  // if (STANDARD_ALIEXPRESS_DOMAIN_REGEX.test(url)) return 'standard';
  // if (URL_REGEX.test(url)) return 'url';
  return "unknown";
}

// Тестова функція
function testRegex(regex, str) {
  return regex.test(str);
}
