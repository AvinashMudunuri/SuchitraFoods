import Link from 'next/link';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../context/CartContext';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const CartIcon = () => {
  const { state } = useCart();

  return (
    <IconButton color="white">
      <Link href="/cart" passHref>
        <ShoppingCartIcon sx={{ color: 'white' }} />
        <CartBadge
          badgeContent={state.totalItems}
          color="secondary"
          overlap="circular"
        />
      </Link>
    </IconButton>
  );
};

export default CartIcon;
