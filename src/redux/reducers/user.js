//import { TEMP_DEV_USER_DATA } from "../../models/user";
import {
    USER_STATE_CHANGE,
    CLEAR_USER_DATA,
    USER_PRIVILEGES_STATE_CHANGE,
    USER_ACCOUNT_ROLES_STATE_CHANGE,
  } from "../constants";
  
  export const initialState = {
    currentUser: null,
    privileges: null,
    accountRoles: null,
  };
  
  export const user = (state = initialState, action) => {
    switch (action.type) {
      case USER_STATE_CHANGE:
        return {
          ...state,
          currentUser: action.data,
        };
      case USER_PRIVILEGES_STATE_CHANGE:
        return {
          ...state,
          privileges: action.data,
        };
      case USER_ACCOUNT_ROLES_STATE_CHANGE:
        return {
          ...state,
          accountRoles: action.data,
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
  