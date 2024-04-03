import { CLEAR_ORDER_DATA, NEW_ORDER_STATE_OVERHAUL, NEW_REQUEST_ORDER_STATE_UPDATE, ORDER_DOCTORS_STATE_OVERHAUL, ORDER_HOSPITALS_STATE_OVERHAUL, ORDER_WAREHOUSE_STORAGES_STATE_OVERHAUL } from "../redux/constants";
import { DELIVERY_ORDER_NUMBER_DEFAULT_FORMAT } from "../constants/order";
import { getMonthInRomanNumeral } from ".";

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

  export function updateReduxNewRequestOrder(data) {
    return (dispatch) => {
      //console.log("updateReduxRequestOrder");
      dispatch({ type: NEW_REQUEST_ORDER_STATE_UPDATE, data });
    };
  }

  export function overhaulReduxOrderDoctors(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderDoctors", data?.length);
      dispatch({ type: ORDER_DOCTORS_STATE_OVERHAUL, data });
    };
  }

  export function overhaulReduxOrderHospitals(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderHospitals", data?.length);
      dispatch({ type: ORDER_HOSPITALS_STATE_OVERHAUL, data });
    };
  }

  export function overhaulReduxOrderWarehouseStorages(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderWarehouseStorages", data?.length);
      dispatch({ type: ORDER_WAREHOUSE_STORAGES_STATE_OVERHAUL, data });
    };
  }

  export const formatDeliveryOrderNumber = (number, month, year) => {
    try {
      let code = DELIVERY_ORDER_NUMBER_DEFAULT_FORMAT
        .replace("%NUMBER%", number ? number.toString() : "xxxx")
        .replace("%MONTH%", getMonthInRomanNumeral(month))
        .replace("%YEAR%", year ? year.toString() : new Date().getFullYear().toString());
      return code;
    } catch (e) {
      console.error(e);
    }
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