import AliexpressApiService from "aliexpress-api";
import {
  ALIEXPRESS_APP_KEY,
  ALIEXPRESS_APP_SECRET,
  ALIEXPRESS_APP_SIGNATURE,
  ALIEXPRESS_TRACKING_ID,
} from "../config/envConfig.js";

const aliexpressApiService = new AliexpressApiService(
  ALIEXPRESS_APP_KEY,
  ALIEXPRESS_APP_SECRET,
  ALIEXPRESS_APP_SIGNATURE,
  ALIEXPRESS_TRACKING_ID
);

export default aliexpressApiService;
