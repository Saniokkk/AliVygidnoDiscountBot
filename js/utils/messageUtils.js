import { defineSourceTypeParamFromFullLink } from "../utils/index.js";

export function getSuccessMessage(promotionLinks) {
  const dataByType = {
    620: { label: "З монетними знижками", emoji: "💰", order: 1 },
    561: { label: "З суперзнижкою", emoji: "🔥", order: 2 },
    680: { label: "Big save (велика економія)", emoji: "💯", order: 3 },
    562: { label: 'З купоном "Земля призів"', emoji: "🌱", order: 4 },
    591: { label: "Пропозиція для комплектів", emoji: "🛍", order: 5 },
  };

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
    .map(
      ({ emoji, label, promotion_link }) =>
        `${emoji} <a href="${promotion_link}">${label}</a>`
    )
    .join("\n\n");
  console.log("!!!!!!promoText", promoText);
  return promoText;
}
