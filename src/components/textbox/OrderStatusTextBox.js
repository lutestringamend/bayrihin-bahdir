import React from "react";
import {
  DeliveryOrderStatusOrder,
  ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
  ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
  ORDER_TYPE_REQUEST_ORDER,
} from "../../constants/order";

const OrderStatusTextBox = (props) => {
  const { type, approvalDate, approverUser, editorUser, status } = props;
  return (
    <div
      className={
        type === ORDER_TYPE_REQUEST_ORDER ||
        type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
        type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
          ? approvalDate && approverUser
            ? "text-success-highlight" : (type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
              type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT) && editorUser ? "text-yellow-highlight"
            : "text-danger-highlight"
          : "text-info-highlight"
      }
    >
      {type === ORDER_TYPE_REQUEST_ORDER ||
      type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
      type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
        ? approvalDate && approverUser ? "Disetujui" : (type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT ||
          type === ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT) && editorUser ? "Sudah Diedit"
          : "Belum Ditinjau"
        : status ? DeliveryOrderStatusOrder.find(({ name }) => name === status) ?  DeliveryOrderStatusOrder.find(({ name }) => name === status)?.caption : "Aktif" : "Aktif"}
    </div>
  );
};

export default OrderStatusTextBox;
