import { toMobileAliExpressLink } from "./index.js";

function decodeQueryParams(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const decodedParams = new URLSearchParams();

  for (const [key, value] of params.entries()) {
    // Декодуємо значення параметра
    decodedParams.append(key, decodeURIComponent(value));
  }

  // Формуємо новий URL з розкодованими параметрами
  urlObj.search = decodedParams.toString();

  return urlObj.toString();
}
export function wrapWithRedirectLink(originalUrl) {
  // const decodedUrl = decodeQueryParams(originalUrl);
  // const mobBaseUrl = toMobileAliExpressLink(originalUrl);
  const encodedRedirectUrl = encodeURIComponent(originalUrl);
  return `https://star.aliexpress.com/share/share.htm?redirectUrl=${encodedRedirectUrl}`;
}
