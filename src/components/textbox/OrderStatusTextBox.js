import React from "react";
import {
  ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
  ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
  ORDER_TYPE_REQUEST_ORDER,
} from "../../constants/order";

const OrderStatusTextBox = (props) => {
  const { type, approvalDate, approverUser } = props;
  return (
    <div
      className={
        type === ORDER_TYPE_REQUEST_ORDER ||
        type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
        type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
          ? approvalDate && approverUser
            ? "text-success-highlight"
            : "text-danger-highlight"
          : "text-info-highlight"
      }
    >
      {type === ORDER_TYPE_REQUEST_ORDER ||
      type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
      type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
        ? approvalDate && approverUser
          ? "Disetujui"
          : "Belum Ditinjau"
        : "Aktif"}
    </div>
  );
};

export default OrderStatusTextBox;
