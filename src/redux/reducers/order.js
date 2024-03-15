
import {
    CLEAR_ORDER_DATA,
    NEW_ORDER_STATE_OVERHAUL,
  } from "../constants";
  
  export const initialState = {
    newOrder: null,
  };
  
  export const order = (state = initialState, action) => {
    switch (action.type) {
      case NEW_ORDER_STATE_OVERHAUL:
        return {
          ...state,
          newOrder: action.data,
        };
      case CLEAR_ORDER_DATA:
        return initialState;
      default:
        return state;
    }
  };
  