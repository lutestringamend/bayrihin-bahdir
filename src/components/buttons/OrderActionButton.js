import React from "react";
import { Link } from "react-router-dom";
import {
  ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
  ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
  ORDER_TYPE_REQUEST_ORDER,
} from "../../constants/order";

const OrderActionButton = (props) => {
  const { type, objectId, approvalDate, approverUser } = props;
  return (
    <Link
      to={`/order/${
        type === ORDER_TYPE_REQUEST_ORDER
          ? "request-order"
          : type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT
            ? "delivery-order-implant"
            : type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
              ? "delivery-order-instrument"
              : "delivery-order"
      }/${objectId}`}
      className={`btn ${
        type === ORDER_TYPE_REQUEST_ORDER ||
        type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
        type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
          ? approvalDate && approverUser
            ? "btn-secondary"
            : "btn-primary"
          : "btn-primary"
      } btn-sm`}
    >
      {approvalDate ? "Detil" : "Tinjau"}
    </Link>
  );
};

export default OrderActionButton;
