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
    type: product.type.value,
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
