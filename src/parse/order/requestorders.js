import Parse from "parse/dist/parse.min.js";

export const createUpdateRequestOrderEntry = async (
        objectId,
        deliveryOrderNumber,
        doctorId,
        hospitalId,
        warehouseStorageId,
        procedure,
        surgeryDate,
        inventoryJSON,
    ) => {
    let item = new Parse.Object("request_orders");
    if (objectId) {
        item.set("objectId", objectId);
        item.set("deliveryOrderNumber", deliveryOrderNumber);
    } else {
      const query = new Parse.Query("request_orders");
      query.limit(99999);
      query.descending("createdAt");
      const last = await query.first();
      if (!last || last.get("number") === undefined || last.get("number") === null || last.get("number") < 1) {
        item.set("number", 1);
        item.set("deliveryOrderNumber", "REQUEST ORDER #1");
      } else {
        item.set("number", last.get("number") + 1);
        item.set("deliveryOrderNumber", `REQUEST ORDER #${last.get("number") + 1}`);
      }
    }
    item.set("isActive", true);
    item.set("procedure", procedure);
    item.set("surgeryDate", surgeryDate);
    item.set("inventoryJSON", inventoryJSON);

    item.set("doctor", {
        __type: "Pointer",
        className: "doctors",
        objectId: doctorId,
      });
      item.set("hospital", {
        __type: "Pointer",
        className: "hospitals",
        objectId: hospitalId,
      });
      item.set("warehouseStorage", {
        __type: "Pointer",
        className: "warehouse_storages",
        objectId: warehouseStorageId,
      });

    try {
      await item.save();
      alert(objectId ? "Request Order berhasil diedit" : "Request Order baru berhasil dibuat");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  export const getRequestOrderById = async (objectId) => {
    let result = [];
    try {
      const query = new Parse.Query("request_orders");
      query.limit(99999);
      query.equalTo("objectId", objectId);
      const res = await query.first();
      result = res.toJSON();
    } catch (e) {
      console.error(e);
    }
    return result;
  };

  export const switchRequestOrderStatus = async (objectId, isActive) => {
    let item = new Parse.Object("request_order");
    item.set("objectId", objectId);
    item.set("isActive", isActive ? isActive : true);
    
    try {
      await item.save();
      alert("Status Request Order berhasil diganti!");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };