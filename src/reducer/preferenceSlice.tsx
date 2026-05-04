import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { autoSetupRepo, getUserRepos, saveDefaultRepo } from "../api/api";
import { RootState } from "../app/store";
import { API状态, API状态Type, ThemeMode } from "./common";

export interface Repo {
  name: string
  visibility: string
  default_branch?: string
}

interface PreferenceState {
  userRepos: Repo[]
  status: API状态
  themeMode: ThemeMode
}

const initialState: PreferenceState = {
  userRepos: [],
  status: {
    getUserReposAsync: API状态Type.IDLE,
    autoSetupRepoAsync: API状态Type.IDLE,
    saveDefaultRepoAsync: API状态Type.IDLE,
  },
  themeMode: 'system',
}

export const getUserReposAsync = createAsyncThunk(
  'user/fetchUserRepos',
  async () => {
    const response = await getUserRepos();
    // returned value becomes the `fulfilled` action payload
    return response;
  }
)

export const autoSetupRepoAsync = createAsyncThunk(
  'user/autoSetupRepo',
  async (repo名称: string) => {
    await autoSetupRepo(repo名称);
  }
);

export const saveDefaultRepoAsync = createAsyncThunk(
  'user/saveDefaultRepo',
  async (defaultRepo: Repo) => {
    await saveDefaultRepo(defaultRepo);
  }
);

export const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  reducers: {
    setThemeMode: (state: { themeMode: string; }, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserReposAsync.pending, (state) => {
        state.status.getUserReposAsync = API状态Type.LOADING;
      })
      .addCase(getUserReposAsync.fulfilled, (state, action) => {
        state.status.getUserReposAsync = API状态Type.IDLE;
        state.userRepos = action.payload as Repo[];
      })
      .addCase(getUserReposAsync.rejected, (state) => {
        state.status.getUserReposAsync = API状态Type.FAIL;
        state.userRepos = [];
      })

      .addCase(autoSetupRepoAsync.pending, (state) => {
        state.status.autoSetupRepoAsync = API状态Type.LOADING;
      })
      .addCase(autoSetupRepoAsync.fulfilled, (state) => {
        state.status.autoSetupRepoAsync = API状态Type.IDLE;
      })
      .addCase(autoSetupRepoAsync.rejected, (state) => {
        state.status.autoSetupRepoAsync = API状态Type.FAIL;
      })

      .addCase(saveDefaultRepoAsync.pending, (state) => {
        state.status.saveDefaultRepoAsync = API状态Type.LOADING;
      })
      .addCase(saveDefaultRepoAsync.fulfilled, (state) => {
        state.status.saveDefaultRepoAsync = API状态Type.IDLE;
      })
      .addCase(saveDefaultRepoAsync.rejected, (state) => {
        state.status.saveDefaultRepoAsync = API状态Type.FAIL;
      });
  },
})

export const selectUserRepos = (state: RootState): Repo[] => state.preference.userRepos;
export const selectPreferenceAPI状态 = (state: RootState): API状态 => state.preference.status;
export const selectThemeMode = (state: RootState): ThemeMode => state.preference.themeMode;
export const { setThemeMode } = preferenceSlice.actions;
export default preferenceSlice.reducer;
