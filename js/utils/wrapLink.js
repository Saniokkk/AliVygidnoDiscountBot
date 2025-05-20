export function wrapWithRedirectLink(originalUrl) {
  //   const encoded = encodeURIComponent(originalUrl.trim());
  return `https://star.aliexpress.com/share/share.htm?&redirectUrl=${originalUrl}&`;
}
