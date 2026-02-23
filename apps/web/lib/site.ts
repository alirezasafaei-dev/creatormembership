export const siteName = 'AsDev Creator Membership';
export const siteShortName = 'AsDev Membership';
export const siteDescription = 'پلتفرم عضویت کریتور با معماری local-first، پرداخت امن، و اتوماسیون عملیاتی.';

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getWebBaseUrl() {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_WEB_BASE_URL || 'http://127.0.0.1:3000');
}

export function getApiBaseUrl() {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000');
}
