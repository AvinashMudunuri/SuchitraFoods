const hasCartProperty = (cart, propertyPath) => {
  if (!cart) return false;

  // Handle nested properties using dot notation (e.g., 'shipping_address.first_name')
  const properties = propertyPath.split('.');
  let value = cart;

  for (const prop of properties) {
    // Check if current level exists
    if (!value || typeof value !== 'object') {
      return false;
    }

    value = value[prop];

    // Check various falsy conditions
    if (value === undefined || value === null) {
      return false;
    }

    // For arrays, check length
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    // For strings, check if empty or only whitespace
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }

    // For objects (except Date), check if empty
    if (
      typeof value === 'object' &&
      !(value instanceof Date) &&
      Object.keys(value).length === 0
    ) {
      return false;
    }
  }

  return true;
};

export const cartValidation = {

  isAddressDifferent: (cart, selectedAddress) => {
    if (!cart?.shipping_address || !selectedAddress) return true;

    const addressFields = [
      'first_name',
      'last_name',
      'address_1',
      'address_2',
      'city',
      'postal_code',
      'province',
      'country_code',
      'phone'
    ];

    return addressFields.some(field =>
      (cart.shipping_address[field] || '') !== (selectedAddress[field] || '')
    );
  },

  hasItems: (cart) => {
    return hasCartProperty(cart, 'items') && cart.items.length > 0;
  },

  hasShippingAddress: (cart) => {
    const requiredFields = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'postal_code',
      'province',
      'country_code',
      'phone',
    ];

    return requiredFields.every((field) =>
      hasCartProperty(cart, `shipping_address.${field}`)
    );
  },

  hasEmail: (cart) => {
    return hasCartProperty(cart, 'email');
  },

  hasShippingMethod: (cart) => {
    return (
      hasCartProperty(cart, 'shipping_methods') &&
      cart.shipping_methods.length > 0
    );
  },

  hasPaymentSession: (cart) => {
    return (
      hasCartProperty(cart, 'payment_collection') &&
      cart.payment_collection.payment_sessions.length > 0
    );
  },

  isReadyForCheckout: (cart) => {
    const checks = {
      items: cartValidation.hasItems(cart),
      shippingAddress: cartValidation.hasShippingAddress(cart),
      email: cartValidation.hasEmail(cart),
      shippingMethod: cartValidation.hasShippingMethod(cart),
      paymentSession: cartValidation.hasPaymentSession(cart),
    };

    return {
      isReady: Object.values(checks).every(Boolean),
      missingSteps: Object.entries(checks)
        .filter(([_, value]) => !value)
        .map(([key]) => key),
    };
  },
};
