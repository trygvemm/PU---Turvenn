import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import * as reactRouter from 'react-router-dom';
import EditTrip from '../../pages/EditTrip';

let selectorSpy;
let paramsSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    isError: false,
    isSuccess: false,
    message: '',
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      email: 'email@email.com',
      password: 'password',
      role: 'user'
    },
    trip: {
      id: 1,
      user: {
        id: 1,
        name: 'hello'
      }
    }
  });
  paramsSpy = jest.spyOn(reactRouter, 'useParams');
  paramsSpy.mockReturnValue({
    id: 1
  });
});

it('should render component', () => {
  render(<EditTrip />);

  const title = screen.getByRole('heading', {
    name: /rediger turarrangement/i
  });

  expect(title).not.toBe(null);
  expect(title).toBeInTheDocument();
});
