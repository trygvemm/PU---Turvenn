import 'regenerator-runtime/runtime';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import AxiosMockAdapter from 'axios-mock-adapter';
import authReducer, { login } from '../features/auth/authSlice';

let initialState;
let store;
let mock;
let setItemSpy;
let getItemSpy;
let removeItemSpy;
let mockStorage = {};

beforeAll(() => {
  mock = new AxiosMockAdapter(axios);
  setItemSpy = jest.spyOn(global.Storage.prototype, 'setItem').mockImplementation((key, value) => {
    mockStorage[key] = value;
  });
  getItemSpy = jest
    .spyOn(global.Storage.prototype, 'getItem')
    .mockImplementation((key) => mockStorage[key]);
  removeItemSpy = jest.spyOn(global.Storage.prototype, 'removeItem').mockImplementation((key) => {
    mockStorage[key] = null;
  });
});

beforeEach(() => {
  mockStorage = {};
  initialState = {
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
  };
  store = configureStore({ reducer: { auth: authReducer }, initialState });
});

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  getItemSpy.mockRestore();
  setItemSpy.mockRestore();
  removeItemSpy.mockRestore();
});

it('should return the initial state', () => {
  const { auth } = store.getState();

  expect(auth).toEqual(initialState);
});

describe('AuthSlice - login', () => {
  const user = {
    email: 'test@test.com'
  };
  it('should set user in state if successful', async () => {
    mock.onPost('/api/users/login').reply(200, {
      user
    });

    await store.dispatch(login());

    const { auth } = store.getState();

    expect(mock.history.post.length).toEqual(1);
    expect(mock.history.post[0].url).toEqual('/api/users/login');
    expect(auth).toEqual({
      user: user,
      isLoading: false,
      isError: false,
      isSuccess: true,
      message: ''
    });
    expect(setItemSpy).toHaveBeenCalledWith('user', JSON.stringify(user));
  });
});
