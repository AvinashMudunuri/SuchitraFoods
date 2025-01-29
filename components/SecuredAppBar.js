import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useRouter } from 'next/router';

const SecuredAppBar = () => {
  const router = useRouter();
  return (
    <Container maxWidth="xl">
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'primary.main',
        }}
      >
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" color="white">
            SUCHITRA FOODS
          </Typography>
        </Box>
        <Box sx={{ mr: 2 }}>
          <IconButton
            sx={{ color: 'white' }}
            onClick={() => router.push('/cart')}
          >
            <ShoppingBagIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </Container>
  );
};

export default SecuredAppBar;
