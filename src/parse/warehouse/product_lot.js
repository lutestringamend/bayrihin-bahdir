import Parse from "parse/dist/parse.min.js";

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