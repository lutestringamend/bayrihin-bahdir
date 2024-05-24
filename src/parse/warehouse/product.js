import Parse from "parse/dist/parse.min.js";
import { WarehouseMainTabs } from "../../constants/warehouse";

export const searchWarehouseMainByName = async (name) => {
  let result = [];
  try {
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehouseProductByName = async (name, category) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_products");
    query.limit(999999);
    /*let arrayValues = [name, name.toLowerCase(), name.toUpperCase(), capitalizeFirstLetterOfEachWord(name)];
    console.log("arrayvalues", arrayValues);
    query.containedBy("name", arrayValues);*/
    query.ascending("name");
    if (category === WarehouseMainTabs[0].category) {
      query.equalTo("category", 1);
    } else if (category === WarehouseMainTabs[1].category) {
      query.notEqualTo("category", 1);
    }
    const res = await query.find();
    for (let r of res) {
      let obj = r.toJSON();
      if (
        obj?.catalogNo?.toLowerCase().includes(name?.toLowerCase()) ||
        obj?.name?.toLowerCase().includes(name?.toLowerCase()) ||
        obj?.brand?.toLowerCase().includes(name?.toLowerCase())
      ) {
        result.push(obj);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const searchWarehouseProductItem = async (category, searchKey) => {
  let result = [];
  try {
    console.log("searchWarehouseProductItem", category, searchKey);
    const query = new Parse.Query("warehouse_products");
    query.limit(999999);
    if (category && parseInt(category) === 1) {
      query.equalTo("category", parseInt(category));
    }
    query.contains("name", searchKey);
    const resProducts = await query.find();
    if (resProducts?.length === undefined || resProducts?.length < 1) {
      const queryCat = new Parse.Query("warehouse_products");
      queryCat.limit(999999);
      if (category && parseInt(category) === 1) {
        queryCat.equalTo("category", parseInt(category));
      }
      queryCat.contains("catalogNo", searchKey);
      const search = await queryCat.find();
      if (!(search?.length === undefined || search?.length < 1)) {
        for (let r of search) {
          let item = r.toJSON();
          result.push({
            objectId: item?.objectId,
            name: item?.name,
            catalogNo: item?.catalogNo,
          });
        }
      }
    } else {
      for (let r of resProducts) {
        let item = r.toJSON();
        result.push({
          objectId: item?.objectId,
          name: item?.name,
          catalogNo: item?.catalogNo,
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

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
  category,
  minimumStock,
  warehousePackageId,
) => {
  try {
    if (productId === null) {
      const query = new Parse.Query("warehouse_products");
      query.limit(999999);
      query.equalTo("catalogNo", catalogNo);
      const queriedProduct = await query.first();
      if (queriedProduct) {
        alert("Katalog No ini sudah ada!");
        return false;
      }
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
    if (warehousePackageId) {
      item.set("warehousePackage", {
        __type: "Pointer",
        className: "warehouse_packages",
        objectId: warehousePackageId,
      });
    }
    item.set("catalogNo", catalogNo);
    item.set("brand", brand ? brand : "");
    item.set("name", name);
    if (category) {
      item.set("category", parseInt(category));
    }
    if (subCategory) {
      item.set("subCategory", subCategory);
    }
    if (minimumStock) {
      item.set("minimumStock", parseInt(minimumStock));
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
