import Parse from "parse/dist/parse.min.js";

export const fetchOrdersData = async (limit, deliveryOrderStatus) => {
  let requestOrders = [];
  let deliveryOrders = [];
  try {
    let result = await getRequestOrdersData(true, limit);
    if (!(result === undefined || result?.length === undefined)) {
      requestOrders = result;
    }
    deliveryOrders = await getDeliveryOrdersData(limit, deliveryOrderStatus);
  } catch (e) {
    console.error(e);
  }
  return {
    requestOrders,
    deliveryOrders,
  }
}

export const getRequestOrdersData = async (isActive, limit) => {
  let result = [];
  try {
    const query = new Parse.Query("request_orders");
    query.limit(limit ? limit : 99999);
    query.ascending("createdAt");
    query.include("warehouseStorage");
    query.include("hospital");
    query.include("doctor");
    if (isActive === undefined || isActive === null) {
      query.equalTo("isActive", true);
    } else {
      query.equalTo("isActive", isActive);
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

export const getDeliveryOrdersData = async (limit, status) => {
  let result = [];
  try {
    const query = new Parse.Query("delivery_orders");
    query.limit(limit ? limit : 99999);
    query.ascending("createdAt");
    query.include("approverUser");
    query.include("tsPICUser");
    query.include("warehouseStorage");
    query.include("hospital");
    query.include("doctor");
    if (status) {
      query.equalTo("status", status);
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

export const getDoctorsData = async (params) => {
  let result = [];
  try {
    const query = new Parse.Query("doctors");
    query.limit(9999);
    query.ascending("name");
    if (params === undefined || params === null || params === "") {
      query.equalTo("isActive", true);
    } else if (params === "inactive") {
      query.equalTo("isActive", false);
    }
  
    const res = await query.find();
    for (let r of res) {
      result.push(r.toJSON());
    }
    console.log("doctors", result?.length);
  } catch (e) {
    console.error(e);
  }
  return result;
};

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
      //console.log("hospitals", result);
    } catch (e) {
      console.error(e);
    }
    return result;
  };