import { CLEAR_ORDER_DATA, NEW_ORDER_STATE_OVERHAUL, NEW_REQUEST_ORDER_STATE_UPDATE, ORDER_COMBINED_ORDERS_STATE_OVERHAUL, ORDER_DELIVERY_ORDERS_STATE_OVERHAUL, ORDER_DOCTORS_STATE_OVERHAUL, ORDER_HOSPITALS_STATE_OVERHAUL, ORDER_REQUEST_ORDERS_STATE_OVERHAUL, ORDER_WAREHOUSE_STORAGES_STATE_OVERHAUL } from "../redux/constants";
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

  export function overhaulReduxOrderCombinedOrders(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderCombinedOrders", data?.length);
      dispatch({ type: ORDER_COMBINED_ORDERS_STATE_OVERHAUL, data });
    };
  }

  export function overhaulReduxOrderRequestOrders(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderRequestOrders", data?.length);
      dispatch({ type: ORDER_REQUEST_ORDERS_STATE_OVERHAUL, data });
    };
  }

  export function overhaulReduxOrderDeliveryOrders(data) {
    return (dispatch) => {
      console.log("overhaulReduxOrderDeliveryOrders", data?.length);
      dispatch({ type: ORDER_DELIVERY_ORDERS_STATE_OVERHAUL, data });
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

  export const processRequestOrderInventory = (newOrder) => {
    let inventory = {
      implants: [],
      instruments: [],
      units: [],
    };
    let count = 0;
    try {
      let implants = listRequestOrderInventoryByCategory(newOrder["implants"]);
      let instruments = listRequestOrderInventoryByCategory(newOrder["instruments"]);
      let units = listRequestOrderInventoryByCategory(newOrder["units"]);
      inventory = {
        implants: implants?.result,
        instruments: instruments?.result,
        units: units?.result,
      };
      count = implants?.count + instruments?.count + units?.count;

    } catch (e) {
      console.error(e);
    }
    return {
      inventoryJSON: JSON.stringify(inventory),
      count,
    };
  }

  export const listRequestOrderInventoryByCategory = (data) => {
    let result = [];
    let count = 0;
    try {
      for (let i = 0; i < data?.length; i++) {
        if (!(data[i]?.items === undefined || data[i]?.items?.length === undefined || data[i]?.items?.length < 1)) {
          result.push(data[i]);
          count += data[i]?.items?.length;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      result,
      count,
    }
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