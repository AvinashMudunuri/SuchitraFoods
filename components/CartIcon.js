import Link from 'next/link';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { state } = useCart();

  return (
    <IconButton color="white">
      <Link href="/cart" passHref>
        <Badge badgeContent={state.totalItems} color="secondary">
          <ShoppingCartIcon sx={{ color: 'white'}} />
        </Badge>
      </Link>
    </IconButton>
  );
};

export default CartIcon;
