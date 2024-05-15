import Parse from "parse/dist/parse.min.js";

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
        return true;
    }
  } catch (e) {
    console.error(e);
    alert(`Error! ${e.toString()}`);
  }
  return false;
};