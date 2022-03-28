import 'regenerator-runtime/runtime';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import AxiosMockAdapter from 'axios-mock-adapter';
import userReducer, { getUsers, getUser } from '../features/users/userSlice';

let initialState;
let store;

beforeEach(() => {
  initialState = {
    users: [],
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    status: ''
  };
  store = configureStore({ reducer: { user: userReducer }, initialState });
});

let mock;

beforeAll(() => {
  mock = new AxiosMockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

it('should return the initial state', () => {
  const { user } = store.getState();

  expect(user).toEqual(initialState);
});

describe('UserSlice - getUsers', () => {
  it('should set error to true if rejected', async () => {
    mock.onGet('/api/users').reply(500, { message: 'Rejected' });

    await store.dispatch(getUsers());

    const { user } = store.getState();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].url).toEqual(`/api/users`);
    expect(user).toEqual({
      users: [],
      user: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
      message: 'Rejected',
      status: ''
    });
  });

  it('should set users to response data', async () => {
    const users = [
      {
        email: 'test@test.com'
      },
      {
        email: 'test@gmail.com'
      }
    ];
    mock.onGet('/api/users').reply(200, users);

    await store.dispatch(getUsers());

    const { user } = store.getState();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].url).toEqual(`/api/users`);
    expect(user).toEqual({
      users: users,
      user: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
      message: '',
      status: ''
    });
  });
});

describe('UserSlice - getUser', () => {
  it('should set error to true if rejected', async () => {
    const id = 1;
    mock.onGet(`/api/users/${id}`).reply(500, { message: 'Rejected' });

    await store.dispatch(getUser(id));

    const { user } = store.getState();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].url).toEqual(`/api/users/${id}`);
    expect(user).toEqual({
      users: [],
      user: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
      message: 'Rejected',
      status: ''
    });
  });

  it('should set users to response data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com'
    };
    mock.onGet(`/api/users/${mockUser.id}`).reply(200, mockUser);

    await store.dispatch(getUser(mockUser.id));

    const { user } = store.getState();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].url).toEqual(`/api/users/${mockUser.id}`);
    expect(user).toEqual({
      users: [],
      user: mockUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
      message: '',
      status: ''
    });
  });
});
