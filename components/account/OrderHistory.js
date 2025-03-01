import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Pagination,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Stack,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
} from '@mui/material';
import PropTypes from 'prop-types';
import { convertToLocale } from '../../utils';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import CancelIcon from '@mui/icons-material/Cancel';

import PaymentIcon from '@mui/icons-material/Payment';
import BlockIcon from '@mui/icons-material/Block';

import WarningIcon from '@mui/icons-material/Warning';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SecurityIcon from '@mui/icons-material/Security';
import PartiallyIcon from '@mui/icons-material/MoreHoriz';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

const OrderHistory = ({ orders: initialOrders, count, offset, limit }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [page, setPage] = useState(Math.floor(offset / limit) + 1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterTab, setFilterTab] = useState(0);

  // Fulfillment status options with icons
  const fulfillmentOptions = [
    { value: 'all', label: 'All Statuses', icon: <ReceiptIcon /> },
    { value: 'not_fulfilled', label: 'Not Fulfilled', icon: <BlockIcon color="error" /> },
    { value: 'partially_fulfilled', label: 'Partially Fulfilled', icon: <PartiallyIcon color="warning" /> },
    { value: 'fulfilled', label: 'Fulfilled', icon: <CheckCircleIcon color="success" /> },
    { value: 'partially_shipped', label: 'Partially Shipped', icon: <PartiallyIcon color="info" /> },
    { value: 'shipped', label: 'Shipped', icon: <LocalShippingIcon color="primary" /> },
    { value: 'partially_delivered', label: 'Partially Delivered', icon: <PartiallyIcon color="info" /> },
    { value: 'delivered', label: 'Delivered', icon: <DeliveryDiningIcon color="success" /> },
    { value: 'canceled', label: 'Canceled', icon: <CancelIcon color="error" /> },
  ];

  // Payment status options with icons
  const paymentOptions = [
    { value: 'all', label: 'All Payments', icon: <PaymentIcon /> },
    { value: 'not_paid', label: 'Not Paid', icon: <MoneyOffIcon color="error" /> },
    { value: 'awaiting', label: 'Awaiting', icon: <HourglassEmptyIcon color="warning" /> },
    { value: 'authorized', label: 'Authorized', icon: <SecurityIcon color="info" /> },
    { value: 'partially_authorized', label: 'Partially Authorized', icon: <PartiallyIcon color="info" /> },
    { value: 'captured', label: 'Captured', icon: <CreditCardIcon color="success" /> },
    { value: 'partially_captured', label: 'Partially Captured', icon: <PartiallyIcon color="info" /> },
    { value: 'partially_refunded', label: 'Partially Refunded', icon: <PartiallyIcon color="warning" /> },
    { value: 'refunded', label: 'Refunded', icon: <CreditCardIcon color="error" /> },
    { value: 'requires_action', label: 'Requires Action', icon: <WarningIcon color="error" /> },
    { value: 'canceled', label: 'Canceled', icon: <CancelIcon color="error" /> },
  ];

  // Get fulfillment status icon
  const getFulfillmentIcon = (status) => {
    const option = fulfillmentOptions.find(opt => opt.value === status.toLowerCase());
    return option ? option.icon : <ReceiptIcon />;
  };

  // Get payment status icon
  const getPaymentIcon = (status) => {
    const option = paymentOptions.find(opt => opt.value === status.toLowerCase());
    return option ? option.icon : <PaymentIcon />;
  };

  // Get fulfillment status color
  const getFulfillmentColor = (status) => {
    const statusColors = {
      'not_fulfilled': 'error',
      'partially_fulfilled': 'warning',
      'fulfilled': 'success',
      'partially_shipped': 'info',
      'shipped': 'primary',
      'partially_delivered': 'info',
      'delivered': 'success',
      'canceled': 'error',
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  // Get payment status color
  const getPaymentColor = (status) => {
    const statusColors = {
      'not_paid': 'error',
      'awaiting': 'warning',
      'authorized': 'info',
      'partially_authorized': 'info',
      'captured': 'success',
      'partially_captured': 'info',
      'partially_refunded': 'warning',
      'refunded': 'error',
      'requires_action': 'error',
      'canceled': 'error',
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filteredOrders = [...initialOrders];

    // Apply search filter
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order =>
        order.display_id.toString().includes(searchTerm) ||
        order.total.toString().includes(searchTerm)
      );
    }

    // Apply fulfillment filter
    if (fulfillmentFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.fulfillment_status?.toLowerCase() === fulfillmentFilter
      );
    }

    // Apply payment filter
    if (paymentFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.payment_status?.toLowerCase() === paymentFilter
      );
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredOrders;
  }, [initialOrders, searchTerm, fulfillmentFilter, paymentFilter, sortConfig]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    router.push(`/profile?offset=${(value - 1) * limit}`);
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
  };

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts = {
      fulfillment: { all: initialOrders.length },
      payment: { all: initialOrders.length }
    };

    fulfillmentOptions.forEach(status => {
      if (status.value !== 'all') {
        counts.fulfillment[status.value] = initialOrders.filter(
          order => order.fulfillment_status?.toLowerCase() === status.value
        ).length;
      }
    });

    paymentOptions.forEach(status => {
      if (status.value !== 'all') {
        counts.payment[status.value] = initialOrders.filter(
          order => order.payment_status?.toLowerCase() === status.value
        ).length;
      }
    });

    return counts;
  }, [initialOrders]);

  // Handle filter tab change
  const handleFilterTabChange = (event, newValue) => {
    setFilterTab(newValue);
  };

  // Render functions to replace nested ternary
  const renderEmptyState = () => (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">No orders found</Typography>
        <Typography variant="body2" color="text.secondary">
          {searchTerm || fulfillmentFilter !== 'all' || paymentFilter !== 'all'
            ? 'Try changing your search criteria'
            : 'You haven\'t placed any orders yet'}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderMobileView = () => (
    <Stack spacing={2}>
      {filteredAndSortedOrders.map((order) => (
        <Card key={order.id} sx={{
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[5],
            transform: 'translateY(-2px)'
          }
        }}>
          <Box sx={{
            p: 1,
            bgcolor: (theme.palette[getFulfillmentColor(order.fulfillment_status || 'not_fulfilled')]?.light || theme.palette.grey[200]),
            borderLeft: `4px solid ${theme.palette[getFulfillmentColor(order.fulfillment_status || 'not_fulfilled')]?.main || theme.palette.grey[400]}`
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getFulfillmentIcon(order.fulfillment_status || 'not_fulfilled')}
                {order.fulfillment_status ? order.fulfillment_status.replace(/_/g, ' ') : 'Not Fulfilled'}
              </Typography>
              <Chip
                size="small"
                icon={getPaymentIcon(order.payment_status || 'not_paid')}
                label={order.payment_status ? order.payment_status.replace(/_/g, ' ') : 'Not Paid'}
                color={getPaymentColor(order.payment_status || 'not_paid')}
              />
            </Stack>
          </Box>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">Order Number</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>#{order.display_id}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body1">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {convertToLocale({
                    amount: order.total,
                    currency_code: order.currency_code,
                  })}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => router.push(`/orders/${order.id}`)}
                fullWidth
              >
                View Details
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{
      boxShadow: theme.shadows[2],
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      <Table>
        <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
          <TableRow>
            <TableCell
              onClick={() => requestSort('display_id')}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Order # {getSortDirectionIcon('display_id')}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort('created_at')}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Date {getSortDirectionIcon('created_at')}
              </Box>
            </TableCell>
            <TableCell>Fulfillment</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell
              onClick={() => requestSort('total')}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Total {getSortDirectionIcon('total')}
              </Box>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedOrders.map((order) => (
            <TableRow
              key={order.id}
              sx={{
                '&:hover': { bgcolor: theme.palette.action.hover },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  #{order.display_id}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <Chip
                  icon={getFulfillmentIcon(order.fulfillment_status || 'not_fulfilled')}
                  label={order.fulfillment_status ? order.fulfillment_status.replace(/_/g, ' ') : 'Not Fulfilled'}
                  color={getFulfillmentColor(order.fulfillment_status || 'not_fulfilled')}
                  size="small"
                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={getPaymentIcon(order.payment_status || 'not_paid')}
                  label={order.payment_status ? order.payment_status.replace(/_/g, ' ') : 'Not Paid'}
                  color={getPaymentColor(order.payment_status || 'not_paid')}
                  size="small"
                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {convertToLocale({
                    amount: order.total,
                    currency_code: order.currency_code,
                  })}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Order Details">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render content based on conditions
  const renderContent = () => {
    if (filteredAndSortedOrders.length === 0) {
      return renderEmptyState();
    }

    return isMobile ? renderMobileView() : renderDesktopView();
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Order History
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          size="small"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {/* Filters Section */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={filterTab}
              onChange={handleFilterTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{ px: 2 }}
            >
              <Tab label="Search" icon={<SearchIcon />} iconPosition="start" />
              <Tab label="Fulfillment" icon={<LocalShippingIcon />} iconPosition="start" />
              <Tab label="Payment" icon={<PaymentIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <Box sx={{ p: 2 }}>
            {filterTab === 0 && (
              <TextField
                label="Search Orders"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {filterTab === 1 && (
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Fulfillment Status</InputLabel>
                <Select
                  value={fulfillmentFilter}
                  onChange={(e) => setFulfillmentFilter(e.target.value)}
                  label="Fulfillment Status"
                >
                  {fulfillmentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {option.label}
                        </Typography>
                        <Badge
                          badgeContent={orderCounts.fulfillment[option.value] || 0}
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {filterTab === 2 && (
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  label="Payment Status"
                >
                  {paymentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {option.label}
                        </Typography>
                        <Badge
                          badgeContent={orderCounts.payment[option.value] || 0}
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Card>
      )}

      {/* Orders Content */}
      {renderContent()}

      {/* Pagination */}
      {count > limit && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(count / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
};

OrderHistory.propTypes = {
  orders: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default OrderHistory;
