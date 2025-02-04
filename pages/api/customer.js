import axiosClient from '../../lib/axiosClient';
import { sdk, getClientAuthHeaders } from '../../lib/medusa';
import { getCookie, setCookie, removeCookie } from '../../lib/clientCookies';

const transferCart = async () => {
  const cartId = getCookie('cart_id');
  if (!cartId) {
    return;
  }

  const headers = getClientAuthHeaders();
  await sdk.store.cart.transferCart(cartId, {}, headers);
};

const retrieveCustomer = async () => {
  const headers = getClientAuthHeaders();

  return await sdk.client
    .fetch(`/store/customers/me`, {
      method: 'GET',
      headers,
      query: {
        fields: '*orders',
      },
    })
    .then(({ customer }) => customer)
    .catch(() => null);
};

const resetPassword = async (prevState, formData) => {
  const email = formData.get('email');
  await sdk.auth.resetPassword('customer', 'emailpass', {
    identifier: email,
  });

  return {
    success: true,
    message: `If an account exists with the specified email, it'll receive instructions to reset the password.`,
  };
};

const updatePassword = async (prevState, formData, token, email) => {
  const password = formData.get('password');
  const response = await sdk.auth.updateProvider(
    'customer',
    'emailpass',
    { password },
    token
  );
  console.log('response', response);

  return {
    success: true,
    message: 'Password updated successfully',
  };
};

const signUp = async (prevState, formData) => {
  // Add debugging
  console.log('FormData received:', formData);
  console.log('FormData entries:', Array.from(formData.entries()));

  const password = formData.get('password');
  const customerForm = {
    email: formData.get('email'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    phone: formData.get('phone'),
  };

  // Add validation
  if (
    !password ||
    !customerForm.email ||
    !customerForm.first_name ||
    !customerForm.last_name ||
    !customerForm.phone
  ) {
    return {
      message: 'All fields are required',
    };
  }

  try {
    // Register the customer
    const token = await sdk.auth.register('customer', 'emailpass', {
      email: customerForm.email,
      password: password,
    });

    if (
      !token &&
      token.type === 'unauthorized' &&
      token.message === 'Identity with email already exists'
    ) {
      return {
        message:
          'Email already exists. Please sign in or use a different email. If you have forgotten your password, please use the forgot password option.',
      };
    }

    // Set client cookie
    setCookie('_medusa_jwt', token);

    // Create customer profile
    const headers = getClientAuthHeaders();
    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    );

    // Login the customer
    const loginToken = await sdk.auth.login('customer', 'emailpass', {
      email: customerForm.email,
      password,
    });

    // Update token
    setCookie('_medusa_jwt', loginToken);
    await transferCart();

    return { message: null }; // Success case
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      message: error.message || 'Error creating account. Please try again.',
    };
  }
};

const signIn = async (prevState, formData) => {
  // Add debugging
  console.log('FormData received:', formData);
  console.log('FormData entries:', Array.from(formData.entries()));

  const email = formData.get('email');
  const password = formData.get('password');

  // Add validation
  if (!email || !password) {
    return {
      message: 'Email and password are required',
    };
  }

  try {
    const token = await sdk.auth.login('customer', 'emailpass', {
      email,
      password,
    });

    setCookie('_medusa_jwt', token);
    await transferCart();

    return { message: null }; // Success case
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      message: 'Invalid email or password',
    };
  }
};

const logout = async () => {
  try {
    await sdk.auth.logout();
    // Remove cookies
    removeCookie('_medusa_jwt');
    removeCookie('_medusa_cart_id');
    // Clear any session data
    sessionStorage.clear();
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const updateCustomerProfile = async (data) => {
  try {
    const headers = getClientAuthHeaders();
    const { customer } = await sdk.store.customer.update(data, {}, headers);
    return customer;
  } catch (error) {
    console.log(`Error Update Customer Profile Details ==>`, error);
    throw error;
  }
};

const addCustomerAddress = async (currentState, formData) => {
  console.log('data', formData);
  try {
    const headers = getClientAuthHeaders();
    const address = {
      address_name: formData?.address_name,
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      phone: formData?.phone,
      address_1: formData?.address_1,
      address_2: formData?.address_2,
      city: formData?.city,
      province: formData?.province,
      postal_code: formData?.postal_code,
      country_code: formData?.country_code.toLowerCase(),
      company: formData?.company,
      is_default_shipping: formData?.is_default_shipping || false,
      is_default_billing: formData?.is_default_billing || false,
    };
    const { customer } = await sdk.store.customer.createAddress(
      address,
      {},
      headers
    );
    return {
      success: true,
      customer,
      error: null,
      message: 'Customer Address added successfully',
    };
  } catch (error) {
    console.log(`Error Update Customer Address Details ==>`, error);
    throw error;
  }
};

const updateCustomerAddress = async (currentState, formData) => {
  console.log('data', formData);
  const addressId = currentState?.address_id || formData?.address_id;
  if (!addressId) {
    return { success: false, error: 'Address ID is required' };
  }
  try {
    const headers = getClientAuthHeaders();
    const address = {
      address_name: formData?.address_name,
      first_name: formData?.first_name,
      last_name: formData?.last_name,
      phone: formData?.phone,
      address_1: formData?.address_1,
      address_2: formData?.address_2,
      city: formData?.city,
      province: formData?.province,
      postal_code: formData?.postal_code,
      country_code: formData?.country_code.toLowerCase(),
    };
    const { customer } = await sdk.store.customer.updateAddress(
      addressId,
      address,
      {},
      headers
    );
    return {
      success: true,
      customer,
      error: null,
      message: 'Customer Address updated successfully',
    };
  } catch (error) {
    console.log(`Error Update Customer Address Details ==>`, error);
    throw error;
  }
};

const deleteCustomerAddress = async (addressId) => {
  try {
    const headers = getClientAuthHeaders();
    const { parent: customer, deleted } =
      await sdk.store.customer.deleteAddress(addressId, headers);
    if (deleted) {
      const result = await retrieveCustomer();

      return {
        success: true,
        customer: result,
        deleted,
        message: 'Customer Address deleted successfully',
      };
    }
    return {
      success: false,
      customer,
      deleted,
      message: 'Customer Address deleted failed',
    };
  } catch (error) {
    console.log(`Error Delete Customer Address Details ==>`, error);
    throw error;
  }
};

export {
  signUp,
  signIn,
  resetPassword,
  updatePassword,
  retrieveCustomer,
  updateCustomerProfile,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  logout,
};
