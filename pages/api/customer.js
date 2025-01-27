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

const addCustomerAddress = async (data) => {
  try {
    const headers = getClientAuthHeaders();
    const response = await axiosClient.post(
      '/store/customers/me/addresses',
      {
        address_name: data.address_name,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: `+91${data.phone}`,
        address_1: data.address_1,
        address_2: data.address_2,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        country_code: data.country_code.toLowerCase(),
        company: data.company,
        is_default_shipping: data.is_default_shipping || false,
        is_default_billing: data.is_default_billing || false,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.log(`Error Update Customer Address Details ==>`, error);
    throw error;
  }
};

export {
  signUp,
  signIn,
  retrieveCustomer,
  updateCustomerProfile,
  addCustomerAddress,
  logout,
};
