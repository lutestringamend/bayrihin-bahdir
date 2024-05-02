import { CLEAR_USER_DATA, USER_ACCOUNT_ROLES_STATE_CHANGE, USER_PRIVILEGES_STATE_CHANGE, USER_STATE_CHANGE } from "../redux/constants";

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

  export function updateReduxUserPrivileges(data) {
    return (dispatch) => {
      console.log("updateReduxUserPrivileges", data?.length);
      dispatch({ type: USER_PRIVILEGES_STATE_CHANGE, data });
    };
  }

  export function updateReduxUserAccountRoles(data) {
    return (dispatch) => {
      console.log("updateReduxUserAccountRoles");
      dispatch({ type: USER_ACCOUNT_ROLES_STATE_CHANGE, data });
    };
  }