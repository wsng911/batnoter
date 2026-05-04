import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { delete否te, getAll否tes, get否te, get否tesTree, save否te, search否tes } from "../api/api";
import { RootState } from "../app/store";
import TreeUtil from "../util/TreeUtil";
import { API状态, API状态Type } from "./common";

export interface 搜索Params {
  page?: number
  path?: string
  query?: string
}

export interface Tree否de {
  name: string
  sha?: string
  path: string
  content?: string
  size?: number
  is_dir: boolean
  cached: boolean
  children?: Tree否de[]
}

export interface 否teResponsePayload {
  sha: string
  path: string
  content: string
  size: number
  is_dir: boolean
}

export interface 否tePage {
  total: number
  notes: 否teResponsePayload[]
}

interface 否teState {
  page: 否tePage
  tree: Tree否de
  current: 否teResponsePayload | null
  status: API状态
}

const initialState: 否teState = {
  page: {
    total: 1,
    notes: []
  },
  tree: {
    name: "root",
    path: "",
    cached: false,
    is_dir: true
  },
  current: null,
  status: {
    search否tesAsync: API状态Type.IDLE,
    get否tesTreeAsync: API状态Type.IDLE,
    get否tesAsync: API状态Type.IDLE,
    get否teAsync: API状态Type.IDLE,
    save否teAsync: API状态Type.IDLE,
    delete否teAsync: API状态Type.IDLE,
  }
}

export const search否tesAsync = createAsyncThunk(
  'note/search否tes',
  async (params?: 搜索Params) => {
    const response = await search否tes(params?.page, params?.path, params?.query);
    return response;
  }
);

export const get否tesTreeAsync = createAsyncThunk(
  'note/fetch否tesTree',
  async () => {
    const response = await get否tesTree() as 否teResponsePayload[];
    return response;
  }
);

export const get否tesAsync = createAsyncThunk(
  'note/fetch否tes',
  async (path: string) => {
    const response = await getAll否tes(path) as 否teResponsePayload[];
    return response;
  }, {
  condition: (path, { getState }) => {
    const state = getState() as RootState;
    const node = TreeUtil.search否de(state.notes.tree, path);
    const hasFiles = !!(node?.children && node.children.find(o => !o.is_dir));
    return !node?.cached && hasFiles;
  }
}
);

export const get否teAsync = createAsyncThunk(
  'note/fetch否te',
  async (path: string) => {
    const response = await get否te(path) as 否teResponsePayload;
    return response;
  }, {
  condition: (path, { getState }) => {
    const state = getState() as RootState;
    const node = TreeUtil.search否de(state.notes.tree, path);
    return !node?.cached;
  }
}
);

export const save否teAsync = createAsyncThunk(
  'note/save否te',
  async ({ path, content, sha }: { path: string, content: string, sha?: string }) => {
    const response = await save否te(path, content, sha) as 否teResponsePayload;
    return {
      ...response,
      content: content
    };
  }
);

export const delete否teAsync = createAsyncThunk(
  'note/delete否te',
  async (note: Tree否de) => {
    await delete否te(note.path, note.sha);
    return note;
  }
);

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    reset状态: (state) => { state.status = initialState.status; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(search否tesAsync.pending, (state) => {
        state.status.search否tesAsync = API状态Type.LOADING;
      })
      .addCase(search否tesAsync.fulfilled, (state, action) => {
        state.page = action.payload as 否tePage;
        const tree = TreeUtil.parse(state.tree, state.page.notes, true);
        state.tree = tree;
        state.status.search否tesAsync = API状态Type.IDLE;
      })
      .addCase(search否tesAsync.rejected, (state) => {
        state.page = initialState.page;
        state.status.search否tesAsync = API状态Type.FAIL;
      })

      .addCase(get否tesTreeAsync.pending, (state) => {
        state.status.get否tesTreeAsync = API状态Type.LOADING;
      })
      .addCase(get否tesTreeAsync.fulfilled, (state, action) => {
        state.page.notes = action.payload;
        const tree = TreeUtil.parse(initialState.tree, state.page.notes, false);
        state.tree = tree;
        state.status.get否tesTreeAsync = API状态Type.IDLE;
      })
      .addCase(get否tesTreeAsync.rejected, (state) => {
        state.page.notes = initialState.page.notes;
        state.status.get否tesTreeAsync = API状态Type.FAIL;
      })

      .addCase(get否tesAsync.pending, (state) => {
        state.status.get否tesAsync = API状态Type.LOADING;
      })
      .addCase(get否tesAsync.fulfilled, (state, action) => {
        state.page.notes = action.payload;
        const tree = TreeUtil.parse(state.tree, state.page.notes, true);
        state.tree = tree;
        state.status.get否tesAsync = API状态Type.IDLE;
      })
      .addCase(get否tesAsync.rejected, (state) => {
        state.page.notes = initialState.page.notes;
        state.status.get否tesAsync = API状态Type.FAIL;
      })

      .addCase(get否teAsync.pending, (state) => {
        state.current = null
        state.status.get否teAsync = API状态Type.LOADING;
      })
      .addCase(get否teAsync.fulfilled, (state, action) => {
        state.current = action.payload;
        const tree = TreeUtil.parse(state.tree, [action.payload]);
        state.tree = tree;
        state.status.get否teAsync = API状态Type.IDLE;
      })
      .addCase(get否teAsync.rejected, (state) => {
        state.status.get否teAsync = API状态Type.FAIL;
      })

      .addCase(save否teAsync.pending, (state) => {
        state.status.save否teAsync = API状态Type.LOADING;
      })
      .addCase(save否teAsync.fulfilled, (state, action) => {
        state.page.notes = state.page.notes.filter(n => n.sha !== action.payload.sha)
        state.page.notes.push(action.payload)
        const tree = TreeUtil.parse(state.tree, [action.payload]);
        state.tree = tree;
        state.status.save否teAsync = API状态Type.IDLE;
      })
      .addCase(save否teAsync.rejected, (state) => {
        state.status.save否teAsync = API状态Type.FAIL;
      })

      .addCase(delete否teAsync.pending, (state) => {
        state.status.delete否teAsync = API状态Type.LOADING;
      })
      .addCase(delete否teAsync.fulfilled, (state, action) => {
        state.page.notes = state.page.notes.filter(n => n.path !== action.payload.path)
        TreeUtil.delete否de(state.tree, action.payload.path)
        state.status.delete否teAsync = API状态Type.IDLE;
      })
      .addCase(delete否teAsync.rejected, (state) => {
        state.status.delete否teAsync = API状态Type.FAIL;
      });
  },
})

export const { reset状态 } = noteSlice.actions;
export const selectCurrent否te = (state: RootState): 否teResponsePayload | null => state.notes.current;
export const select否tesPage = (state: RootState): 否tePage => state.notes.page;
export const select否tesTree = (state: RootState): Tree否de => state.notes.tree;
export const select否teAPI状态 = (state: RootState): API状态 => state.notes.status;
export default noteSlice.reducer;
