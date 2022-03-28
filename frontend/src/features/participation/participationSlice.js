import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import participationService from './participationService';
import getError from '../../util/getError';

const initialState = {
  participations: [],
  participation: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const getRatings = createAsyncThunk('/participations/getAll', async (tripId, thunkAPI) => {
  try {
    return await participationService.getRatings(tripId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getRating = createAsyncThunk(
  '/participations/get',
  async (participationData, thunkAPI) => {
    try {
      return await participationService.getRating(participationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const changeRating = createAsyncThunk(
  '/participations/change',
  async (participationData, thunkAPI) => {
    try {
      const { accessToken } = thunkAPI.getState().auth.user;
      return await participationService.changeRating(participationData, accessToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const participationSlice = createSlice({
  name: 'participation',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRatings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.participations = action.payload;
      })
      .addCase(getRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.participation = action.payload;
      })
      .addCase(getRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.participation = action.payload;
      })
      .addCase(changeRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = participationSlice.actions;

export default participationSlice.reducer;
