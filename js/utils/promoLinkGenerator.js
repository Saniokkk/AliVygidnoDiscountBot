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
