import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import Home from '../../pages/Home';

let selectorSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: '',
    trips: [
      {
        id: 1,
        name: 'Test',
        user: {
          id: 1,
          firstName: 'Tester'
        }
      }
    ]
  });
});

it('should render component', () => {
  render(<Home />);

  const title = screen.getByRole('heading', {
    name: /hjem/i
  });

  expect(title).not.toBe(null);
  expect(title).toBeInTheDocument();
});
