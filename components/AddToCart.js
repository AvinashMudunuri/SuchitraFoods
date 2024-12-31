import { useState } from 'react';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';

const AddToCartButton = ({ productId }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axios.post('/api/cart', { productId });
      alert('Item added to cart!');
    } catch (error) {
      console.error('Failed to add item to cart', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      onClick={handleAddToCart}
      loading={loading}
      variant="contained"
      sx={{
        minWidth: '120px',
        textTransform: 'none', // Prevents all-caps
        fontSize: '1rem',
        padding: '8px',
        borderRadius: '4px',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
        '&.Mui-disabled': {
          bgcolor: 'action.disabledBackground',
          color: 'action.disabled',
        },
      }}
    >
      Add to Cart
    </LoadingButton>
  );
};

export default AddToCartButton;
