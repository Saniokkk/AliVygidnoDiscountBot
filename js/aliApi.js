import axios from "axios";
import { generateAliSign } from "./helpers.js";

/**
 * Генерує партнерське посилання для товару   ← короткий опис функції
 * @param {string} appKey                     ← параметр №1: appKey, тип — рядок
 * @param {string} appSecret                  ← параметр №2: appSecret, тип — рядок
 * @param {string} productUrl — звичайне посилання на товар  ← параметр №3: productUrl, з поясненням
 * @param {string} trackingId — твій affiliate tracking ID (PID) ← параметр №4
 */

// Основна функція для формування запиту
export async function getAffiliateLink({
  appKey,
  appSecret,
  productUrl,
  trackingId,
}) {
  const method = "aliexpress.affiliate.link.generate";
  const apiPath = `/${method}`; // ← важливо
  const timestamp = Date.now().toString();
  console.log(productUrl);

  const params = {
    app_key: appKey,
    method,
    timestamp,
    sign_method: "sha256",
    promotion_link_type: "0", // тип посилання (1 = товар)
    source_values: productUrl, // товар
    tracking_id: trackingId, // твій PID
  };

  const sign = generateAliSign(params, appSecret);
  console.log("sign: ", sign);
  const requestParams = { ...params, sign };

  const queryString = new URLSearchParams(requestParams).toString();
  console.log(`URL: `, `https://api-sg.aliexpress.com/sync?${queryString}`);
  try {
    const response = await axios.get(
      `https://api-sg.aliexpress.com/sync?${queryString}`
    );
    return response.data;
  } catch (err) {
    console.error(
      "Affiliate request failed:",
      err.response?.data || err.message
    );
    throw err;
  }
}
