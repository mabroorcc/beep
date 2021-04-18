import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

//  location.replace("http:localhost:4000/auth/a/login/google")
export const getLogedUserAsync = createAsyncThunk(
  "user/getLogedInUser",
  async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/a/current/user");
      const json = await res.json();

      return json.user;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLogedUserAsync.pending, (state) => {
      state.user = undefined;
    });
    builder.addCase(getLogedUserAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const selectUser = (state: RootState) => state.user.user;
export default UserSlice.reducer;
