import 'regenerator-runtime/runtime';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import AxiosMockAdapter from 'axios-mock-adapter';
import tripReducer, { getTrips } from '../features/trips/tripSlice';

let initialState;
let store;

beforeEach(() => {
  initialState = {
    trips: [],
    trip: null,
    userTrips: [],
    userParticipatedIn: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    status: ''
  };
  store = configureStore({ reducer: { trip: tripReducer }, initialState });
});

let mock;

beforeAll(() => {
  mock = new AxiosMockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

it('should return the initial state', () => {
  const { trip } = store.getState();

  expect(trip).toEqual(initialState);
});

// Integration test: tripSlice + tripService + getError
describe('TripSlice - getTrips', () => {
  it('should set error to true if rejected', async () => {
    mock.onGet('/api/trips').reply(500, { message: 'Rejected' });

    await store.dispatch(getTrips());

    const { trip } = store.getState();

    expect(mock.history.get.length).toEqual(1);
    expect(mock.history.get[0].url).toEqual(`/api/trips`);
    expect(trip).toEqual({
      trips: [],
      trip: null,
      userTrips: [],
      userParticipatedIn: [],
      isError: true,
      isSuccess: false,
      isLoading: false,
      message: 'Rejected',
      status: ''
    });
  });

  it('should be reset', () => {
    const { trip } = store.getState();

    expect(trip).toEqual({
      trips: [],
      trip: null,
      userTrips: [],
      userParticipatedIn: [],
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: '',
      status: ''
    });
  });
});
