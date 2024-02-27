import Parse from "parse/dist/parse.min.js";

export const updateWarehouseProductLotEntry = async (objectId, name, remark, tray) => {
  let item = new Parse.Object("warehouse_product_lots");
  item.set("objectId", objectId);
  item.set("name", name);
  item.set("remark", remark);
  if (tray) {
    item.set("tray", tray);
  }
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

export const createWarehouseProductLotEntry = async (warehouseProductId, name, remark, tray) => {
  const query = new Parse.Query("warehouse_product_lots");
    query.limit(999999);
    query.equalTo("warehouseProduct", {
      __type: "Pointer",
      className: "warehouse_products",
      objectId: warehouseProductId,
    });
    query.equalTo("name", name);
    const queriedProduct = await query.first();
    if (queriedProduct) {
      alert("Lot/SN ini sudah ada!");
      return false;
    }

    let item = new Parse.Object("warehouse_product_lots");
    item.set("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    item.set("name", name);
    item.set("remark", remark);
    if (tray) {
      item.set("tray", tray);
    }
    try {
      await item.save();
      //alert("Tipe baru berhasil dibuat");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

