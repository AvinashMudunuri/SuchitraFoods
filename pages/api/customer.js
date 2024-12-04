import axiosClient from '../../lib/axiosClient';
const registerCustomer = async (email, password) => {
  try {
    const response = await axiosClient.post(
      '/auth/customer/emailpass/register',
      {
        email,
        password,
      }
    );
    return response.data.token;
  } catch (error) {
    console.log(`Error Register Customer==>`, error);
    throw error;
  }
};

const updateCustomerDetails = async (token, email, first_name, last_name) => {
  try {
    const response = await axiosClient.post(
      '/store/customers',
      {
        email,
        first_name,
        last_name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error Update Customer Details ==>`, error);
    throw error;
  }
};

const updateCustomerProfile = async (token, data) => {
  try {
    const response = await axiosClient.post(
      '/store/customers/me',
      {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error Update Customer Profile Details ==>`, error);
    throw error;
  }
};

const updateCustomerAddress = async (token, data) => {
  try {
    const response = await axiosClient.post(
      '/store/customers/me/addresses',
      {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        address_1: data.address_1,
        address_2: data.address_2,
        city: data.city,
        postal_code: data.zipcode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error Update Customer Profile Details ==>`, error);
    throw error;
  }
};

const loginCustomer = async (email, password) => {
  try {
    const response = await axiosClient.post('/auth/customer/emailpass', {
      email,
      password,
    });
    return response.data.token;
  } catch (error) {
    console.log(`Error Login Customer==>`, error);
    throw error;
  }
};

const getLoggedInCustomer = async (token) => {
  try {
    const response = await axiosClient.get('/store/customers/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(`Error Get Logged In Customer==>`, error);
    throw error;
  }
};

const getLoggedInCustomerOrders = async (token) => {
  try {
    const response = await axiosClient.get('/store/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.orders;
  } catch (error) {
    console.log(`Error Get Logged In Customer Orders==>`, error);
    throw error;
  }
};

const logoutCustomer = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('customer');
};

export {
  registerCustomer,
  updateCustomerDetails,
  updateCustomerProfile,
  updateCustomerAddress,
  loginCustomer,
  getLoggedInCustomer,
  getLoggedInCustomerOrders,
  logoutCustomer,
};
