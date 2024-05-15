import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehouseStorageData,
} from "../../../parse/warehouse";
import {
  deleteItemsFromRequestOrderPackage,
  overhaulReduxNewOrder,
  updateReduxNewRequestOrder,
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
  processRequestOrderInventory,
  formatDeliveryOrderNumber,
} from "../../../utils/order";
import RequestOrderTable from "../../../components/tables/RequestOrderTable";
import { RequestOrderModel } from "../../../models/requestorder";
import { getDoctorsData, getHospitalsData } from "../../../parse/order";
import { DATE_TIME_PICKER_FORMAT } from "../../../constants/strings";
import { createUpdateRequestOrderEntry } from "../../../parse/order/requestorders";
import SearchTextInput from "../../../components/textinput/SearchTextInput";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const DefaultPackages = {
  implants: [],
  instruments: [],
  units: [],
};

function CreateRequestOrder(props) {
  const {
    currentUser,
    newOrder,
    newRequestOrder,
    doctors,
    hospitals,
    warehouseStorages,
  } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(RequestOrderModel);

  useEffect(() => {
    prepareData();
  }, []);

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
    //console.log("redux newOrder", newOrder);
    if (newOrder !== null && loading) {
      setLoading(false);
    }
  }, [newOrder]);

  /*useEffect(() => {
    console.log("newRequestOrder", newRequestOrder);
  }, [newRequestOrder]);*/

  /*useEffect(() => {
    if (
      !(newRequestOrder?.warehouseStorageId === undefined ||
      newRequestOrder?.warehouseStorageId === null ||
      newRequestOrder?.warehouseStorageId === "")
    ) {
      props.updateReduxNewRequestOrder({
        ...newRequestOrder,
        hospitalId: null,
      });
    }
  }, [newRequestOrder?.warehouseStorageId]);*/

  let prepareData = () => {
    if (newOrder === null) {
      fetchData();
    }
  };

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
    const result = await getHospitalsData(warehouseStorageId);
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderHospitals(result);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const result = await getWarehousePackageData();
    let implants = [];
    let instruments = [];
    let units = [];
    for (let r of result) {
      if (r?.category === 1) {
        implants.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      } else if (r?.category === 2) {
        instruments.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      } else if (r?.category === 3) {
        units.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      }
    }
    props.overhaulReduxNewOrder({
      implants,
      instruments,
      units,
    });
  };

  const deleteItem = (category, objectId) => {
    let implants = newOrder?.implants;
    let instruments = newOrder?.instruments;
    let units = newOrder?.units;
    if (category === 1) {
      implants = deleteItemsFromRequestOrderPackage(implants, objectId);
    } else if (category == 2) {
      instruments = deleteItemsFromRequestOrderPackage(instruments, objectId);
    } else if (category === 3) {
      units = deleteItemsFromRequestOrderPackage(units, objectId);
    }
    props.overhaulReduxNewOrder({
      implants,
      instruments,
      units,
    });
  };

  const submit = async () => {
    let newErrors = RequestOrderModel;
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
    if (
      newRequestOrder?.deliveryDate === null ||
      newRequestOrder?.deliveryDate === ""
    ) {
      newErrors = {
        ...newErrors,
        deliveryDate: "Tanggal Delivery harus diisi",
      };
      isComplete = false;
    }
    setErrors(newErrors);

    if (isComplete) {
      const result = await createUpdateRequestOrderEntry(
        null,
        newRequestOrder?.deliveryOrderNumber,
        newRequestOrder?.doctorId,
        newRequestOrder?.hospitalId,
        newRequestOrder?.warehouseStorageId,
        newRequestOrder?.procedure,
        newRequestOrder?.surgeryDate,
        newRequestOrder?.deliveryDate,
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
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Buat Request Order Baru</h1>
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
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <span style={{ color: "red" }}>{errors?.inventoryJSON}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Delivery Order No</b>
        </label>
        <input
          name="deliveryOrderNumber"
          value={newRequestOrder?.deliveryOrderNumber}
          onChange={(e) =>
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              deliveryOrderNumber: e.target.value,
            })
          }
          type={"text"}
          className={`form-control ${
            errors?.deliveryOrderNumber ? "is-invalid" : ""
          } `}
        />
        <span style={{ color: "red" }}>{errors?.deliveryOrderNumber}</span>
      </div>

      <SearchTextInput
        label="Nama Dokter"
        name="doctor"
        value={newRequestOrder?.doctorId}
        error={errors?.doctorId}
        defaultOption="----Pilih Dokter----"
        data={doctors}
        searchPlaceholder="Cari nama dokter"
        onChange={(e) =>
          props.updateReduxNewRequestOrder({
            ...newRequestOrder,
            doctorId: e.target.value,
          })
        }
      />

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Region</b>
        </label>
        <select
          name="warehouseStorage"
          value={
            newRequestOrder?.warehouseStorageId
              ? newRequestOrder?.warehouseStorageId
              : ""
          }
          onChange={(e) => {
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              warehouseStorageId: e.target.value,
              hospitalId: null,
            });
            fetchHospitals(e.target.value);
          }}
          className={`form-control ${
            errors?.warehouseStorageId ? "is-invalid" : ""
          } `}
        >
          <option value="">----Pilih Region----</option>
          {warehouseStorages?.length === undefined
            ? null
            : warehouseStorages.map((item, index) => (
                <option key={index} value={item?.objectId}>
                  {item?.name}
                </option>
              ))}
        </select>
        <span style={{ color: "red" }}>{errors?.warehouseStorageId}</span>
      </div>

      <SearchTextInput
        label="Rumah Sakit"
        name="hospital"
        value={newRequestOrder?.hospitalId}
        error={errors?.hospitalId}
        defaultOption="----Pilih Rumah Sakit----"
        data={hospitals}
        searchPlaceholder="Cari nama rumah sakit"
        onChange={(e) =>
          props.updateReduxNewRequestOrder({
            ...newRequestOrder,
            hospitalId: e.target.value,
          })
        }
      />

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Prosedur</b>
        </label>
        <input
          name="procedure"
          value={newRequestOrder?.procedure}
          onChange={(e) =>
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              procedure: e.target.value,
            })
          }
          type={"text"}
          className={`form-control ${errors?.procedure ? "is-invalid" : ""} `}
        />
        <span style={{ color: "red" }}>{errors?.procedure}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Tanggal Request</b>
        </label>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
          <DateTimePicker
            readOnly
            format={DATE_TIME_PICKER_FORMAT}
            views={["year", "month", "day", "hours", "minutes"]}
            defaultValue={dayjs()}
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
            format={DATE_TIME_PICKER_FORMAT}
            views={["year", "month", "day", "hours", "minutes"]}
            onChange={(e) =>
              props.updateReduxNewRequestOrder({
                ...newRequestOrder,
                surgeryDate: e.toISOString(),
              })
            }
            value={
              newRequestOrder?.surgeryDate
                ? dayjs(newRequestOrder?.surgeryDate)
                : null
            }
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
            format={DATE_TIME_PICKER_FORMAT}
            views={["year", "month", "day", "hours", "minutes"]}
            onChange={(e) =>
              props.updateReduxNewRequestOrder({
                ...newRequestOrder,
                deliveryDate: e.toISOString(),
              })
            }
            value={
              newRequestOrder?.deliveryDate
                ? dayjs(newRequestOrder?.deliveryDate)
                : null
            }
            className={`w-100 ${errors?.deliveryDate ? "is-invalid" : ""} `}
          />
        </LocalizationProvider>
        <span style={{ color: "red" }}>{errors?.deliveryDate}</span>
        <p />
      </div>

      {loading || newOrder === null ? (
        <FadeLoader
          color="#4e73df"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <RequestOrderTable
            title="Implant & Disposable"
            category={1}
            list={newOrder?.implants}
            deleteItem={(e) => deleteItem(1, e)}
            warehouseStorageId={newRequestOrder?.warehouseStorageId}
          />
          <RequestOrderTable
            title="Instrument"
            category={2}
            list={newOrder?.instruments}
            deleteItem={(e) => deleteItem(2, e)}
            warehouseStorageId={newRequestOrder?.warehouseStorageId}
          />
          <RequestOrderTable
            title="Unit"
            category={3}
            list={newOrder?.units}
            deleteItem={(e) => deleteItem(3, e)}
            warehouseStorageId={newRequestOrder?.warehouseStorageId}
          />
        </>
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  newRequestOrder: store.orderState.newRequestOrder,
  newOrder: store.orderState.newOrder,
  doctors: store.orderState.doctors,
  hospitals: store.orderState.hospitals,
  warehouseStorages: store.orderState.warehouseStorages,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxNewOrder,
      updateReduxNewRequestOrder,
      overhaulReduxOrderDoctors,
      overhaulReduxOrderHospitals,
      overhaulReduxOrderWarehouseStorages,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(CreateRequestOrder);
