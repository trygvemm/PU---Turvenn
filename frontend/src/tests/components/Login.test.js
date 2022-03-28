import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import Login from '../../pages/Login';

let selectorSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    user: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ''
  });
});

it('should render component', () => {
  render(<Login />);

  const title = screen.getByRole('heading', {
    name: /logg inn/i
  });

  expect(title).not.toBe(null);
  expect(title).toBeInTheDocument();
});
