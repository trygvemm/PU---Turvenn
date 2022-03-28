import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRouter from 'react-router-dom';
import * as redux from 'react-redux';
import ViewTrip from '../../pages/ViewTrip';

let selectorSpy;
let paramsSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    user: {
      id: 1,
      firstName: 'Tester',
      lastName: 'Doe',
      role: 'user'
    },
    logs: [
      {
        id: 1,
        user: {
          id: 1,
          firstName: 'Tester',
          lastName: 'Doe'
        }
      }
    ],
    trip: {
      id: 1,
      name: 'Test',
      user: {
        id: 1,
        firstName: 'Ola',
        lastName: 'Nordmann'
      },
      participators: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    },
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: '',
    status: ''
  });
  paramsSpy = jest.spyOn(reactRouter, 'useParams');
  paramsSpy.mockReturnValue({
    id: 1
  });
});

it('should render component', () => {
  render(<ViewTrip />);

  const tripName = screen.getByRole('heading', {
    name: /test/i
  });

  expect(tripName).not.toBe(null);
  expect(tripName).toBeInTheDocument();
});
