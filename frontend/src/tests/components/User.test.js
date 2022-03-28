import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRouter from 'react-router-dom';
import * as redux from 'react-redux';
import User from '../../pages/User';

let selectorSpy;
let paramsSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      email: 'email@email.com',
      password: 'password',
      role: 'user'
    },
    userTrips: [
      {
        id: 1,
        name: 'Test'
      }
    ],
    userParticipatedIn: []
  });
  paramsSpy = jest.spyOn(reactRouter, 'useParams');
  paramsSpy.mockReturnValue({
    id: 1
  });
});

it('should render component', () => {
  render(<User />);

  const name = screen.getByRole('heading', {
    name: /test test/i
  });

  expect(name).not.toBe(null);
  expect(name).toBeInTheDocument();
});
