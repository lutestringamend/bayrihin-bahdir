import React from "react";

const TrackingOrderStatusTextBox = (props) => {
  const { approvalDate, approverUser, driverUser } = props;
  return (
    <div
      className={approvalDate && approverUser ? "text-success-highlight" : driverUser ? "text-info-highlight" : "text-danger-highlight"}
    >
      {
        approvalDate && approverUser ? "Aktif" : driverUser ? "Belum Disetujui" : "Belum Ada Driver"
      }
    </div>
  );
};

export default TrackingOrderStatusTextBox;
