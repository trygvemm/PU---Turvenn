import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import Register from '../../pages/Register';

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
  render(<Register />);

  const title = screen.getByRole('heading', {
    name: /bli en turvenn/i
  });

  expect(title).not.toBe(null);
  expect(title).toBeInTheDocument();
});
