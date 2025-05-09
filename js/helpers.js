import crypto from "crypto";

/**
 * Генерація підпису для Open Platform AliExpress API
 * @param {Object} params - об'єкт з параметрами запиту (без sign)
 * @param {string} appSecret - твій App Secret
 * @returns {string} - підпис (sign)
 */
export function generateAliSign(params, appSecret) {
  const sortedKeys = Object.keys(params).sort(); // ASCII sort

  let signStr = "";
  for (const key of sortedKeys) {
    const value = params[key];
    if (key && value !== undefined && value !== "") {
      signStr += key + value;
    }
  }

  const fullStr = appSecret + signStr + appSecret;

  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(fullStr, "utf8");
  return hmac.digest("hex").toUpperCase(); // Обовʼязково верхнім регістром
}
