import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tripService from './tripService';
import getError from '../../util/getError';

const initialState = {
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

export const getTrips = createAsyncThunk('/trips/getAll', async (_, thunkAPI) => {
  try {
    return await tripService.getTrips();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const createTrip = createAsyncThunk('/trips/create', async (tripData, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await tripService.createTrip(tripData, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const editTrip = createAsyncThunk('/trips/edit', async (tripData, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await tripService.editTrip(tripData, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteTrip = createAsyncThunk('/trips/delete', async (tripId, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await tripService.deleteTrip(tripId, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTrip = createAsyncThunk('trips/get', async (tripId, thunkAPI) => {
  try {
    return await tripService.getTrip(tripId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getUserTrips = createAsyncThunk('trips/user/get', async (userId, thunkAPI) => {
  try {
    return await tripService.getUserTrips(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const signUp = createAsyncThunk('trips/signup', async (tripId, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await tripService.signUp(tripId, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const signOff = createAsyncThunk('trips/signoff', async (tripId, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await tripService.signOff(tripId, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const searchTrip = createAsyncThunk('trips/search', async (searchData, thunkAPI) => {
  try {
    return await tripService.searchTrip(searchData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTripsParticipatedIn = createAsyncThunk(
  'trips/participated',
  async (userId, thunkAPI) => {
    try {
      return await tripService.getTripsParticipatedIn(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
      state.status = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trips = action.payload;
      })
      .addCase(getTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTrip.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trip = action.payload;
      })
      .addCase(getTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserTrips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userTrips = action.payload;
      })
      .addCase(getUserTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(signOff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOff.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(signOff.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editTrip.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.status = 'updated';
      })
      .addCase(editTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.status = 'update failed';
      })
      .addCase(deleteTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTrip.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.status = 'deleted';
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.status = 'delete failed';
      })
      .addCase(searchTrip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trips = action.payload;
      })
      .addCase(searchTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTripsParticipatedIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTripsParticipatedIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userParticipatedIn = action.payload;
      })
      .addCase(getTripsParticipatedIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = tripSlice.actions;

export default tripSlice.reducer;
