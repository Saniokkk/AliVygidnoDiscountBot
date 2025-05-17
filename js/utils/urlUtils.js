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

export function defineSourceTypeParamFromFullLink(fullLink) {
  const urlCopy = new URL(fullLink); // створюємо копію базового URL
  const sourceType = urlCopy.searchParams.get("sourceType");
  return sourceType;
}
