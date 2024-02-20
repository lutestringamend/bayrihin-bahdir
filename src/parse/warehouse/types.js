import Parse from "parse/dist/parse.min.js";

export const createWarehouseTypeEntry = async (category, name) => {
  let item = new Parse.Object("warehouse_types");
  item.set("category", parseInt(category));
  item.set("name", name);
  try {
    await item.save();
    alert("Tipe baru berhasil dibuat");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const updateWarehouseTypeEntry = async (objectId, category, name) => {
  let item = new Parse.Object("warehouse_types");
  item.set("objectId", objectId);
  item.set("category", parseInt(category));
  item.set("name", name);
  try {
    await item.save();
    alert("Tipe berhasil diedit");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const deleteWarehouseTypeEntry = async (objectId) => {
  let item = new Parse.Object("warehouse_types");
  item.set("objectId", objectId);
  try {
    await item.destroy();
    alert("Tipe telah dihapus");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
