import { wrapWithRedirectLink, toMobileAliExpressLink } from "./index.js";

export function getAliExpressPromoLinks(url) {
  const baseUrl = new URL(url);
  console.log("baseUrl", baseUrl.toString());
  baseUrl.search = ""; // очищаємо всі параметри
  // const mobBaseUrl = toMobileAliExpressLink(baseUrl);
  const channelsParams = [
    {
      sourceType: "620",
      channel: "coin",
      afSmartRedirect: "y",
    },
    {
      sourceType: "562",
      channel: "coin",
      afSmartRedirect: "y",
    },
    {
      sourceType: "561",
      channel: "coin",
      afSmartRedirect: "y",
    },
    {
      sourceType: "680",
      channel: "coin",
      afSmartRedirect: "y",
    },
    {
      sourceType: "591",
      channel: "coin",
      afSmartRedirect: "y",
    },
  ];

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
      const cleanUrl = urlCopy.toString();
      // const redirectedUrl = wrapWithRedirectLink(cleanUrl); // тут обгортка
      return cleanUrl;
    }
  );

  return links;
}
