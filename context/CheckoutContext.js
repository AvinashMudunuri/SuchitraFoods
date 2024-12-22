import React, { createContext, useContext, useReducer } from 'react';

const CheckoutContext = createContext();

const initialState = {
  email: '',
  shippingAddress: {},
  shippingMethod: '',
  paymentMethod: '',
  orderSummary: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_ORDER_SUMMARY':
      return { ...state, orderSummary: action.payload };
    default:
      return state;
  }
};

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
