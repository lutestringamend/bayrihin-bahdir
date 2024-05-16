import Parse from "parse/dist/parse.min.js";
import { ORDER_TYPE_DELIVERY_ORDER_IMPLANT, ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT } from "../../constants/order";

const DeliveryOrder = Parse.Object.extend("delivery_orders");
const DeliveryOrderImplant = Parse.Object.extend("delivery_orders_implant");
const DeliveryOrderInstrument = Parse.Object.extend(
  "delivery_orders_instrument",
);


export const createWarehouseProductMutationsForDeliveryOrderDelivery = async (
params
) => {


console.log("createWarehouseProductMutationsForDeliveryOrderDelivery", params);
try {
  let result = await Parse.Cloud.run("createWarehouseProductMutationsForDeliveryOrderDelivery", params);
  if (result) {
      alert("Semua mutasi produk berhasil diupdate");
      return true;
  }
} catch (e) {
  console.error(e);
  alert(`Error! ${e.toString()}`);
}
return false;
};

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

export const updateDeliveryOrderImplantById = async (objectId, editorUserId, inventoryJSON, approvalDate, approverUserId) => {
  try {
    console.log("updateDeliveryOrderImplantById", objectId, editorUserId);
    const query = new Parse.Query(DeliveryOrderImplant);
    query.limit(99999);
    query.equalTo("objectId", objectId);
    query.descending("createdAt");
    let res = await query.first();
    if (res) {
      if (inventoryJSON) {
       res.set("inventoryJSON", inventoryJSON);
      }
      if (approvalDate && approverUserId) {
        res.set("approvalDate", new Date().toISOString());
        res.set("approverUser", {
          __type: "Pointer",
          className: "_User",
          objectId: approverUserId,
        });
      } else if (editorUserId) {
        res.set("editorUser",  {
          __type: "Pointer",
          className: "_User",
          objectId: editorUserId,
        });
      }
      let save = await res.save();
      if (save) {
        return true;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const updateDeliveryOrderInstrumentById = async (objectId, editorUserId, instrumentJSON, unitJSON, approvalDate, approverUserId) => {
  try {
    console.log("updateDeliveryOrderInstrumentById", objectId, editorUserId);
    const query = new Parse.Query(DeliveryOrderInstrument);
    query.limit(99999);
    query.equalTo("objectId", objectId);
    query.descending("createdAt");
    let res = await query.first();
    if (res) {
      if (instrumentJSON) {
       res.set("instrumentJSON", instrumentJSON);
      }
      if (unitJSON) {
        res.set("unitJSON", unitJSON);
       }
      
      if (approvalDate && approverUserId) {
        res.set("approvalDate", new Date().toISOString());
        res.set("approverUser", {
          __type: "Pointer",
          className: "_User",
          objectId: approverUserId,
        });
      } else if (editorUserId) {
        res.set("editorUser",  {
          __type: "Pointer",
          className: "_User",
          objectId: editorUserId,
        });
      }
      let save = await res.save();
      if (save) {
        return true;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return false;
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
    } else {
      query.include("deliveryOrder");
    }
    query.include("editorUser");
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
    } else {
      query.include("deliveryOrder");
    }
    query.include("editorUser");
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const createUpdateDeliveryOrderPickup = async (
  objectId,
    deliveryOrderId,
    deliveryOrderImplantId,
    deliveryOrderInstrumentId,
    creatorUserId,
    implantJSON,
    instrumentJSON,
    unitJSON,
    approvalDate,
    approverUserId,
    driverUserId,
    remark,
) => {
const params = {
  objectId,
    deliveryOrderId,
    deliveryOrderImplantId,
    deliveryOrderInstrumentId,
    creatorUserId,
    implantJSON,
    instrumentJSON,
    unitJSON,
    approvalDate,
    approverUserId,
    driverUserId,
    remark,
};

console.log("createUpdateDeliveryOrderPickup", params);
try {
  let result = await Parse.Cloud.run("createUpdateDeliveryOrderPickup", params);
  if (result) {
      alert(objectId ? "Order Pickup berhasil diedit" : "Order Pickup baru berhasil dibuat");
      return true;
  }
} catch (e) {
  console.error(e);
  alert(`Error! ${e.toString()}`);
}
return false;
};

export const createUpdateDeliveryOrderDelivery = async (
  objectId,
    deliveryOrderId,
    deliveryOrderImplantId,
    deliveryOrderInstrumentId,
    creatorUserId,
    implantJSON,
    instrumentJSON,
    unitJSON,
    approvalDate,
    approverUserId,
    driverUserId,
    remark,
) => {
const params = {
  objectId,
    deliveryOrderId,
    deliveryOrderImplantId,
    deliveryOrderInstrumentId,
    creatorUserId,
    implantJSON,
    instrumentJSON,
    unitJSON,
    approvalDate,
    approverUserId,
    driverUserId,
    remark,
};

console.log("createUpdateDeliveryOrderDelivery", params);
try {
  let result = await Parse.Cloud.run("createUpdateDeliveryOrderDelivery", params);
  if (result) {
      //alert(objectId ? "Order Delivery berhasil diedit" : "Order Delivery baru berhasil dibuat");
      return true;
  }
} catch (e) {
  console.error(e);
  alert(`Error! ${e.toString()}`);
}
return false;
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