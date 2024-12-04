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
} from '../pages/api/cart';
import { useAnalytics } from '../lib/useAnalytics';
const CartContext = createContext();

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
  const [cart, setCart] = useState([]);
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { region } = useRegion();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (cart?.id || !region) {
      return;
    }
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      // create a cart
      createCart(region.id).then((data) => {
        localStorage.setItem('cart_id', data.id);
        setCart(data);
      });
    } else {
      // fetch cart
      getCart(cartId).then((data) => {
        localStorage.setItem('cart_id', data.id);
        dispatch({ type: 'SET_CART', payload: data.items });
        setCart(data);
      });
    }
  }, [cart, region]);

  const refreshCart = () => {
    localStorage.removeItem('cart_id');
    setCart(undefined);
  };

  const handleCartOperation = (product, selectedQuantities, quantity = 1) => {
    trackEvent({
      action: 'add_to_cart',
      category: 'Product',
      label: product.name,
      value: product.id,
    });
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      console.error('Cart ID not found in localStorage');
      return;
    }
    // If you need to ensure quantity is always a number
    const normalizedQuantity = Number(quantity);

    // Check if item exists in cart
    const existingItem = state.cartItems?.find(
      (item) => item.product_id === product.id
    );

    // Get current quantity from state
    const currentQuantity = existingItem?.quantity || 0;

    // Calculate new quantity
    const newQuantity = currentQuantity + normalizedQuantity;

    // Don't proceed if trying to reduce quantity below 0
    if (newQuantity < 0) return;
    const variantId = product.variantionIds[selectedQuantities[product.id]];
    const data = {
      variant_id: variantId,
      quantity: Math.abs(normalizedQuantity),
    };

    let actionType;
    if (normalizedQuantity > 0) {
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
          ? { id: product.id }
          : {
              id: product.id,
              title: product.title,
              price: product.prices[selectedQuantities[product.id]],
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
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
        })
        .catch((error) => {
          console.error('Error removing item from cart:', error);
          // Revert the state on error
          dispatch({ type: 'SET_CART', payload: state.items });
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
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
          // Revert the state on error
          dispatch({ type: 'SET_CART', payload: state.items });
        });
    } else {
      // Add new item
      addItemToCart(cartId, data)
        .then((cart) => {
          console.log('Item added to cart:', cart);
          dispatch({ type: 'SET_CART', payload: cart?.items || [] });
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          dispatch({ type: 'REMOVE_FROM_CART', payload: { id: product.id } });
        });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        state,
        dispatch,
        handleCartOperation,
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
