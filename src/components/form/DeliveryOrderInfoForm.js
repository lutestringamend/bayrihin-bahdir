import React from "react";

import { DELIVERY_ORDER_READ_PARENT } from "../../constants/order";
import { convertDateISOStringtoDisplayDateTime } from "../../utils";

const DeliveryOrderInfoForm = (props) => {
  const { data } = props;
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">
          Detil Delivery Order
        </h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table
            className="table table-bordered"
            id="dataTable"
            width="100%"
            cellSpacing="0"
          >
            <tbody>
              <tr>
                <td width="20%">
                  <b>Delivery Order No</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.deliveryOrderNumber
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Nama Dokter</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.doctor
                        ? data?.deliveryOrder?.doctor?.name
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Region</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.warehouseStorage
                        ? data?.deliveryOrder?.warehouseStorage?.name
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Rumah Sakit</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.hospital
                        ? data?.deliveryOrder?.hospital?.name
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Prosedur</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.procedure
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tanggal Dibuat</b>
                </td>
                <td>
                  <div>
                    {data?.createdAt
                      ? convertDateISOStringtoDisplayDateTime(data?.createdAt, true, true)
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tanggal Prosedur</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.surgeryDate
                        ? convertDateISOStringtoDisplayDateTime(
                            data?.deliveryOrder?.surgeryDate, true, true
                          )
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tanggal Delivery</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.deliveryDate
                        ? convertDateISOStringtoDisplayDateTime(
                            data?.deliveryOrder?.deliveryDate, true, true
                          )
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Technical Support PIC</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.tsPICUser
                        ? data?.deliveryOrder?.tsPICUser?.fullName
                          ? data?.deliveryOrder?.tsPICUser?.fullName
                          : data?.deliveryOrder?.tsPICUser?.username
                            ? data?.deliveryOrder?.tsPICUser?.username
                            : DELIVERY_ORDER_READ_PARENT
                        : DELIVERY_ORDER_READ_PARENT
                      : DELIVERY_ORDER_READ_PARENT}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Catatan</b>
                </td>
                <td>
                  <div>
                    {data?.deliveryOrder
                      ? data?.deliveryOrder?.remark
                        ? data?.deliveryOrder?.remark
                        : ""
                      : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Terakhir Diedit Oleh</b>
                </td>
                <td>
                  <div>
                    {data?.editorUser
                      ? data?.editorUser?.fullName
                        ? data?.editorUser?.fullName
                        : data?.editorUser?.username
                          ? data?.editorUser?.username
                          : ""
                      : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Terakhir Diedit</b>
                </td>
                <td>
                  <div>
                    {data?.updatedAt
                      ? convertDateISOStringtoDisplayDateTime(data?.updatedAt, true, true)
                      : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Disetujui Oleh</b>
                </td>
                <td>
                  <div>
                    {data?.approverUser
                      ? data?.approverUser?.fullName
                        ? data?.approverUser?.fullName
                        : data?.approverUser?.username
                          ? data?.approverUser?.username
                          : ""
                      : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Disetujui Pada</b>
                </td>
                <td>
                  <div>
                    {data?.approvalDate
                      ? convertDateISOStringtoDisplayDateTime(data?.approvalDate, true, true)
                      : ""}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderInfoForm;
