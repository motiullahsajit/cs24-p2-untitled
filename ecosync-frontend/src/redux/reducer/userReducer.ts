import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
  username: string;
  role: string;
  email: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  _id: string;
  token: string;
};

interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}
const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExists: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExits: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { userExists, userNotExits } = userReducer.actions;
