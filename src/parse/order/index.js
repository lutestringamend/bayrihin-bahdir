import Parse from "parse/dist/parse.min.js";

export const getHospitalsData = async (warehouseStorageId) => {
    let result = [];
    try {
      const query = new Parse.Query("hospitals");
      query.limit(9999);
      query.ascending("code");
      query.include("warehouseStorage");
      if (warehouseStorageId) {
        query.equalTo("warehouseStorage", {
          __type: "Pointer",
          className: "warehouse_storages",
          objectId: warehouseStorageId,
        });
      }
      const resStorages = await query.find();
      for (let r of resStorages) {
        result.push(r.toJSON());
      }
      console.log("hospitals", result);
    } catch (e) {
      console.error(e);
    }
    return result;
  };