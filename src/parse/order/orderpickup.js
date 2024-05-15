import Parse from "parse/dist/parse.min.js";

const DeliveryOrder = Parse.Object.extend("delivery_orders");
const DeliveryOrderPickup = Parse.Object.extend("delivery_order_pickup");

export const getDeliveryOrderPickupData = async (objectId, deliveryOrderId, descendingBy) => {
    let result = null;
    try {
      const query = new Parse.Query(DeliveryOrderPickup);
      query.limit(99999);
        query.descending(descendingBy ? descendingBy : "updatedAt");
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