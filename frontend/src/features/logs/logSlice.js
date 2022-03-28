import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import logService from './logService';
import getError from '../../util/getError';

const initialState = {
  logs: [],
  isError: false,
  isSuccess: false,
  isLoading: false
};

export const getLogs = createAsyncThunk('/log/getAll', async (tripId, thunkAPI) => {
  try {
    return await logService.getLogs(tripId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const createLog = createAsyncThunk('/log/create', async (logData, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await logService.createLog(logData, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs = action.payload;
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs = [...state.logs, action.payload.log];
      })
      .addCase(createLog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = logSlice.actions;

export default logSlice.reducer;
