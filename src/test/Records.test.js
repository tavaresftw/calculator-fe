import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Records from '../pages/Records';
import '@testing-library/jest-dom';

jest.mock('../services/api');

test('should handle page navigation', async () => {
  render(
    <MemoryRouter>
      <Records />
    </MemoryRouter>
  );

  expect(screen.getByText('Previous')).toBeInTheDocument();
  expect(screen.getByText('Next')).toBeInTheDocument();
});

test('should handle search input', async () => {
  render(
    <MemoryRouter>
      <Records />
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText('Search...');
  expect(searchInput).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: 'ADDITION' } });
  expect(searchInput.value).toBe('ADDITION');
});

test('should render the Records page with menu', async () => {
  render(
    <MemoryRouter>
      <Records />
    </MemoryRouter>
  );

  expect(screen.getByText('Operation Records')).toBeInTheDocument();
  expect(screen.getByText('Balance: $0.00')).toBeInTheDocument();
  
  expect(screen.getByText('Calculator')).toBeInTheDocument();
  expect(screen.getByText('Records')).toBeInTheDocument();
  expect(screen.getByText('Sign out')).toBeInTheDocument();
  
  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});