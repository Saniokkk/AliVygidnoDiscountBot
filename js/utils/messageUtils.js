import { defineSourceTypeParamFromFullLink } from "../utils/index.js";

export function getSuccessMessage(promotionLinks) {
  const dataByType = {
    620: { label: "З монетними знижками", emoji: "💰", order: 1 },
    561: { label: "З суперзнижкою", emoji: "🔥", order: 2 },
    680: { label: "Big save (велика економія)", emoji: "💯", order: 3 },
    562: { label: 'З купоном "Земля призів"', emoji: "🌱", order: 4 },
    591: { label: "Пропозиція для комплектів", emoji: "🛍", order: 5 },
  };

  const quoteBlock = `
<i>⚠️Для отримання максимальної монетної знижки — додайте товар у кошик або в обране,
потім придбайте тут: <a href="https://s.click.aliexpress.com/e/_oDWMStG"><b>придбайте тут</b></a></i>
  `.trim();

  console.log("promotionLinks", promotionLinks);
  const promoText = promotionLinks
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
    .map(({ emoji, label, promotion_link, order }) => {
      let text = `${emoji} <a href="${promotion_link}">${label}</a>`;
      if (order === 1) {
        text += `\n\n${quoteBlock}`;
      }
      return text;
    })
    .join("\n\n");

  // const quoteBlock = `⚠️ <b>При меншій монетній знижці</b> — додайте товар у кошик або в обране, потім придбайте тут:\nhttps://s.click.aliexpress.com/e/_oE8JGL0`;

  //   const quoteBlock = `<pre>
  // ⚠️При меншій монетній знижці —
  // додайте товар у кошик або в обране,
  // потім придбайте тут:
  // https://s.click.aliexpress.com/e/_oE8JGL0
  // </pre>`;

  // const quoteBlock = `>> ⚠️При меншій монетній знижці — додайте товар у кошик або в обране,\n>> потім придбайте тут:\n>> https://s.click.aliexpress.com/e/_oE8JGL0`;

  console.log("!!!!!!promoText", promoText);
  return `<b>Ваш товар в різних розділах:</b> \n\n ${promoText}`;
}
