import puppeteer from "puppeteer";
import axios from "axios";

export async function getOriginalUrlFromShort(url) {
  try {
    const res = await axios.get(url, { maxRedirects: 5 });
    const responseUrl = res?.request?.res?.responseUrl;

    if (!responseUrl) {
      console.warn("Не вдалося визначити остаточну URL-адресу");
      return null;
    }

    const parsedUrl = new URL(responseUrl);

    if (parsedUrl.origin === "https://star.aliexpress.com") {
      console.log("Обробка через Puppeteer: star.aliexpress.com");

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "networkidle2" });
      const finalUrl = page.url();

      await browser.close();
      return finalUrl;
    }

    console.log("Редірект не на star.aliexpress.com");
    return responseUrl;
  } catch (error) {
    console.error("Помилка при отриманні URL:", error.message);
    return null;
  }
}
