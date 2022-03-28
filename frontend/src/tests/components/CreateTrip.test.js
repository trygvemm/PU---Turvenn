import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import CreateTrip from '../../pages/CreateTrip';

let selectorSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    isError: false,
    isSuccess: false,
    message: ''
  });
});

it('should render component', () => {
  render(<CreateTrip />);

  const title = screen.getByRole('heading', {
    name: /opprett turarrangement/i
  });

  expect(title).not.toBe(null);
  expect(title).toBeInTheDocument();
});
