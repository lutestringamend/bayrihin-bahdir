import Parse from "parse/dist/parse.min.js";
import { WarehouseMainStats } from "../../models/warehouse";
import { WarehouseMainTabs } from "../../constants/warehouse";

export const fetchWarehouseMainData = async (category) => {
  let stats = WarehouseMainStats;
  let productList = [];

  try {
    const query = new Parse.Query("warehouse_product_storages");
    query.limit(999999);
    if (category === WarehouseMainTabs[1].category) {
      query.notEqualTo("category", 1);
    } else {
      query.equalTo("category", 1);
    }
    query.include("warehouseProduct");
    query.include("warehouseProductLot");
    query.descending("updatedAt");
    const res = await query.find();
    for (let r of res) {
      let item = r.toJSON();
      productList.push(item);
    }

    let products = await getWarehouseProductData();
    //productList = await getWarehouseProductData();
    stats["products"] = products?.length;

    const resStorages = await getWarehouseStorageData();
    stats["storages"] = resStorages?.length;

    const resPackages = await getWarehousePackageData();
    stats["packages"] = resPackages?.length;

    /*const resTypes = await getWarehouseTypeData();
    stats["types"] = resTypes?.length;*/
  } catch (error) {
    console.error(error);
  }
  return {
    productList,
    stats,
  };
};

export const getWarehouseProductData = async (
  limit,
  sortDescendingBy,
  category,
  sortAscendingBy,
) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_products");
    query.limit(limit ? limit : 999999);
    if (sortAscendingBy) {
      query.ascending(sortAscendingBy);
    } else {
      query.descending(sortDescendingBy ? sortDescendingBy : "updatedAt");
    }
    if (category) {
      query.equalTo("category", parseInt(category));
    }
    query.exclude("warehouseType");
    const resProducts = await query.find();
    for (let r of resProducts) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehouseProductMutationsData = async (
  warehouseProductId,
  warehouseProductLotId,
  warehouseStorageId,
) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_product_mutations");
    query.limit(999999);
    query.descending("createdAt");
    query.include("warehouseStorage");
    query.include("warehouseProductLot");
    query.include("document");

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
  console.log(
    "mutation list",
    warehouseProductId,
    warehouseProductLotId,
    result,
  );
  return result;
};

export const getWarehouseProductLotsData = async (warehouseProductId, warehouseInstrumentTrayId) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_product_lots");
    query.limit(999999);
    query.ascending("createdAt");
    query.include("warehouseInstrumentTray");
    if (warehouseProductId) {
      query.equalTo("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    }
    if (warehouseInstrumentTrayId) {
      query.equalTo("warehouseInstrumentTray", {
        __type: "Pointer",
        className: "warehouse_instrument_trays",
        objectId: warehouseInstrumentTrayId,
      });
      query.descending("createdAt");
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

export const getWarehousePackageData = async (category, objectId) => {
  let result = [];
  try {
    const queryType = new Parse.Query("warehouse_packages");
    queryType.limit(99);
    queryType.ascending("createdAt");
    if (parseInt(category) > 0) {
      queryType.equalTo("category", parseInt(category));
    }
    if (objectId) {
      queryType.equalTo("objectId", objectId);
    }

    let res = null;
    if (objectId) {
      res = await queryType.first();
      return res.toJSON();
    } else {
      res = await queryType.find();
      for (let r of res) {
        result.push(r.toJSON());
      }
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getWarehousePackageProductData = async (
  warehousePackageId,
  category,
) => {
  let result = [];
  try {
    const queryType = new Parse.Query("warehouse_package_products");
    queryType.limit(99999);
    queryType.include("warehouseProduct");
    queryType.ascending("createdAt");
    if (warehousePackageId) {
      queryType.equalTo("warehousePackage", {
        __type: "Pointer",
        className: "warehouse_packages",
        objectId: warehousePackageId,
      });
    }
    if (category) {
      queryType.equalTo("category", parseInt(category));
    }

    const resTypes = await queryType.find();
    for (let r of resTypes) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  //console.log("getWarehousePackageProductData", result);
  return result;
};

export const getWarehouseTypeData = async (category) => {
  let result = [];
  try {
    const queryType = new Parse.Query("warehouse_types");
    queryType.ascending("name");
    if (parseInt(category) > 0) {
      queryType.equalTo("category", parseInt(category));
    }
    queryType.limit(99);
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
    queryStorage.limit(99);
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
