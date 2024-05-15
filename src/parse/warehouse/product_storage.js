import Parse from "parse/dist/parse.min.js";

export const getWarehouseProductStorageForDeliveryOrder = async (
  warehouseProductId,
  warehouseStorageId,
) => {
  let results = [];
  try {
    const query = new Parse.Query("warehouse_product_storages");
    query.limit(999999);
    query.include("warehouseProduct");
    query.include("warehouseProductLot");
    query.descending("updatedAt");
    if (warehouseProductId) {
      query.equalTo("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
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
      results.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  console.log("getWarehouseProductStorageForDeliveryOrder", warehouseProductId, warehouseStorageId, results?.length);
  return results;
};

export const getWarehouseProductStoragesData = async (
  warehouseProductId,
  warehouseStorageId,
  warehouseProductLotId,
  limit,
  descendingBy,
  isIndex,
) => {
  let result = [];
  try {
    const query = new Parse.Query("warehouse_product_storages");
    query.limit(limit ? limit : 999999);
    if (isIndex) {
      query.exclude("warehouseStorage");
    } else if (limit) {
      query.include("warehouseProduct");
      query.include("warehouseProductLot");
    } else {
      query.include("warehouseStorage");
    }
    query.descending(descendingBy ? descendingBy : "createdAt");
    if (warehouseProductId) {
      query.equalTo("warehouseProduct", {
        __type: "Pointer",
        className: "warehouse_products",
        objectId: warehouseProductId,
      });
    }
    if (warehouseStorageId) {
      query.equalTo("warehouseStorage", {
        __type: "Pointer",
        className: "warehouse_storages",
        objectId: warehouseStorageId,
      });
    }
    if (warehouseProductLotId) {
      query.equalTo("warehouseProductLot", {
        __type: "Pointer",
        className: "warehouse_product_lots",
        objectId: warehouseProductLotId,
      });
    }

    const res = await query.find();
    for (let r of res) {
      let item = r.toJSON();
      if (isIndex) {
        /*const lQuery = new Parse.Query("warehouse_product_lots");
          lQuery.equalTo("objectId", item?.warehouseProductLot?.objectId);
          const lot = await lQuery.first();
          console.log("lQuery", item?.warehouseProductLot?.objectId, lot);
          if (lot) {
            let lotJSON = lot.toJSON();
            item = {
              ...item,
              warehouseProductLot: {
                ...item?.warehouseProductLot,
                ...lotJSON,
              }
            }
          }*/
        result.push(item);
      } else {
        const found = result.find(
          ({ warehouseStorage }) =>
            warehouseStorage?.objectId === item?.warehouseStorage?.objectId,
        );
        if (found === undefined || found === null) {
          result.push({
            warehouseStorage: item?.warehouseStorage,
            balanceStock: item.balanceStock,
            balanceOnDelivery: item.balanceOnDelivery,
            balancePending: item.balancePending,
            balanceService: item.balanceService,
            balanceMarketing: item.balanceMarketing,
            balanceBroken: item.balanceBroken,
            balanceTotal: item.balanceTotal,
            productLots: [item?.warehouseProductLot],
          });
        } else {
          let productLots = found?.productLots;
          productLots.push(item?.warehouseProductLot);
          let newResult = [];
          for (let n of result) {
            if (
              n?.warehouseStorage?.objectId ===
              found?.warehouseStorage?.objectId
            ) {
              newResult.push({
                warehouseStorage: item?.warehouseStorage,
                balanceStock: found.balanceStock + item.balanceStock,
                balanceOnDelivery:
                  found.balanceOnDelivery + item.balanceOnDelivery,
                balancePending: found.balancePending + item.balancePending,
                balanceService: found.balanceService + item.balanceService,
                balanceMarketing:
                  found.balanceMarketing + item.balanceMarketing,
                balanceBroken: found.balanceBroken + item.balanceBroken,
                balanceTotal: found.balanceTotal + item.balanceTotal,
                productLots,
              });
            } else {
              newResult.push(n);
            }
          }
          result = newResult;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  //console.log("product storages", result);
  return result;
};
