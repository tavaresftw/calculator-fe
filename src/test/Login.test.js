import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { login, registerUser } from '../services/api';
import '@testing-library/jest-dom';
import Login from '../pages/Login';

jest.mock('../services/api');

beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should render the login form', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it('should allow the user to login', async () => {
  const mockLoginResponse = { status: 200, data: 'fakeAuthToken' };
  login.mockResolvedValueOnce(mockLoginResponse);

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(login).toHaveBeenCalledWith('testuser', 'password123');
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'fakeAuthToken');
    expect(localStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
  });
});

it('should show an error message when login fails', async () => {
  const mockErrorResponse = { status: 401, data: 'Invalid credentials' };
  login.mockResolvedValueOnce(mockErrorResponse);

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(login).toHaveBeenCalledWith('testuser', 'wrongpassword');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(screen.getByText(/error logging in/i)).toBeInTheDocument();
  });
});

it('should toggle to register mode', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/register/i));

  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});

it('should allow the user to register', async () => {
  const mockRegisterResponse = { status: 200, data: 'User registered successfully' };
  registerUser.mockResolvedValueOnce(mockRegisterResponse);

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/register/i));

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(registerUser).toHaveBeenCalledWith('testuser', 'password123');
    expect(screen.getByText('User registered successfully')).toBeInTheDocument();
  });
});

it('should show an error message when registration fails', async () => {
  const mockErrorResponse = { status: 500, data: 'Internal server error' };
  registerUser.mockResolvedValueOnce(mockErrorResponse);

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/register/i));

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(registerUser).toHaveBeenCalledWith('testuser', 'password123');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(screen.getByText(/error registering user/i)).toBeInTheDocument();
  });
});