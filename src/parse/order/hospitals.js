import Parse from "parse/dist/parse.min.js";

export const createUpdateHospitalEntry = async (objectId, warehouseStorageId, code, name, province, city, address, latlng) => {
    let item = new Parse.Object("hospitals");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("warehouseStorage", {
        __type: "Pointer",
        className: "warehouse_storages",
        objectId: warehouseStorageId,
      });
    item.set("code", code);
    item.set("name", name);
    item.set("province", province);
    item.set("city", city);
    item.set("address", address);
    item.set("latlng", latlng);
    try {
      await item.save();
      alert(objectId ? "Entry Hospital berhasil diedit" : "Hospital baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

export const deleteHospitalEntry = async (objectId) => {
    let item = new Parse.Object("hospitals");
    item.set("objectId", objectId);
    try {
      await item.destroy();
      alert("Hospital telah dihapus");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };