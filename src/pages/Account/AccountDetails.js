import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { overhaulReduxUserCurrent } from "../../utils/user";
import { UserDataModel } from "../../models/user";
import { BIRTHDATE_PICKER_FORMAT } from "../../constants/strings";
import { getUserById } from "../../parse/user";
import { USER_GENDERS, USER_ROLES } from "../../constants/user";
import { faCancel } from "@fortawesome/free-solid-svg-icons";

function AccountDetails(props) {
  const { currentUser } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(UserDataModel);
  const [errors, setErrors] = useState(UserDataModel);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    let result = await getUserById(currentUser?.objectId);
    if (result) {
      props.overhaulReduxUserCurrent(result);
      setData(result);
    } else {
      setError("Tidak bisa mendapatkan data akun ini");
    }
    setLoading(false);
  };

  const submit = async () => {
    /*let newErrors = RequestOrderModel;
    let isComplete = true;
    let processedJSON = processRequestOrderInventory(newOrder);
    //console.log("processedJSON", processedJSON);

    if (processedJSON?.count < 1) {
      newErrors = { ...newErrors, inventoryJSON: "Inventory masih kosong" };
      isComplete = false;
    }
    if (
      newRequestOrder?.deliveryOrderNumber === "" ||
      newRequestOrder?.deliveryOrderNumber?.length < 3
    ) {
      newErrors = {
        ...newErrors,
        deliveryOrderNumber: "Delivery Order No harus diisi",
      };
      isComplete = false;
    }
    if (
      newRequestOrder?.doctorId === null ||
      newRequestOrder?.doctorId === ""
    ) {
      newErrors = { ...newErrors, doctorId: "Dokter harus diisi" };
      isComplete = false;
    }
    if (
      newRequestOrder?.warehouseStorageId === null ||
      newRequestOrder?.warehouseStorageId === ""
    ) {
      newErrors = { ...newErrors, warehouseStorageId: "Region harus diisi" };
      isComplete = false;
    }
    if (
      newRequestOrder?.hospitalId === null ||
      newRequestOrder?.hospitalId === ""
    ) {
      newErrors = { ...newErrors, hospitalId: "Rumah Sakit harus diisi" };
      isComplete = false;
    }
    if (
      newRequestOrder?.procedure === "" ||
      newRequestOrder?.procedure?.length < 3
    ) {
      newErrors = { ...newErrors, procedure: "Prosedur harus diisi" };
      isComplete = false;
    }
    if (
      newRequestOrder?.surgeryDate === null ||
      newRequestOrder?.surgeryDate === ""
    ) {
      newErrors = { ...newErrors, surgeryDate: "Tanggal Prosedur harus diisi" };
      isComplete = false;
    }
    setErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        "Pastikan semua data sudah terisi dengan benar. Aksi ini akan membuat Request Order baru.",
      );
      if (!confirm) {
        return;
      }
      setSubmitting(true);
      const result = await createUpdateRequestOrderEntry(
        null,
        newRequestOrder?.deliveryOrderNumber,
        newRequestOrder?.doctorId,
        newRequestOrder?.hospitalId,
        newRequestOrder?.warehouseStorageId,
        newRequestOrder?.procedure,
        newRequestOrder?.surgeryDate,
        processedJSON?.inventoryJSON,
      );
      if (result) {
        props.updateReduxNewRequestOrder({
          ...RequestOrderModel,
          deliveryOrderNumber: formatDeliveryOrderNumber(),
        });
        props.overhaulReduxNewOrder(null);
        navigate("/order/request-orders/pending");
      }
      setSubmitting(false);
    }*/
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Edit Profil</h1>
        {data?.objectId ? (
          submitting ? (
            <FadeLoader
              color="#4e73df"
              loading
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <div className="d-sm-flex align-items-center">
              <button
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                onClick={() => submit()}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Submit
              </button>

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
            </div>
          )
        ) : null}
      </div>

      {error ? (
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <span style={{ color: "red" }}>{error}</span>
        </div>
      ) : null}

      {data?.objectId ? (
        <>
          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Role</b>
            </label>
            <input
              name="accountRoleName"
              value={
                USER_ROLES.find(({ name }) => name === data?.accountRole?.name)
                  ?.caption
              }
              disabled
              type={"text"}
              className="form-control"
            />
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Username</b>
            </label>
            <input
              name="username"
              value={data?.username}
              onChange={(e) =>
                setData({
                  ...data,
                  username: e.target.value,
                })
              }
              type={"text"}
              className={`form-control ${
                errors?.username ? "is-invalid" : ""
              } `}
            />
            <span style={{ color: "red" }}>{errors?.username}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Email</b>
            </label>
            <input
              name="email"
              value={data?.email}
              onChange={(e) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
              type={"text"}
              className={`form-control ${errors?.email ? "is-invalid" : ""} `}
            />
            <span style={{ color: "red" }}>{errors?.email}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Nomor Telepon</b>
            </label>
            <input
              name="phoneNumber"
              value={data?.phoneNumber}
              onChange={(e) =>
                setData({
                  ...data,
                  phoneNumber: e.target.value,
                })
              }
              type={"text"}
              className={`form-control ${
                errors?.phoneNumber ? "is-invalid" : ""
              } `}
            />
            <span style={{ color: "red" }}>{errors?.phoneNumber}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Nama Lengkap</b>
            </label>
            <input
              name="fullName"
              value={data?.fullName}
              onChange={(e) =>
                setData({
                  ...data,
                  fullName: e.target.value,
                })
              }
              type={"text"}
              className={`form-control ${
                errors?.fullName ? "is-invalid" : ""
              } `}
            />
            <span style={{ color: "red" }}>{errors?.fullName}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Jenis Kelamin</b>
            </label>
            <select
              name="gender"
              value={data?.gender ? data?.gender : ""}
              onChange={(e) =>
                setData({
                  ...data,
                  gender: e.target.value,
                })
              }
              className={`form-control ${errors.gender ? "is-invalid" : ""} `}
            >
              <option value="">----Pilih Jenis Kelamin----</option>
              {USER_GENDERS?.length === undefined || USER_GENDERS?.length < 1
                ? null
                : USER_GENDERS.map((item, index) => (
                    <option key={index} value={item?.name}>
                      {item?.caption}
                    </option>
                  ))}
            </select>
            <span style={{ color: "red" }}>{errors?.gender}</span>
          </div>

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Tanggal Lahir</b>
            </label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DateTimePicker
                format={BIRTHDATE_PICKER_FORMAT}
                views={["year", "month", "day"]}
                onChange={(e) =>
                  setData({
                    ...data,
                    birthdate: e.toISOString(),
                  })
                }
                value={data?.birthdate ? dayjs(data?.birthdate) : null}
                className={`w-100 ${errors?.birthdate ? "is-invalid" : ""} `}
              />
            </LocalizationProvider>
            <span style={{ color: "red" }}>{errors?.birthdate}</span>
            <p />
          </div>
        </>
      ) : (
        <FadeLoader
          color="#4e73df"
          loading
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxUserCurrent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(AccountDetails);
