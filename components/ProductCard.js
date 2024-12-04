import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Link,
} from '@mui/material';
import PropTypes from 'prop-types';
import AddToCartButton from './AddToCart';

const ProductCard = ({
  product: {
    product_id,
    product_image,
    product_name,
    product_description,
    best_used_for,
    quantities_available,
    discountedPrices,
    prices,
  },
  viewMode,
}) => {
  const isListMode = viewMode === 'list';
  return (
    <Card
      sx={{ display: 'flex', flexDirection: isListMode ? 'row' : 'column' }}
    >
      <CardMedia
        component="img"
        sx={{
          width: isListMode ? 160 : '100%',
          height: isListMode ? 160 : 140,
        }}
        image={product_image}
        alt={product_name}
      />
      <CardContent>
        <Typography variant="h6">{product_name}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: '1em', maxWidth: '300px' }}
        >
          {product_description}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ maxWidth: '300px' }}
        >
          <strong>Best used for:</strong> {best_used_for}
        </Typography>
        {/* Display Quantities and Prices */}
        <Box sx={{ marginTop: '1em' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Pack Sizes:</strong>
          </Typography>
          <Box sx={{ marginTop: '0.5em' }}>
            {quantities_available.map((quantity) => (
              <Box
                key={quantity}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5em 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <Typography variant="body2" color="text.primary">
                  {quantity}
                </Typography>
                {/* Show Original Price with Strikethrough if Discounted Price is Available */}
                {discountedPrices[quantity] ? (
                  <>
                    {/* Display Launch Offer Label if Discounted */}
                    <Chip
                      label="Launch Offer"
                      color="primary"
                      sx={{ alignSelf: 'start', marginBottom: '0.5em' }}
                      size="small"
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5em',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{prices[quantity]}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ₹{discountedPrices[quantity]}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="primary">
                    ₹{prices[quantity]}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button component={Link} href={`/product/${product_id}`} variant="text">
          View Details
        </Button>
        <AddToCartButton product_id={product_id} />
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
  viewMode: PropTypes.string,
};

export default ProductCard;
