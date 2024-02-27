import { CLEAR_USER_DATA, USER_STATE_CHANGE } from "../redux/constants";

export function clearReduxUserData() {
    return (dispatch) => {
      console.log("clearReduxUserData");
      dispatch({ type: CLEAR_USER_DATA });
    };
  }

  export function overhaulReduxUserCurrent(data) {
    return (dispatch) => {
      console.log("overhaulReduxUserCurrent");
      dispatch({ type: USER_STATE_CHANGE, data });
    };
  }