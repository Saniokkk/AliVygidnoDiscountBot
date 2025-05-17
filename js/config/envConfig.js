import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const ALIEXPRESS_APP_KEY = process.env.ALIEXPRESS_APP_KEY;
export const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
export const ALIEXPRESS_APP_SIGNATURE = process.env.ALIEXPRESS_APP_SIGNATURE;
export const ALIEXPRESS_TRACKING_ID =
  process.env.ALIEXPRESS_TRACKING_ID || "default";
