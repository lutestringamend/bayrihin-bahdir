import Parse from "parse/dist/parse.min.js";

export const createWarehouseProductMutationEntry = async (
  warehouseProductId,
  warehouseStorageId,
  type,
  value,
) => {
  try {
    const query = new Parse.Query("warehouse_product_mutations");
    query.descending("createdAt");
    query.equalTo("warehouseProduct", {
      __type: "Pointer",
      className: "warehouse_products",
      objectId: warehouseProductId,
    });
    const res = await query.first();
    if (!res) return false;
    let nowBalance = res.get("balance") + value;

    let item = new Parse.Object("warehouse_product_mutations");
    item.set("warehouseProduct", {
      __type: "Pointer",
      className: "warehouse_products",
      objectId: warehouseProductId,
    });
    item.set("warehouseStorage", {
      __type: "Pointer",
      className: "warehouse_storages",
      objectId: warehouseStorageId,
    });
    item.set("type", type);
    item.set("value", value);
    item.set("balance", nowBalance);
    await item.save();

    let product = new Parse.Object("warehouse_products");
    product.set("objectId", warehouseProductId);
    product.set("balance", nowBalance);
    await product.save();

    alert("Mutasi baru berhasil dibuat");

    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

/*export const updateWarehouseProductMutationEntry = async (objectId, name) => {
    let item = new Parse.Object("warehouse_product_mutations");
    item.set("objectId", objectId);
    item.set("name", name);
    try {
        await item.save();
        alert('Tipe berhasil diedit');
        return true;
    } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      };
  };

  export const deleteWarehouseProductMutationEntry = async (objectId) => {
    let item = new Parse.Object("warehouse_product_mutations");
    item.set("objectId", objectId);
    try {
        await item.destroy();
        alert('Tipe telah dihapus');
        return true;
    } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      };
  };*/
