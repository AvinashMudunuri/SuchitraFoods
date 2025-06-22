import axios from 'axios';

const axiosClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  headers: {
    'x-publishable-api-key':
      process.env.NEXT_PUBLIC_MEDUSA_API_KEY ||
      'pk_ae64b41d205a08e5ae6856079ddd54bcd81fa8bffed1186a5bccffccaf8e2e52',
  },
});

// Add a response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized errors, e.g., redirect to login page
      console.error('Unauthorized:', error);
    } else {
      console.error('Request failed:', error);
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to set custom headers if needed
axiosClient.interceptors.request.use((config) => {
  // Add custom headers based on the API method
  switch (config.method) {
    case 'post':
    case 'put':
    case 'patch':
      if (config.data && typeof config.data === 'object') {
        config.data = JSON.stringify(config.data);
        config.headers['Content-Type'] = 'application/json';
      }
      break;
    case 'delete':
      config.data = JSON.stringify(config.data);
      config.headers['Content-Type'] = 'application/json';
      break;
    default:
      break;
  }

  return config;
});

export const getAxiosClient = (baseURL) => {
  const client = axios.create({
    baseURL,
  });

  // Add interceptors to the new client
  client.interceptors.response.use(
    axiosClient.interceptors.response.handlers[0],
    axiosClient.interceptors.response.handlers[1]
  );
  client.interceptors.request.use(axiosClient.interceptors.request.handlers[0]);

  return client;
};

export default axiosClient;
