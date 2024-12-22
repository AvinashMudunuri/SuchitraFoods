import Medusa from '@medusajs/medusa-js';

const medusaClient = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000', // Use environment variable for production URL
  maxRetries: 3,
  customHeaders: {
    'x-publishable-api-key':
      process.env.NEXT_PUBLIC_MEDUSA_API_KEY ||
      'pk_ae64b41d205a08e5ae6856079ddd54bcd81fa8bffed1186a5bccffccaf8e2e52', // Use environment variable for production API key
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFKQkVFWVdLVlNCMDZETVZaSDRYSldIMVkiLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFKQkVFWVdKQkdONlNIV1RWTUNTSzdZSDEiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFKQkVFWVdLVlNCMDZETVZaSDRYSldIMVkifSwiaWF0IjoxNzMyMjQ3NDgwLCJleHAiOjE3MzIzMzM4ODB9.ekcslWLH9XDEej46IWJCrt_BHJa3YZfDVtz6V2uDHBM',
  },
});

export default medusaClient;
