import React from 'react';
import { Container, Grid2 as Grid, Typography } from '@mui/material';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export const products = [
  {
    product_id: 'SF-01',
    product_hash: 'kandi-podi',
    product_name: 'Kandi Podi / Toor Dal Spice Powder ',
    product_image: '/images/kandi.jpg',
    product_description:
      'Our Kandi Podi blends high-quality lentils with rich, savory flavor. Perfect with mango, tomato, or Gongura pickles, it enhances rice and ghee with a comforting taste.',
    best_used_for:
      'Mixing with rice, ghee, and pickles or as a flavorful topping for dosa and idli.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Kandi Pappu (Toor Dal)',
      'Sanga Pappu (Chana Dal)',
      'Pesara Pappu (Moong Dal)',
      'Mina Pappu (Urad Dal)',
      'Jeera (Cumin)',
      'Karam (Chili Powder)',
      'Salt',
      'Hing (Asafoetida)',
    ],
    nutritionalInfo: {
      calories: '34 kcal',
      protein: '2.1g',
      fat: '.5g',
      carbohydrates: '5.5g',
      fiber: '1.5g',
    },
  },
  {
    product_id: 'SF-02',
    product_hash: 'nuvulla-podi',
    product_name: 'Nuvvula Podi / Sesame Seed Powder',
    product_image: '/images/nuvulla.jpg',
    product_description:
      'Finely ground from roasted sesame seeds, this podi adds a nutty richness and health benefits. A sprinkle transforms simple dishes with depth and a hint of sesame.',
    best_used_for:
      'Mixing with rice, seasoning salads, or adding richness to curries.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Nuvvulu (Sesame Seeds)',
      'Dry Mirchi (Dry Red Chilies)',
      'Salt',
    ],
    nutritionalInfo: {
      calories: '58 kcal',
      protein: '2.5g',
      fat: '4.5g',
      carbohydrates: '4g',
      fiber: '1.5g',
    },
  },
  {
    product_id: 'SF-03',
    product_hash: 'palli-podi',
    product_name: 'Palli Podi / Peanut Powder',
    product_image: '/images/kandi.jpg',
    product_description:
      'Bold, nutty, and packed with flavor, our Palli Podi uses premium peanuts ground to perfection. It brings a satisfying crunch and a touch of protein to any meal.',
    best_used_for:
      'Rice dishes, chutneys, or as a crunchy side for breakfast dishes like idli and dosa.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Pallilu (Peanuts)',
      'Mirchi (Chili)',
      'Putnalu (Roasted Gram)',
      'Jeera (Cumin)',
      'Salt',
    ],
    nutritionalInfo: {
      calories: '59 kcal',
      protein: '2.8g',
      fat: '4.8g',
      carbohydrates: '3.2g',
      fiber: '1g',
    },
  },
  {
    product_id: 'SF-04',
    product_hash: 'karam-podi',
    product_name: 'Garlic Karappodi / Idli Karam',
    product_image: '/images/karam.jpg',
    product_description:
      'Spicy and smoky, this chili powder packs an intense flavor, ideal for adding heat. Made in a clean environment, it’s a delicious way to spice up your breakfast dishes or curries.',
    best_used_for: 'Pairing with ghee on idli, dosa, or upma.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Dhaniyalu (Coriander Seeds)',
      'Minaa Pappu (Urad Dal)',
      'Senaga Pappu (Chana Dal)',
      'Chintapandu (Tamarind)',
      'Jeera (Cumin)',
      'Dry Mirchi (Dry Red Chilies)',
      'Salt',
      'Garlic',
    ],
    nutritionalInfo: {
      calories: '42 kcal',
      protein: '2.8g',
      fat: '1.8g',
      carbohydrates: '5g',
      fiber: '1.2g',
    },
  },
  {
    product_id: 'SF-05',
    product_hash: 'kobbari-podi',
    product_name: 'Kobbari Podi / Coconut Garlic Powder',
    product_image: '/images/nuvulla.jpg',
    product_description:
      'Sun-dried coconut creates this creamy, naturally sweet podi. Bringing tropical flavors of South India, it enriches every bite with a homemade touch.',
    best_used_for:
      'Adding depth to rice, curries, vegetable dishes, or topping idli and dosa.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Dry Kobbari (Dry Coconut)',
      'Pachi Senaga Pappu (Raw Chana Dal)',
      'Putnalu (Roasted Gram)',
      'Mirchi (Chili)',
      'Salt',
      'Jeera (Cumin)',
      'Garlic',
    ],
    nutritionalInfo: {
      calories: '53 kcal',
      protein: '2.5g',
      fat: '4.2g',
      carbohydrates: '4.2g',
      fiber: '1.4g',
    },
  },
  {
    product_id: 'SF-06',
    product_hash: 'putnalu-podi',
    product_name: 'Putnalu Podi / Roasted Gram Powder',
    product_image: '/images/karam.jpg',
    product_description:
      'Lightly nutty and made from roasted chickpeas, this podi is packed with protein and crunch, making healthy eating delicious and easy.',
    best_used_for:
      'Mixing with rice and ghee or topping your favorite breakfast dishes.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Dry Kobbari (Dry Coconut)',
      'Pachi Senaga Pappu (Raw Chana Dal)',
      'Putnalu (Roasted Gram)',
      'Mirchi (Chili)',
      'Salt',
      'Jeera (Cumin)',
    ],
    nutritionalInfo: {
      calories: '53 kcal',
      protein: '2.5g',
      fat: '4.2g',
      carbohydrates: '4.2g',
      fiber: '1.4g',
    },
  },
  {
    product_id: 'SF-07',
    product_hash: 'kura-podi',
    product_name: 'Kura Podi / Curry Powder',
    product_image: '/images/nuvulla.jpg',
    product_description:
      'A special blend of spices, Kura Podi infuses curries and vegetable dishes with warmth and depth. This spice mix captures the traditional flavors of Andhra and Telangana.',
    best_used_for:
      'Flavoring vegetable curries, enhancing gravies, and adding aroma to stir-fries.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Senaga Pappu (Chana Dal)',
      'Mina Pappu (Urad Dal)',
      'Pallilu (Peanuts)',
      'Dhaniya (Coriander Seeds)',
      'Dry Coconut Powder',
      'Nuvvulu (Sesame Seeds)',
      'Salt',
      'Jeera (Cumin)',
    ],
    nutritionalInfo: {
      calories: '50 kcal',
      protein: '3g',
      fat: '3.6g',
      carbohydrates: '4.5g',
      fiber: '1.6g',
    },
  },
  {
    product_id: 'SF-08',
    product_hash: 'avisala-podi',
    product_name: 'Avisala Podi / Flax Seeds Powder',
    product_image: '/images/nuvulla.jpg',
    product_description:
      'A special blend of spices, Kura Podi infuses curries and vegetable dishes with warmth and depth. This spice mix captures the traditional flavors of Andhra and Telangana.',
    best_used_for:
      'Flavoring vegetable curries, enhancing gravies, and adding aroma to stir-fries.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Flax Seeds',
      'Bengal Gram',
      'Black Gram',
      'Tamarind',
      'Dry Chilli',
      'Salt',
      'Cumin',
      'Garlic',
    ],
    nutritionalInfo: {
      calories: '127.5kcal',
      protein: '6.3g',
      fat: '10.25g',
      carbohydrates: '5.5g',
      fiber: '3.4g',
    },
  },
  {
    product_id: 'SF-09',
    product_hash: 'karivepaku-podi',
    product_name: 'Karivepaku Karam podi',
    product_image: '/images/karam.jpg',
    product_description:
      'A special blend of spices, Kura Podi infuses curries and vegetable dishes with warmth and depth. This spice mix captures the traditional flavors of Andhra and Telangana.',
    best_used_for:
      'Flavoring vegetable curries, enhancing gravies, and adding aroma to stir-fries.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Curry Leaves',
      'Bengal Gram',
      'Black Gram',
      'Coriander Seeds',
      'Tamarind',
      'Dry Chilli',
      'Garlic',
      'Salt',
      'Cumin',
      'Sunflower Oil',
    ],
    nutritionalInfo: {
      calories: '145 kcal',
      protein: '5.5g',
      fat: '12.25g',
      carbohydrates: '8.1g',
      fiber: '3.45g',
    },
  },
  {
    product_id: 'SF-10',
    product_hash: 'sambar-podi',
    product_name: 'Sambar Podi',
    product_image: '/images/nuvulla.jpg',
    product_description:
      'A special blend of spices, Kura Podi infuses curries and vegetable dishes with warmth and depth. This spice mix captures the traditional flavors of Andhra and Telangana.',
    best_used_for:
      'Flavoring vegetable curries, enhancing gravies, and adding aroma to stir-fries.',
    quantities_available: ['250gms', '500gms', '1KG'],
    prices: {
      '250gms': 175,
      '500gms': 300,
      '1KG': 575,
    },
    discountedPrices: {
      '250gms': 150,
      '500gms': 275,
      '1KG': 525,
    },
    ingredients: [
      'Bengal Gram',
      'Black Gram',
      'Dry Chilli',
      'Coriander Seeds',
      'Tamarind',
      'Sunflower oil',
      'Salt',
      'Jeera (Cumin)',
    ],
    nutritionalInfo: {
      calories: '107.5 kcal',
      protein: '4.2g',
      fat: '6.6g',
      carbohydrates: '8.3g',
      fiber: '2.3g',
    },
  },
];

const handleAddToCart = (productId) => {
  console.log(`Added product ${productId} to cart.`);
};

const ProductsPage = () => {
  const viewMode = 'grid';
  return (
    <>
      <Head>
        <title> Products| Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods`} />
        <meta property="og:title" content={`Products | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/products`}
        />
      </Head>
      <Container>
        <Typography variant="h4" sx={{ margin: '.5em 0', textAlign: 'center' }}>
          All Products
        </Typography>
        {/* Toggle Button for Grid/List View Switch */}
        {/* <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewToggle}
          aria-label="view mode"
          sx={{ marginBottom: 4 }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            Grid
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            List
          </ToggleButton>
        </ToggleButtonGroup> */}
        <Grid container spacing={3} sx={{ justifyContent: 'center', mb: 2 }}>
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              key={product.id}
            >
              <ProductCard product={product} viewMode={viewMode} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ProductsPage;
