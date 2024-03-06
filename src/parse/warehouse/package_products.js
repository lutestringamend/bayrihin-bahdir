import Parse from "parse/dist/parse.min.js";

export const createWarehousePackageProductEntry = async (
  warehousePackage,
  warehouseProductId,
  quantity,
  notes
) => {
  let item = new Parse.Object("warehouse_package_products");
  item.set("warehouseProduct", {
    __type: "Pointer",
    className: "warehouse_products",
    objectId: warehouseProductId,
  });
  item.set("warehousePackage", {
    __type: "Pointer",
    className: "warehouse_packages",
    objectId: warehousePackage?.objectId,
  });
  item.set("category", parseInt(warehousePackage?.category));
  item.set("quantity", parseInt(quantity));
  if (notes) {
    item.set("notes", notes);
  }

  item.set("isPartOfUnitFullSetPackage", warehousePackage?.isUnitFullSetPackage || warehousePackage?.isPartOfUnitFullSetPackage);
  item.set("isPartOfUnitPartialSetPackage", warehousePackage?.isUnitPartialSetPackage || warehousePackage?.isPartOfUnitPartialSetPackage);

  try {
    await item.save();
    alert("Produk telah berhasil dimasukkan ke dalam paket");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const updateWarehousePackageProductEntry = async (
  objectId,
  warehousePackage,
  warehouseProductId,
  quantity,
  notes
) => {
  let item = new Parse.Object("warehouse_package_products");
  item.set("objectId", objectId);
  item.set("warehouseProduct", {
    __type: "Pointer",
    className: "warehouse_products",
    objectId: warehouseProductId,
  });
  item.set("warehousePackage", {
    __type: "Pointer",
    className: "warehouse_packages",
    objectId: warehousePackage?.objectId,
  });
  item.set("category", parseInt(warehousePackage?.category));
  item.set("quantity", parseInt(quantity));
  if (notes) {
    item.set("notes", notes);
  }

  item.set("isPartOfUnitFullSetPackage", warehousePackage?.isUnitFullSetPackage || warehousePackage?.isPartOfUnitFullSetPackage);
  item.set("isPartOfUnitPartialSetPackage", warehousePackage?.isUnitPartialSetPackage || warehousePackage?.isPartOfUnitPartialSetPackage);
  try {
    await item.save();
    alert("Produk dalam paket berhasil diedit");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const deleteWarehousePackageProductEntry = async (objectId) => {
  let item = new Parse.Object("warehouse_package_products");
  item.set("objectId", objectId);
  try {
    await item.destroy();
    alert("Produk telah dikeluarkan dari paket");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};


