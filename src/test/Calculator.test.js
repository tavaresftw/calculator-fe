import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import api from '../services/api';
import Calculator from '../pages/Calculator';

jest.mock('../services/api', () => ({
  performOperation: jest.fn(),
  fetchBalanceFromServer: jest.fn().mockResolvedValue({ data: { balance: 100 } }),
}));

jest.mock('../components/Menu', () => () => <div>Mocked Menu</div>);
jest.mock('../components/hocAuth', () => (WrappedComponent) => (props) => <WrappedComponent {...props} />);

afterEach(() => {
  jest.clearAllMocks();
});

it('should render the calculator form and menu', () => {
  render(
    <MemoryRouter>
      <Calculator />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Number 1/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Number 2/i)).toBeInTheDocument();
  expect(screen.getByText(/balance/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /calculator/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
});

it('should allow the user to perform an operation', async () => {
  api.performOperation.mockResolvedValue({ status: 200, data: 'mocked result' });
  render(
    <MemoryRouter>
      <Calculator />
    </MemoryRouter>
  );

  const number1 = screen.getByPlaceholderText(/Number 1/i);
  const number2 = screen.getByPlaceholderText(/Number 2/i);
  const operationSelect = screen.getByRole('combobox');

  fireEvent.change(number1, { target: { value: 10 } });
  fireEvent.change(number2, { target: { value: 20 } });
  fireEvent.change(operationSelect, { target: { value: 'ADDITION' } });

  fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

  await waitFor(() => {
    expect(screen.getByText(/mocked result/i)).toBeInTheDocument();
  });
});