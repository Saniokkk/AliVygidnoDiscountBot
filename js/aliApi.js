import AliexpressApiService from "aliexpress-api";

const ALIEXPRESS_APP_KEY = "514752";
const ALIEXPRESS_APP_SECRET = "eFENhEA5lrwvcJQfQhsH0tpiOsbhRjcD";
const ALIEXPRESS_APP_SIGNATURE = "asdasdas";
const ALIEXPRESS_TRACKING_ID = "default";

const aliexpressApiService = new AliexpressApiService(
  ALIEXPRESS_APP_KEY,
  ALIEXPRESS_APP_SECRET,
  ALIEXPRESS_APP_SIGNATURE,
  ALIEXPRESS_TRACKING_ID
);

export default aliexpressApiService;
