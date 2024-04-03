import Parse from "parse/dist/parse.min.js";

export const createUpdateRequestOrderEntry = async (
        objectId,
        deliveryOrderNumber,
        doctorId,
        hospitalId,
        warehouseStorageId,
        procedure,
        surgeryDate,
        deliveryDate,
        inventoryJSON
    ) => {
    let item = new Parse.Object("request_orders");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("isActive", true);
    item.set("deliveryOrderNumber", deliveryOrderNumber);
    item.set("procedure", procedure);
    item.set("surgeryDate", surgeryDate);
    item.set("deliveryDate", deliveryDate);
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
      alert(objectId ? "Request Order berhasil diedit" : "Request Order baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
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