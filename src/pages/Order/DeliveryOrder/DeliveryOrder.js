import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseStorageData } from "../../../parse/warehouse";
import {
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../../utils/order";
import { getDoctorsData, getHospitalsData } from "../../../parse/order";
import { DATE_TIME_PICKER_FORMAT } from "../../../constants/strings";
import SearchTextInput from "../../../components/textinput/SearchTextInput";
import { hasPrivilege } from "../../../utils/account";
import {
  ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC,
  ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT,
} from "../../../constants/account";
import { faCancel, faEdit } from "@fortawesome/free-solid-svg-icons";
import { getUserData } from "../../../parse/user";
import { USER_ROLE_TECHNICAL_SUPPORT } from "../../../constants/user";
import {
  createUpdateDeliveryOrderEntry,
  getDeliveryOrderById,
} from "../../../parse/order/deliveryorders";
import { DeliveryOrderModel } from "../../../models/deliveryorder";
import {
  ORDER_TYPE_DELIVERY_ORDER,
  ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
  ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
} from "../../../constants/order";
import OrderStatusTextBox from "../../../components/textbox/OrderStatusTextBox";
import OrderActionButton from "../../../components/buttons/OrderActionButton";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function DeliveryOrder(props) {
  const { currentUser, privileges, doctors, hospitals, warehouseStorages } =
    props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(DeliveryOrderModel);

  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (warehouseStorages === null) {
      fetchWarehouseStorages();
    }
  }, [warehouseStorages]);

  useEffect(() => {
    if (doctors === null) {
      fetchDoctors();
    }
  }, [doctors]);

  useEffect(() => {
    if (hospitals === null) {
      fetchHospitals();
    }
  }, [hospitals]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const fetchDoctors = async () => {
    const result = await getDoctorsData();
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderDoctors(result);
    }
  };

  const fetchWarehouseStorages = async () => {
    const result = await getWarehouseStorageData();
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderWarehouseStorages(result);
    }
  };

  const fetchHospitals = async (warehouseStorageId) => {
    const result = await getHospitalsData(
      warehouseStorageId ? warehouseStorageId : null,
    );
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderHospitals(result);
    }
  };

  const fetchTSData = async () => {
    const result = await getUserData(USER_ROLE_TECHNICAL_SUPPORT);
    if (!(result === undefined || result?.length === undefined)) {
      setUsers(result);
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const result = await getDeliveryOrderById(params?.id, true);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Delivery Order");
    } else {
      if (hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT)) {
        fetchTSData();
      }
      setData(result);
    }
    setLoading(false);
  };

  const setNewPIC = (e) => {
    try {
      const tsPICUser = users.find(({ objectId }) => objectId === e);
      if (tsPICUser) {
        setData({ ...data, tsPICUser });
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const submit = async () => {
    if (submitting) {
      return;
    }
    let newErrors = DeliveryOrderModel;
    let isComplete = true;

    if (data?.procedure === null || data?.procedure === "") {
      newErrors = { ...newErrors, procedure: "Prosedur wajib diisi" };
      isComplete = false;
    }
    if (data?.surgeryDate === null || data?.surgeryDate === "") {
      newErrors = { ...newErrors, surgeryDate: "Tanggal Prosedur wajib diisi" };
      isComplete = false;
    }
    if (data?.deliveryDate === null || data?.deliveryDate === "") {
      newErrors = {
        ...newErrors,
        deliveryDate: "Tanggal Delivery wajib diisi",
      };
      isComplete = false;
    }
    if (
      data?.tsPICUserId === undefined ||
      data?.tsPICUserId === null ||
      data?.tsPICUserId === ""
    ) {
      newErrors = {
        ...newErrors,
        tsPICUserId: "Technical Support PIC wajib diisi",
      };
      isComplete = false;
    }
    setErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        "Pastikan semua data sudah terisi dengan benar. Aksi ini akan mengedit isi Delivery Order ini.",
      );
      if (!confirm) {
        return;
      }
      setSubmitting(true);
      try {
        const result = await createUpdateDeliveryOrderEntry(
          data?.objectId,
          null,
          null,
          null,
          null,
          null,
          null,
          data?.procedure,
          data?.surgeryDate,
          data?.deliveryDate,
          data?.remark,
          null,
          null,
          null,
          data?.tsPICUserId,
        );
        if (result) {
          setSubmitting(false);
          navigate("/order");
          return;
        }
      } catch (e) {
        console.error(e);
        setError(e.toString());
      }
      setSubmitting(false);
    }
  };

  const OrderTableRow = ({
    createdAt,
    type,
    approvalDate,
    approverUser,
    editorUser,
    objectId,
  }) => {
    return (
      <tr>
        <td>
          <div
            className={
              type === ORDER_TYPE_DELIVERY_ORDER_IMPLANT
                ? "text-yellow-highlight"
                : "text-info-highlight"
            }
          >
            {type}
          </div>
        </td>
        <td>{data?.deliveryOrderNumber}</td>
        <td>{createdAt ? new Date(createdAt).toLocaleString("id-ID") : ""}</td>

        <td>
          <OrderStatusTextBox
            {...props}
            approvalDate={approvalDate}
            approverUser={approverUser}
            editorUser={editorUser}
            type={type}
          />
        </td>
        <td>
          <OrderActionButton
            {...props}
            approvalDate={approvalDate}
            approverUser={approverUser}
            objectId={objectId}
            type={type}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Detail Delivery Order</h1>
        {submitting ? (
          <FadeLoader
            color="#4e73df"
            loading={submitting}
            size={16}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT) ? (
          <div className="d-sm-flex align-items-center">
            {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC) ? (
              <button
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                onClick={() => submit()}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Edit Delivery Order
              </button>
            ) : null}

            <button
              className="d-none d-sm-inline-block btn btn-sm btn-secondary shadow-sm mx-3"
              onClick={() => fetchData()}
            >
              <FontAwesomeIcon
                icon={faCancel}
                style={{ marginRight: "0.25rem", color: "white" }}
              />
              Reset
            </button>

            {data?.requestOrder ? (
              <Link
                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm mx-3"
                to={`/order/request-order/${data?.requestOrder?.objectId}`}
              >
                Lihat Request Order
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <span style={{ color: "red" }}>{error}</span>
        </div>
      ) : null}

      {loading || data === null ? (
        <FadeLoader
          color="#4e73df"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Delivery Order No</b>
            </label>
            <input
              name="deliveryOrderNumber"
              value={data?.deliveryOrderNumber}
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Nama Dokter</b>
            </label>
            <input
              name="doctor"
              value={data?.doctor ? data?.doctor?.name : ""}
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Region</b>
            </label>
            <input
              name="warehouseStorage"
              value={data?.warehouseStorage ? data?.warehouseStorage?.name : ""}
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Rumah Sakit</b>
            </label>
            <input
              name="hospital"
              value={data?.hospital ? data?.hospital?.name : ""}
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Prosedur</b>
            </label>
            <input
              name="procedure"
              value={data?.procedure}
              disabled={
                !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT)
              }
              onChange={(e) =>
                setData({
                  ...data,
                  procedure: e.target.value,
                })
              }
              type={"text"}
              className={`form-control ${
                errors?.procedure ? "is-invalid" : ""
              } `}
            />
            <span style={{ color: "red" }}>{errors?.procedure}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Tanggal Dibuat</b>
            </label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DateTimePicker
                readOnly
                format={DATE_TIME_PICKER_FORMAT}
                views={["year", "month", "day", "hours", "minutes"]}
                defaultValue={data?.createdAt ? dayjs(data?.createdAt) : null}
                className="w-100"
              />
            </LocalizationProvider>
            <p />
          </div>
          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Tanggal Prosedur</b>
            </label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DateTimePicker
                readOnly={
                  !hasPrivilege(
                    privileges,
                    ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT,
                  )
                }
                format={DATE_TIME_PICKER_FORMAT}
                views={["year", "month", "day", "hours", "minutes"]}
                onChange={(e) =>
                  setData({
                    ...data,
                    surgeryDate: e.toISOString(),
                  })
                }
                value={data?.surgeryDate ? dayjs(data?.surgeryDate) : null}
                className={`w-100 ${errors?.surgeryDate ? "is-invalid" : ""} `}
              />
            </LocalizationProvider>
            <span style={{ color: "red" }}>{errors?.surgeryDate}</span>
            <p />
          </div>
          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Tanggal Delivery</b>
            </label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DateTimePicker
                readOnly={
                  !hasPrivilege(
                    privileges,
                    ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT,
                  )
                }
                format={DATE_TIME_PICKER_FORMAT}
                views={["year", "month", "day", "hours", "minutes"]}
                onChange={(e) =>
                  setData({
                    ...data,
                    deliveryDate: e.toISOString(),
                  })
                }
                value={data?.deliveryDate ? dayjs(data?.deliveryDate) : null}
                className={`w-100 ${errors?.deliveryDate ? "is-invalid" : ""} `}
              />
            </LocalizationProvider>
            <span style={{ color: "red" }}>{errors?.deliveryDate}</span>
            <p />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Disetujui Oleh</b>
            </label>
            <input
              name="approverUser"
              value={
                data?.approverUser
                  ? data?.approverUser?.fullName
                    ? data?.approverUser?.fullName
                    : data?.approverUser?.username
                  : ""
              }
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <SearchTextInput
            label="Technical Support PIC"
            name="tsPICUserId"
            disabled={
              !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT)
            }
            value={data?.tsPICUser ? data?.tsPICUser?.objectId : ""}
            error={errors?.tsPICUser}
            defaultOption="----Pilih Technical Support----"
            data={users}
            searchPlaceholder="Cari nama Technical Support"
            onChange={(e) => setNewPIC(e.target.value)}
          />

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Catatan</b>
            </label>
            <textarea
              name="remark"
              disabled={
                !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT)
              }
              value={data?.remark ? data?.remark : ""}
              onChange={(e) => setData({ ...data, remark: e.target.value })}
              type="text"
              rows="3"
              className="form-control"
            />
            <span style={{ color: "red" }}>{errors?.remark}</span>
          </div>

          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Delivery Order berdasarkan jenis inventaris
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
                  <thead>
                    <tr>
                      <th>Jenis</th>
                      <th>DO No</th>
                      <th>Tanggal Dibuat</th>
                      <th>Status</th>
                      <th width="15%">Aksi</th>
                    </tr>
                  </thead>

                  <tfoot>
                    <tr>
                      <th>Jenis</th>
                      <th>DO No</th>
                      <th>Tanggal Dibuat</th>
                      <th>Status</th>
                      <th width="15%">Aksi</th>
                    </tr>
                  </tfoot>

                  <tbody>
                    {data?.children === undefined ||
                    data?.children?.length === undefined ||
                    data?.children?.length < 1
                      ? null
                      : data?.children.map((p, index) => (
                          <OrderTableRow key={index} {...p} />
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  privileges: store.userState.privileges,
  doctors: store.orderState.doctors,
  hospitals: store.orderState.hospitals,
  warehouseStorages: store.orderState.warehouseStorages,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderDoctors,
      overhaulReduxOrderHospitals,
      overhaulReduxOrderWarehouseStorages,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(DeliveryOrder);
