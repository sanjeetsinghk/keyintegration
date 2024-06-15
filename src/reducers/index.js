import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import themeChange from "./themeChange";
import common from "./common";

export default combineReducers({
  auth,
  message,
  themeChange,
  common
});