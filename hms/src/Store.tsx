import { configureStore } from "@reduxjs/toolkit";
import jwtReducer from "./Slices/JwtSlice";
import userReducer from "./Slices/UserSlice";
import profileReducer from "./Slices/ProfileSlice";

export default configureStore({
  reducer: {
    jwt: jwtReducer,
    user: userReducer,
    profile: profileReducer,
  },
});
