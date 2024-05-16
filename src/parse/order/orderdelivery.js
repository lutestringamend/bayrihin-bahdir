import Parse from "parse/dist/parse.min.js";

const DeliveryOrder = Parse.Object.extend("delivery_orders");
const DeliveryOrderDelivery = Parse.Object.extend("delivery_order_delivery");

export const updateDeliveryOrderDelivery = async (objectId, approverUserId, driverUserId) => {
  if (objectId === undefined || objectId === null || driverUserId === undefined || driverUserId === null || approverUserId === undefined || approverUserId === null
  ) {
    return false;
  }
  try {
    const query = new Parse.Query(DeliveryOrderDelivery);
    query.limit(99999);
      query.descending("updatedAt");
      query.include("deliveryOrder");
      query.equalTo("objectId", objectId);
      let res = await query.first();
      if (res) {
        res.set("approvalDate", new Date().toISOString());
        res.set("approverUser", {
          __type: "Pointer",
          className: "_User",
          objectId: approverUserId,
        });
        res.set("driverUser", {
          __type: "Pointer",
          className: "_User",
          objectId: driverUserId,
        })

        let save = await res.save(null);
        if (!save) {
          return false;
        }

      return true;
      }
      

  } catch (e) {
    console.error(e);
  }
  return false;
}

export const getDeliveryOrderDeliveryData = async (objectId, deliveryOrderId, descendingBy) => {
    let result = null;
    try {
      const query = new Parse.Query(DeliveryOrderDelivery);
      query.limit(99999);
        query.descending(descendingBy ? descendingBy : "updatedAt");
        query.include("deliveryOrder");
        if (deliveryOrderId) {
            query.equalTo("deliveryOrder", {
                __type: "Pointer",
                className: "delivery_orders",
                objectId: deliveryOrderId,
              });
        }

        let res = null;
        if (objectId) {
            query.equalTo("objectId", objectId);
            res = await query.first();
            if (res) {
                result = res.toJSON();
            }
        } else {
            result = [];
            res = await query.find();
            for (let r of res) {
                result.push(r.toJSON());
            }
        }
    } catch (e) {
      console.error(e);
    }
    return result;
  };