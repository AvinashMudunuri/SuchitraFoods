import { isEqual, pick, isEmpty } from 'lodash';
import { CreditCard } from '@mui/icons-material';
export const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
};

export const getQuantitiesAvailable = (variants) => {
  const quantitiesAvailable = [
    ...new Set(
      variants.flatMap((variant) =>
        variant.options.map((option) => option.value)
      )
    ),
  ];

  return quantitiesAvailable;
};

export const getPricesByQuantity = (variants) => {
  const prices = {};

  variants.forEach((variant) => {
    const quantity = variant.options[0].value;
    const price = variant.calculated_price.original_amount;

    prices[quantity] = price;
  });

  return prices;
};

export const getDiscountedPricesByQuantity = (variants) => {
  const prices = {};

  variants.forEach((variant) => {
    const quantity = variant.options[0].value;
    const price = variant.calculated_price.calculated_amount;

    prices[quantity] = price;
  });

  return prices;
};

export const getVariationIdsByQuantity = (variants) => {
  const variationIds = {};

  variants.forEach((variant) => {
    const quantity = variant.options[0].value;
    const variationId = variant.id;

    variationIds[quantity] = variationId;
  });

  return variationIds;
};

export const getInventoryByQuantity = (variants) => {
  if (!Array.isArray(variants)) return {};

  const inventory = {};

  variants.forEach((variant) => {
    if (variant?.options?.[0]?.value) {
      const quantity = variant.options[0].value;
      const inventoryQuantity = variant.inventory_quantity || 0;
      inventory[quantity] = inventoryQuantity;
    }
  });

  return inventory;
};

export const generateNutrition = (metadata) => {
  if (!metadata) return null;

  const nutrition = {
    calories: `${metadata.nutrition_calories} kcal`,
    carbs: `${metadata.nutrition_carbs} g`,
    fat: `${metadata.nutrition_fats} g`,
    fiber: `${metadata.nutrition_fiber} g`,
    protein: `${metadata.nutrition_protien} g`,
  };

  return nutrition;
};

export const transformProduct = (product) => {
  return {
    id: product.id,
    hash: product.handle,
    name: product.title,
    description: product.description,
    image: product.thumbnail,
    metadata: product.metadata,
    quantities_available: getQuantitiesAvailable(product.variants),
    prices: getPricesByQuantity(product.variants),
    variantionIds: getVariationIdsByQuantity(product.variants),
    inventory: getInventoryByQuantity(product.variants),
    discountedPrices: getDiscountedPricesByQuantity(product.variants),
    material: product.material,
    nutritionalInfo: generateNutrition(product.metadata),
  };
};

export const transformedProducts = (products) => {
  if (!Array.isArray(products)) return [];
  if (products.length === 0) return [];
  return products.map((product) => transformProduct(product));
};

const countryCodes = {
  IN: '+91',
  US: '+1',
  CA: '+1',
  GB: '+44',
  AU: '+61',
  // Add more country codes as needed
};

export const getCountryCode = (countryCode) => {
  return countryCodes[countryCode] || '';
};

export const compareAddresses = (address1, address2) => {
  return isEqual(
    pick(address1, [
      'first_name',
      'last_name',
      'address_1',
      'address_2',
      'company',
      'postal_code',
      'city',
      'country_code',
      'province',
      'phone',
    ]),
    pick(address2, [
      'first_name',
      'last_name',
      'address_1',
      'address_2',
      'company',
      'postal_code',
      'city',
      'country_code',
      'province',
      'phone',
    ])
  );
};

export const convertToLocale = ({
  amount,
  currency_code,
  locale = 'en-IN',
}) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency_code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : amount.toString();
};

export const paymentInfoMap = {
  pp_system_default: {
    title: 'Cash On Delivery',
    icon: <CreditCard />,
  },
  pp_razorpay_razorpay: {
    title: 'Razorpay',
    icon: <CreditCard />,
  },
};

export const isRazorPay = (providerId) => {
  return providerId?.startsWith('pp_razorpay_razorpay');
};

