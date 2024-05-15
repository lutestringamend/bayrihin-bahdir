import Parse from "parse/dist/parse.min.js";

export const getDeliveryOrderById = async (objectId) => {
  let result = [];
  try {
    const query = new Parse.Query("delivery_orders");
    query.limit(99999);
    query.equalTo("objectId", objectId);
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getDeliveryOrderImplantById = async (objectId) => {
  let result = [];
  try {
    const query = new Parse.Query("delivery_orders_implant");
    query.limit(99999);
    query.equalTo("objectId", objectId);
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getDeliveryOrderInstrumentById = async (objectId) => {
  let result = [];
  try {
    const query = new Parse.Query("delivery_orders_instrument");
    query.limit(99999);
    query.equalTo("objectId", objectId);
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