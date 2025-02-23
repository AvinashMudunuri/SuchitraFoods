import { getClientAuthHeaders, sdk } from '../../lib/medusa';
import { medusaError } from '../../utils';

export const listOrders = async (limit = 50, offset = 0, filters = {}) => {
  const headers = getClientAuthHeaders();
  return sdk.client
    .fetch(`/store/orders`, {
      method: 'GET',
      query: {
        limit,
        offset,
        order: '-created_at',
        fields: '*items,+items.metadata,*items.variant,*items.product',
        ...filters,
      },
      headers,
    })
    .then(({ orders, count, offset, limit }) => ({ orders, count, offset, limit }))
    .catch((err) => medusaError(err));
};

export const retrieveOrder = async (orderId) => {
  const headers = getClientAuthHeaders();
  return sdk.client
    .fetch(`/store/orders/${orderId}`, {
      method: 'GET',
      query: {
        fields:
          '*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product',
      },
      headers,
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err));
};
