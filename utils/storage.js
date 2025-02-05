const STORAGE_KEYS = {
  CART_ID: 'cart_id',
  REGION_ID: 'region_id',
  AUTH_TOKEN: 'auth_token',
  CUSTOMER: 'customer',
  SHIPPING_METHODS: 'shipping_methods',
  PAYMENT_METHODS: 'payment_methods',
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) =>
        localStorage.removeItem(key)
      );
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
