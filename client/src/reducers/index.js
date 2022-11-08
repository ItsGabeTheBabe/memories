import { combineReducers } from "redux";
import posts from "./posts" //posts in the state's name inside the posts.js file
import authReducer from "./auth";

export default combineReducers({ posts, authReducer })