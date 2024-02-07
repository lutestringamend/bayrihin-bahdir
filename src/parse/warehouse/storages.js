import Parse from "parse/dist/parse.min.js";

export const createWarehouseStorageEntry = async (name) => {
    let item = new Parse.Object("warehouse_storages");
    item.set("name", name);
    try {
        await item.save();
        alert('Storage baru berhasil dibuat');
        return true;
    } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      };
  };

  export const updateWarehouseStorageEntry = async (objectId, name) => {
    let item = new Parse.Object("warehouse_storages");
    item.set("objectId", objectId);
    item.set("name", name);
    try {
        await item.save();
        alert('Storage berhasil diedit');
        return true;
    } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      };
  };

  export const deleteWarehouseStorageEntry = async (objectId) => {
    let item = new Parse.Object("warehouse_storages");
    item.set("objectId", objectId);
    try {
        await item.destroy();
        alert('Item Storage telah dihapus');
        return true;
    } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      };
  };

