import Parse from "parse/dist/parse.min.js";

export const getWarehouseProductById = async (id) => {
  let result = null;
  try {
    const query = new Parse.Query("warehouse_products");
    query.limit(999999);
    query.equalTo("objectId", id);
    const resProduct = await query.first();
    result = resProduct.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const postWarehouseProductItem = async (
  productId,
  warehouseTypeId,
  catalogNo,
  brand,
  name,
  subCategory,
  category
) => {
  try {
    const query = new Parse.Query("warehouse_products");
    query.limit(999999);
    query.equalTo("catalogNo", catalogNo);
    const queriedProduct = await query.first();
    if (queriedProduct) {
      alert("Katalog No ini sudah ada!");
      return false;
    }

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
    item.set("brand", brand ? brand : "");
    item.set("name", name);
    if (category) {
      item.set("category", parseInt(category));
    }
    if (subCategory) {
      item.set("subCategory", subCategory);
    }
    await item.save();

    alert(productId ? "Produk berhasil diedit" : "Produk baru berhasil dibuat");

    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const deleteWarehouseProduct = async (objectId) => {
  let item = new Parse.Object("warehouse_products");
  item.set("objectId", objectId);
  try {
    await item.destroy();
    alert("Produk telah dihapus");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
