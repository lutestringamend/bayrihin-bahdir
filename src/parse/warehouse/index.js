import Parse from "parse/dist/parse.min.js";
import { WarehouseMainStats } from "../../models/warehouse";
import { getWarehouseProductStoragesData } from "./product_storage";

/*var uArray = {
  __type: "Pointer",
  className: "_User",
  objectId: userId,
};*/

export const fetchWarehouseMainData = async () => {
  let stats = WarehouseMainStats;
  let productList = [];

  try {
    //productList = await getWarehouseProductStoragesData(null, null, null, 20);
    //let products = await getWarehouseProductData();
    productList = await getWarehouseProductData();
    stats["products"] = productList?.length;

    const resStorages = await getWarehouseStorageData();
    stats["storages"] = resStorages?.length;

    const resTypes = await getWarehouseTypeData();
    stats["types"] = resTypes?.length;
  } catch (error) {
    console.error(error);
  }
  return {
    productList,
    stats,
  };
};

export const getWarehouseProductData = async (limit, sortDescendingBy) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_products");
    query.limit(limit ? limit : 999999);
    query.descending(sortDescendingBy ? sortDescendingBy : "updatedAt");
    query.include("warehouseType");
    const resProducts = await query.find();
    for (let r of resProducts) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehouseProductMutationsData = async (warehouseProductId, warehouseProductLotId, warehouseStorageId) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_product_mutations");
    query.limit(999999);
    query.descending("createdAt");
    query.include("warehouseStorage");
    query.include("warehouseProductLot");

    if (warehouseProductId) {
      query.equalTo("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    }
    if (warehouseProductLotId) {
      query.equalTo("warehouseProductLot", {
        __type: "Pointer",
        className: "warehouse_product_lots",
        objectId: warehouseProductLotId,
      });
    }
    if (warehouseStorageId) {
      query.equalTo("warehouseStorage", {
        __type: "Pointer",
        className: "warehouse_storages",
        objectId: warehouseStorageId,
      });
    }

    const res = await query.find();
    for (let r of res) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  console.log("mutation list", warehouseProductId, warehouseProductLotId, result);
  return result;
};

export const getWarehouseProductLotsData = async (warehouseProductId) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_product_lots");
    query.limit(999999);
    query.descending("createdAt");
    if (warehouseProductId) {
      query.equalTo("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    }
    const res = await query.find();
    for (let r of res) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehouseTypeData = async () => {
  let result = [];
  try {
    const queryType = new Parse.Query("warehouse_types");
    queryType.ascending("createdAt");
    const resTypes = await queryType.find();
    for (let r of resTypes) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehouseStorageData = async () => {
  let result = [];
  try {
    const queryStorage = new Parse.Query("warehouse_storages");
    queryStorage.ascending("createdAt");
    const resStorages = await queryStorage.find();
    for (let r of resStorages) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};
