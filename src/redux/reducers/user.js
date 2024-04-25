import { TEMP_DEV_USER_DATA } from "../../models/user";
import {
    USER_STATE_CHANGE,
    CLEAR_USER_DATA,
  } from "../constants";
  
  export const initialState = {
    currentUser: null,
  };
  
  export const user = (state = initialState, action) => {
    switch (action.type) {
      case USER_STATE_CHANGE:
        return {
          ...state,
          currentUser: action.data,
        };
      case CLEAR_USER_DATA:
        return {
          ...initialState,
          currentUser: null,
        };
      default:
        return state;
    }
  };
  