export const isManual = (providerId) => {
  return providerId?.startsWith('pp_system_default');
};

export const medusaError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const u = new URL(error.config.url, error.config.baseURL);
    console.error('Resource:', u.toString());
    console.error('Response data:', error.response.data);
    console.error('Status code:', error.response.status);
    console.error('Headers:', error.response.headers);

    // Extracting the error message from the response data
    const message = error.response.data.message || error.response.data;

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + '.');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response received: ' + error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up the request: ' + error.message);
  }
};

export const getShippingStateLabel = (countryCode) => {
  return countryCode === 'in' ? 'State' : 'Province';
};

export const getShippingPostalLabel = (countryCode) => {
  switch (countryCode) {
    case 'in':
      return 'PIN code';
    case 'us':
      return 'ZIP code';
    case 'ca':
    case 'de':
      return 'Postal code';
    case 'au':
    case 'gb':
      return 'Postcode';
    default:
      return 'Postal code';
  }
};

export const countries = [
  {
    code: 'in',
    iso2: 'in',
    name: 'India',
    dailCode: '+91',
    phone_code: '+91',
    phone_pattern: /^[6-9]\d{9}$/,
    postal_pattern: /^[1-9]\d{5}$/,
    currency_code: 'INR',
    value: 'in',
    label: 'India',
    shipping_method: 'SO-IN',
    shipping_method_label: 'Standard',
  },
  {
    code: 'us',
    iso2: 'us',
    name: 'United States',
    dailCode: '+1',
    phone_code: '+1',
    phone_pattern: /^\d{10}$/,
    currency_code: 'USD',
    value: 'us',
    label: 'United States',
    shipping_method: 'SO-US',
    shipping_method_label: 'Express',
    postal_pattern: /^[0-9]{5}$/,
  },
  {
    code: 'ca',
    iso2: 'ca',
    name: 'Canada',
    dailCode: '+1',
    phone_code: '+1',
    phone_pattern: /^\d{10}$/,
    currency_code: 'CAD',
    value: 'ca',
    label: 'Canada',
    shipping_method: 'SO-CA',
    shipping_method_label: 'Express',
    postal_pattern: /^[A-Z0-9]{6}$/,
  },
  {
    code: 'gb',
    iso2: 'gb',
    name: 'United Kingdom',
    dailCode: '+44',
    phone_code: '+44',
    phone_pattern: /^\d{10}$/,
    currency_code: 'GBP',
    value: 'gb',
    label: 'United Kingdom',
    shipping_method: 'SO-GB',
    shipping_method_label: 'Express UK',
    postal_pattern: /^[A-Z0-9]{6}$/,
  },
  {
    code: 'au',
    iso2: 'au',
    name: 'Australia',
    dailCode: '+61',
    phone_code: '+61',
    phone_pattern: /^\d{10}$/,
    currency_code: 'AUD',
    value: 'au',
    label: 'Australia',
    shipping_method: 'SO-AU',
    shipping_method_label: 'Express AU',
    postal_pattern: /^[A-Z0-9]{4}$/,
  },
  {
    code: 'de',
    iso2: 'de',
    name: 'Germany',
    dailCode: '+49',
    phone_code: '+49',
    phone_pattern: /^\d{1,14}$/,
    postal_pattern: /^\d{5}$/,
    currency_code: 'EUR',
    value: 'de',
    label: 'Germany',
    shipping_method: 'SO-DE',
    shipping_method_label: 'Standard Germany',
  },
];

export const getCountry = (countryCode) => {
  return countries.find((c) => c.code === countryCode);
};

export const getCountryByPhoneCode = (phoneCode) => {
  return countries.find((c) => c.phone_code === phoneCode);
};

export const getShippingMethodLabel = (shippingMethodLabel) => {
  const country = countries.find(
    (c) => c.shipping_method === shippingMethodLabel
  );
  return country?.shipping_method_label || '';
};

export const getShippingMethodCost = (shippingMethod) => {
  return shippingMethod.cost.formatted_with_symbol;
};
