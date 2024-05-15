
import { RequestOrderModel } from "../../models/requestorder";
import { formatDeliveryOrderNumber } from "../../utils/order";
import {
    CLEAR_ORDER_DATA,
    NEW_ORDER_STATE_OVERHAUL,
    NEW_REQUEST_ORDER_STATE_UPDATE,
    ORDER_COMBINED_ORDERS_STATE_OVERHAUL,
    ORDER_DELIVERY_ORDERS_IMPLANT_STATE_OVERHAUL,
    ORDER_DELIVERY_ORDERS_INSTRUMENT_STATE_OVERHAUL,
    ORDER_DELIVERY_ORDERS_STATE_OVERHAUL,
    ORDER_DOCTORS_STATE_OVERHAUL,
    ORDER_HOSPITALS_STATE_OVERHAUL,
    ORDER_REQUEST_ORDERS_STATE_OVERHAUL,
    ORDER_WAREHOUSE_STORAGES_STATE_OVERHAUL,
  } from "../constants";
  
  export const initialState = {
    newRequestOrder: {
      ...RequestOrderModel,
      deliveryOrderNumber: formatDeliveryOrderNumber(),
    },
    newOrder: null,
    combinedOrders: null,
    requestOrders: null,
    deliveryOrders : null,
    deliveryOrdersImplant: null,
    deliveryOrdersInstrument: null,
    doctors: null,
    hospitals: null,
    warehouseStorages: null,
  };
  
  export const order = (state = initialState, action) => {
    switch (action.type) {
      case NEW_ORDER_STATE_OVERHAUL:
        return {
          ...state,
          newOrder: action.data,
        };
      case NEW_REQUEST_ORDER_STATE_UPDATE:
        return {
          ...state,
          newRequestOrder: action.data,
        };
      case ORDER_COMBINED_ORDERS_STATE_OVERHAUL:
        return {
          ...state,
          combinedOrders: action.data,
        };
      case ORDER_REQUEST_ORDERS_STATE_OVERHAUL:
        return {
          ...state,
          requestOrders: action.data,
        };
      case ORDER_DELIVERY_ORDERS_STATE_OVERHAUL:
        return {
          ...state,
          deliveryOrders: action.data,
        };
      case ORDER_DELIVERY_ORDERS_IMPLANT_STATE_OVERHAUL:
        return {
          ...state,
          deliveryOrdersImplant: action.data,
        };
      case ORDER_DELIVERY_ORDERS_INSTRUMENT_STATE_OVERHAUL:
        return {
          ...state,
          deliveryOrdersInstrument: action.data,
        };
      case ORDER_DOCTORS_STATE_OVERHAUL:
        return {
          ...state,
          doctors: action.data,
        };
      case ORDER_HOSPITALS_STATE_OVERHAUL:
        return {
          ...state,
          hospitals: action.data,
        };
      case ORDER_WAREHOUSE_STORAGES_STATE_OVERHAUL:
        return {
          ...state,
          warehouseStorages: action.data,
        };
          
      case CLEAR_ORDER_DATA:
        return initialState;
      default:
        return state;
    }
  };
  