'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { useRegion } from './RegionContext';
import {
  getCart,
  createCart,
  addItemToCart,
  deleteItemFromCart,
  updateItemToCart,
  getShippingOptions,
} from '../pages/api/cart';
import { getPaymentProviders } from '../pages/api/payment';
import { useAnalytics } from '../lib/useAnalytics';
const CartContext = createContext();
import { toast } from 'react-toastify';
import { storage } from '../utils/storage';

const initialState = {
  cartItems: [], // Stores cart items
  totalItems: 0, // Total count of items in the cart
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      const cartItems = action.payload || [];
      return {
        ...state,
        cartItems,
        totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }
    case 'ADD_TO_CART': {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = state.cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updatedCart = [...state.cartItems, item];
      }

      return {
        ...state,
        cartItems: updatedCart,
        totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
      };
    }
    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cartItems.filter(
        (i) => i.id !== action.payload.id
      );
      return {
        ...state,
        cartItems: updatedCart,
        totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
      };
    }
    case 'UPDATE_CART':
      return {
        ...state,
        items: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { region } = useRegion();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const loadStoredMethods = () => {
      try {
        const storedShippingMethods = storage.get('SHIPPING_METHODS') || [];
        const storedPaymentMethods = storage.get('PAYMENT_METHODS') || [];

        setShippingMethods(storedShippingMethods);
        setPaymentMethods(storedPaymentMethods);
      } catch (error) {
        console.error('Error loading stored methods:', error);
        // Fallback to empty arrays
        setShippingMethods([]);
        setPaymentMethods([]);
      }
    };
    loadStoredMethods();
  }, []);

  useEffect(() => {
    if (cart?.id || !region) {
      return;
    }
    const saveShippingAndPaymentMethods = async (cart) => {
      if (storage.get('SHIPPING_METHODS') && storage.get('PAYMENT_METHODS')) {
        return;
      }
      const shippingOptions = await getShippingOptions(cart.id);
      storage.set('SHIPPING_METHODS', shippingOptions);
      setShippingMethods(shippingOptions);

      const paymentMethods = await getPaymentProviders(cart.region.id);
      storage.set('PAYMENT_METHODS', paymentMethods);
      setPaymentMethods(paymentMethods);
    };
    const initialCart = async () => {
      const cartId = storage.get('CART_ID');
      if (!cartId) {
        // create a cart
        const newCart = await createCart(region.id);
        storage.set('CART_ID', newCart.id);
        setCart(newCart);
        await saveShippingAndPaymentMethods(newCart);
      } else {
        // fetch cart
        const cart = await getCart(cartId);
        storage.set('CART_ID', cart.id);
        dispatch({ type: 'SET_CART', payload: cart.items });
        setCart(cart);
        await saveShippingAndPaymentMethods(cart);
      }
    };
    initialCart();
  }, [cart, region]);

  const refreshCart = () => {
    storage.remove('CART_ID');
    dispatch({ type: 'CLEAR_CART' });
    setCart(null);
  };

  const handleCartOperation = (
    product,
    selectedSize,
    quantity = 1,
    flow = 'products'
  ) => {
    trackEvent({
      action: 'add_to_cart',
      category: 'Product',
      label: product.name,
      value: product.id,
    });
    setIsItemLoading(true);
    const cartId = storage.get('CART_ID');
    if (!cartId) {
      console.error('Cart ID not found in localStorage');
      return;
    }
    // If you need to ensure quantity is always a number
    const normalizedQuantity = Number(quantity);
    // Check if item exists in cart
    let existingItem;
    if (flow !== 'products') {
      existingItem = state.cartItems?.find(
        (item) =>
          item.product_id === product.product_id &&
          item.variant_title === selectedSize
      );
    } else {
      existingItem = state.cartItems?.find(
        (item) =>
          item.product_id === product.id && item.variant_title === selectedSize
      );
    }

    // Get current quantity from state
    const currentQuantity = existingItem?.quantity || 0;

    // Calculate new quantity
    const newQuantity = currentQuantity + normalizedQuantity;

    // Don't proceed if trying to reduce quantity below 0
    if (newQuantity < 0) return;
    const variantId =
      flow === 'products'
        ? product.variantionIds[selectedSize]
        : product.variant_id;
    const data = {
      variant_id: variantId,
      quantity: Math.abs(newQuantity),
    };

    let actionType;
    if (newQuantity > 0) {
      actionType = existingItem ? 'UPDATE_CART' : 'ADD_TO_CART';
    } else {
      actionType = newQuantity === 0 ? 'REMOVE_FROM_CART' : 'UPDATE_CART';
    }

    // Update local state first
    // Update local state
    dispatch({
      type: actionType,
      payload:
        actionType === 'REMOVE_FROM_CART'
          ? { id: flow === 'products' ? product.id : product.product_id }
          : {
              id: flow === 'products' ? product.id : product.product_id,
              title:
                flow === 'products' ? product.title : product.product_title,
              price:
                flow === 'products'
                  ? product.prices[selectedSize]
                  : product.unit_price,
              quantity: newQuantity, // Use the calculated new quantity
            },
    });
    // Then update the cart in the backend
    // Update backend
    if (newQuantity === 0) {
      // Remove item completely from cart
      deleteItemFromCart(cartId, existingItem.id)
        .then((cart) => {
          console.log('Item removed from cart:', cart);
          setCart(cart);
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
          setIsItemLoading(false);
          toast.success(`Item removed from cart!`);
        })
        .catch((error) => {
          console.error('Error removing item from cart:', error);
          // Revert the state on error
          dispatch({ type: 'SET_CART', payload: state.items });
          setIsItemLoading(false);
          toast.error(`Error removing item from cart!`);
        });
    } else if (existingItem) {
      // Update existing item
      updateItemToCart(cartId, {
        ...data,
        line_item_id: existingItem.id,
        quantity: newQuantity,
      })
        .then((cart) => {
          console.log('Cart updated:', cart);
          setCart(cart);
          setIsItemLoading(false);
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
          toast.success(`Cart updated!`);
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
          // Revert the state on error
          dispatch({ type: 'SET_CART', payload: state.items });
          setIsItemLoading(false);
          toast.error(`Error updating cart!`);
        });
    } else {
      // Add new item
      addItemToCart(cartId, data)
        .then((cart) => {
          console.log('Item added to cart:', cart);
          setCart(cart);
          setIsItemLoading(false);
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
          toast.success(`Added to cart!`);
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          dispatch({
            type: 'REMOVE_FROM_CART',
            payload: {
              id: flow === 'products' ? product.id : product.product_id,
            },
          });
          toast.error(`Error adding to cart!`);
        });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        shippingMethods,
        paymentMethods,
        refreshCart,
        state,
        dispatch,
        handleCartOperation,
        isItemLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
