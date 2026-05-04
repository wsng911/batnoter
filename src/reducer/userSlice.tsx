import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser个人资料 } from "../api/api";
import { RootState } from "../app/store";
import { API状态Type } from "./common";

export interface User {
  email: string
  name: string
  location: string
  avatar_url: string
  default_repo?: {
    name: string,
    visibility: string,
    default_branch: string
  }
}

interface UserState {
  value: User | null
  status: API状态Type
}

const initialState: UserState = {
  value: null,
  status: API状态Type.IDLE
}

export const getUser个人资料Async = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const response = await getUser个人资料();
    // returned value becomes the `fulfilled` action payload
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoading: (state) => {
      state.status = API状态Type.LOADING;
    },
    user退出登录: (state) => {
      state.value = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser个人资料Async.pending, (state) => {
        state.status = API状态Type.LOADING;
      })
      .addCase(getUser个人资料Async.fulfilled, (state, action) => {
        state.status = API状态Type.IDLE;
        state.value = action.payload as User;
      })
      .addCase(getUser个人资料Async.rejected, (state) => {
        state.status = API状态Type.FAIL;
        state.value = null;
        localStorage.removeItem("token")
      });
  },
})

export const { userLoading, user退出登录 } = userSlice.actions;
export const selectUser = (state: RootState): User | null => state.user.value;
export const selectUserAPI状态 = (state: RootState): API状态Type => state.user.status;
export default userSlice.reducer;
