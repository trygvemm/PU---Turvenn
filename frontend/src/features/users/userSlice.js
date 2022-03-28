import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getError from '../../util/getError';

import userService from './userService';

const initialState = {
  users: [],
  user: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  status: ''
};

export const getUsers = createAsyncThunk('/users/getAll', async (_, thunkAPI) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getUser = createAsyncThunk('/users/get', async (userId, thunkAPI) => {
  try {
    return await userService.getUser(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const changeRoleAdmin = createAsyncThunk('/users/role', async (userData, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await userService.changeRoleAdmin(userData.userId, userData.role, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const editProfile = createAsyncThunk('/users/edit', async (userData, thunkAPI) => {
  try {
    const { accessToken } = thunkAPI.getState().auth.user;
    return await userService.editProfile(userData, accessToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const userSlice = createSlice({
  name: 'user',
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
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeRoleAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeRoleAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(changeRoleAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.status = 'updated';
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.status = 'update failed';
      });
  }
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
