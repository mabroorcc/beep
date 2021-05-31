import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface User {
  id: string;
  name: string;
  userName: string;
  email: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  jwtId: string;
  iat: number;
}

export interface UserState {
  user: undefined | User;
}

const initialState: UserState = {
  user: undefined,
};

export const getCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:4000/auth/a/current/user");
    if (res.ok) {
      const json = await res.json();
      if (json.payload && json.payload.user) return json.payload.user as User;
      return undefined;
    }
    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const getLogedUserAsync = createAsyncThunk(
  "user/getLogedInUser",
  getCurrentUser
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = undefined;
    },
    setProfileAct: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.picture = action.payload;
    },
    setUserNameAct: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.userName = action.payload;
    },
    setFullNameAct: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLogedUserAsync.pending, (state) => {
      state.user = undefined;
    });
    builder.addCase(getLogedUserAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logoutUser, setUserNameAct, setProfileAct, setFullNameAct } =
  UserSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default UserSlice.reducer;
