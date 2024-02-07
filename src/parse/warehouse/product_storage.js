import Parse from "parse/dist/parse.min.js";

export const getWarehouseProductStoragesData = async (warehouseProductId) => {
    let result = [];
    try {
      const query = new Parse.Query("warehouse_product_storages");
      query.limit(999999);
      query.include("warehouseStorage");
      query.include("warehouseProductLot");
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
        let item = r.toJSON();
        const found = result.find(({warehouseStorage}) => warehouseStorage?.objectId === item?.warehouseStorage?.objectId);
        if (found === undefined || found === null) {
            result.push({
                warehouseStorage: item?.warehouseStorage,
                balanceStock: item.balanceStock,
                balanceOnDelivery: item.balanceOnDelivery,
                balanceTotal: item.balanceTotal,
                productLots: [
                    item?.warehouseProductLot,
                ]
            });
        } else {
            let productLots = found?.productLots;
            productLots.push(item?.warehouseProductLot);
            let newResult = [];
            for (let n of result) {
                if (n?.warehouseStorage?.objectId === found?.warehouseStorage?.objectId) {
                    newResult.push({
                        warehouseStorage: item?.warehouseStorage,
                        balanceStock: found.balanceStock + item.balanceStock,
                        balanceOnDelivery: found.balanceOnDelivery + item.balanceOnDelivery,
                        balanceTotal: found.balanceTotal + item.balanceTotal,
                        productLots,
                    })
                } else {
                    newResult.push(n);
                }
            }
            result = newResult;
        }
      }
    } catch (e) {
      console.error(e);
    }
    //console.log("product storages", result);
    return result;
  };