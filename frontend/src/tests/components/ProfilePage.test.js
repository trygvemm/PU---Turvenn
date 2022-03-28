import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import * as reactRouter from 'react-router-dom';
import ProfilePage from '../../pages/ProfilePage';

let selectorSpy;
let paramsSpy;

beforeAll(() => {
  selectorSpy = jest.spyOn(redux, 'useSelector');
  selectorSpy.mockReturnValue({
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      email: 'email@email.com',
      password: 'password',
      role: 'user',
      experience: 1,
      profilePic: null
    },
    status: ''
  });
  paramsSpy = jest.spyOn(reactRouter, 'useParams');
  paramsSpy.mockReturnValue({
    id: 1
  });
});

it('should render component', () => {
  render(<ProfilePage />);

  const firstName = screen.getByRole('textbox', {
    name: /fornavn/i
  });

  expect(firstName).not.toBe(null);
  expect(firstName).toBeInTheDocument();
  expect(firstName.value).toEqual('Test');
});

it('should disable button if something is empty', () => {
  render(<ProfilePage />);

  const button = screen.getByRole('button', {
    name: /oppdater/i
  });
  const inputFirstName = screen.getByRole('textbox', {
    name: /fornavn/i
  });

  expect(button).not.toBeDisabled();

  fireEvent.change(inputFirstName, {
    target: {
      value: ''
    }
  });

  expect(button).toBeDisabled();
});
