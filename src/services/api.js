import { createContext, useContext } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const BalanceContext = createContext();

export const fetchBalanceFromServer = async (authToken, username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { status: 200, data };
    } else {
      return { status: response.status, data: null };
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    return { status: 500, data: null };
  }
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.text();
      return { status: 200, data };
    } else {
      const errorData = await response.text();
      return { status: response.status, data: errorData };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { status: 500, data: 'Internal server error' };
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 500, data: null };
  }
};

export const getRecords = async (username, authToken, page = 0, size = 10, sortBy = 'id', direction = 'desc', search = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/operation/user/${username}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&search=${search}`, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { status: 200, data };
    } else {
      return { status: response.status, data: null };
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    return { status: 500, data: null };
  }
};

export const performOperation = async (operationData, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/operation/`, {
      method: 'POST',
      headers: {
        'Authorization': authToken, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operationData),
    });

    const data = await response.text();

    return { status: response.status, data };
  } catch (error) {
    console.error('Error performing operation:', error);
    return { status: 500, data: null };
  }
};

export const logout = async (authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return { status: 200 };
    } else {
      return { status: response.status };
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return { status: 500 };
  }
};

export const deleteRecord = async (recordId, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/operation/record/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();

    return { status: response.status, data };
  } catch (error) {
    console.error('Error deleting record:', error);
    return { status: 500, data: null };
  }
};

export const useBalance = () => useContext(BalanceContext);
