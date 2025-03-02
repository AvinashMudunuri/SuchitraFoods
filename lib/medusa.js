import Medusa from '@medusajs/js-sdk';
import { getCookie } from './clientCookies';
// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_API_KEY,
});

export const getClientAuthHeaders = () => {
  const token = getCookie('_medusa_jwt');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};
