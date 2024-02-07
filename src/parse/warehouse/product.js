import Parse from "parse/dist/parse.min.js";

export const postWarehouseProductItem = async (
  productId,
  warehouseTypeId,
  catalogNo,
  name,
) => {
  try {
    let item = new Parse.Object("warehouse_products");
    if (productId) {
      item.set("objectId", productId);
    } else {
      item.set("balanceStock", 0);
      item.set("balanceOnDelivery", 0);
      item.set("balanceTotal", 0);
    }
    item.set("warehouseType", {
      __type: "Pointer",
      className: "warehouse_types",
      objectId: warehouseTypeId,
    });
    item.set("catalogNo", catalogNo);
    item.set("name", name);
    await item.save();

    alert(productId ? "Produk berhasil diedit" : "Produk baru berhasil dibuat");

    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
