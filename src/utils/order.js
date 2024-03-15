import { CLEAR_ORDER_DATA, NEW_ORDER_STATE_OVERHAUL } from "../redux/constants";

export function clearReduxOrderData() {
    return (dispatch) => {
      console.log("clearReduxOrderData");
      dispatch({ type: CLEAR_ORDER_DATA });
    };
  }

  export function overhaulReduxNewOrder(data) {
    return (dispatch) => {
      console.log("overhaulReduxNewOrder");
      dispatch({ type: NEW_ORDER_STATE_OVERHAUL, data });
    };
  }

  export const insertItemsToRequestOrderPackage = (list, objectId, items, notes) => {
    let newList = [];
    try {
      for (let p of list) {
        if (p?.objectId === objectId) {
          newList.push({
            ...p,
            items,
            notes,
          });
        } else {
          newList.push(p);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return newList;
  }

  export const deleteItemsFromRequestOrderPackage = (list, objectId) => {
    try {
      let newList = [];
      for (let l of list) {
        if (l?.objectId === objectId) {
          newList.push({
            ...l,
            items: [],
            notes: "",
          });
        } else {
          newList.push(l);
        }
      }
      return newList;
    } catch (e) {
      console.error(e);
    }
    return list;
  }