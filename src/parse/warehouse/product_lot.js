import Parse from "parse/dist/parse.min.js";

export const updateWarehouseProductLotEntry = async (objectId, name) => {
  let item = new Parse.Object("warehouse_product_lots");
  item.set("objectId", objectId);
  item.set("name", name);
  try {
    await item.save();
    alert("Lot Produk berhasil diedit");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const deleteWarehouseProductLotEntry = async (objectId) => {
  let item = new Parse.Object("warehouse_product_lots");
  item.set("objectId", objectId);
  try {
    await item.destroy();
    alert("Item Lot Produk telah dihapus");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const createWarehouseProductLotEntry = async (warehouseProductId, name) => {
    let item = new Parse.Object("warehouse_product_lots");
    item.set("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    item.set("name", name);
    try {
      await item.save();
      //alert("Tipe baru berhasil dibuat");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

