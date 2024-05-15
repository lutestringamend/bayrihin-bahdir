import Parse from "parse/dist/parse.min.js";
import { ORDER_TYPE_DELIVERY_ORDER_IMPLANT, ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT } from "../../constants/order";

const DeliveryOrder = Parse.Object.extend("delivery_orders");
const DeliveryOrderImplant = Parse.Object.extend("delivery_orders_implant");
const DeliveryOrderInstrument = Parse.Object.extend(
  "delivery_orders_instrument",
);

export const getDeliveryOrderById = async (objectId, withChildren) => {
  let result = null;
  try {
    const query = new Parse.Query(DeliveryOrder);
    query.limit(99999);
    query.equalTo("objectId", objectId);
    const res = await query.first();
    result = res.toJSON();
    if (withChildren) {
      let children = [];
      let doImplant = await getDeliveryOrderImplantById(null, result?.objectId, true);
      let doInstrument = await getDeliveryOrderInstrumentById(null, result?.objectId, true);
      if (doImplant) {
        children.push({
          ...doImplant,
          type: ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
        });
      }
      if (doInstrument) {
        children.push({
          ...doInstrument,
          type: ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
        });
      }
      result = {...result, children};
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getDeliveryOrderImplantById = async (objectId, deliveryOrderId, excludeDO) => {
  let result = null;
  try {
    const query = new Parse.Query(DeliveryOrderImplant);
    query.limit(99999);
    if (deliveryOrderId) {
      query.equalTo("deliveryOrder", {
        __type: "Pointer",
        className: "delivery_orders",
        objectId: deliveryOrderId,
      });
      query.descending("createdAt");
    } else {
      query.equalTo("objectId", objectId);
    }
    if (excludeDO) {
      query.exclude("deliveryOrder");
    }
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getDeliveryOrderInstrumentById = async (objectId, deliveryOrderId, excludeDO) => {
  let result = null;
  try {
    const query = new Parse.Query(DeliveryOrderInstrument);
    query.limit(99999);
    if (deliveryOrderId) {
      query.equalTo("deliveryOrder", {
        __type: "Pointer",
        className: "delivery_orders",
        objectId: deliveryOrderId,
      });
      query.descending("createdAt");
    } else {
      query.equalTo("objectId", objectId);
    }
    if (excludeDO) {
      query.exclude("deliveryOrder");
    }
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const createUpdateDeliveryOrderEntry = async (
    objectId,
    approverUserId,
    requestOrderId,
    deliveryOrderNumber,
    doctorId,
    hospitalId,
    warehouseStorageId,
    procedure,
    surgeryDate,
    deliveryDate,
    remark,
    implantInventoryJSON,
    instrumentInventoryJSON,
    unitInventoryJSON,
    tsPICUserId,
) => {
    if (objectId) {
        return false;
    }
 const params = {
    approverUserId,
    requestOrderId,
    deliveryOrderNumber,
    doctorId,
    hospitalId,
    warehouseStorageId,
    procedure,
    surgeryDate,
    deliveryDate,
    remark,
    implantInventoryJSON,
    instrumentInventoryJSON,
    unitInventoryJSON,
    tsPICUserId,
  };

  console.log("createDeliveryOrder", params);
  try {
    let result = await Parse.Cloud.run("createDeliveryOrder", params);
    if (result) {
        alert(objectId ? "Delivery Order berhasil diedit" : "Delivery Order baru berhasil dibuat");
        return true;
    }
  } catch (e) {
    console.error(e);
    alert(`Error! ${e.toString()}`);
  }
  return false;
};