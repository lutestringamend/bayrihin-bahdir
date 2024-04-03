import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehouseStorageData,
} from "../../parse/warehouse";
import {
  deleteItemsFromRequestOrderPackage,
  formatDeliveryOrderNumber,
  overhaulReduxNewOrder,
  updateReduxNewRequestOrder,
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../utils/order";
import RequestOrderTable from "../../components/tables/RequestOrderTable";
import { RequestOrderModel } from "../../models/requestorder";
import { getDoctorsData, getHospitalsData } from "../../parse/order";
import { convertDateISOStringtoDisplayDateTime } from "../../utils";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
  name: "",
  unitPackageGrouping: "",
};
const defaultModalErrors = {
  name: "",
  category: "",
  unitPackageGrouping: "",
};

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
  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState(null);
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
    console.log("redux newOrder", newOrder);
    if (newOrder !== null && loading) {
      setLoading(false);
    }
  }, [newOrder]);

  useEffect(() => {
    console.log("newRequestOrder", newRequestOrder);
  }, [newRequestOrder]);

  useEffect(() => {
    if (newRequestOrder?.warehouseStorageId === undefined || newRequestOrder?.warehouseStorageId === null || newRequestOrder?.warehouseStorageId === "") {

    } else {
      props.updateReduxNewRequestOrder({ ...newOrder, hospitalId: null });
      fetchHospitals(newRequestOrder?.warehouseStorageId);
    }
  }, [newRequestOrder?.warehouseStorageId]);

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
    const storages = await getWarehouseStorageData();
    console.log("Storages", storages);
    setStorages(storages);
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

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Buat Request Order Baru</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => console.log("createrequestorder")}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Submit
        </a>
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

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Nama Dokter</b>
        </label>
        <select
          name="doctor"
          value={newRequestOrder?.doctorId}
          onChange={(e) =>
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              doctorId: e.target.value,
            })
          }
          className={`form-control ${errors?.doctorId ? "is-invalid" : ""} `}
        >
          <option value="">----Pilih Dokter----</option>
          {doctors?.length === undefined
            ? null
            : doctors.map((item, index) => (
                <option key={index} value={item?.objectId}>
                  {item?.name}
                </option>
              ))}
        </select>

        <span style={{ color: "red" }}>{errors?.doctorId}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Region</b>
        </label>
        <select
          name="warehouseStorage"
          value={newRequestOrder?.warehouseStorageId}
          onChange={(e) =>
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              warehouseStorageId: e.target.value,
            })
          }
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

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Rumah Sakit</b>
        </label>
        <select
          name="hospital"
          value={newRequestOrder?.hospitalId}
          onChange={(e) =>
            props.updateReduxNewRequestOrder({
              ...newRequestOrder,
              hospitalId: e.target.value,
            })
          }
          className={`form-control ${errors?.hospitalId ? "is-invalid" : ""} `}
        >
          <option value="">----Pilih Rumah Sakit----</option>
          {hospitals?.length === undefined
            ? null
            : hospitals.map((item, index) => (
                <option key={index} value={item?.objectId}>
                  {item?.name}
                </option>
              ))}
        </select>
        <span style={{ color: "red" }}>{errors?.warehouseStorageId}</span>
      </div>

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
        <input
          name="createdAt"
          value={convertDateISOStringtoDisplayDateTime(new Date().toISOString(), true, true)}
          disabled
          type={"text"}
          className="form-control"
        />
      </div>


      <p>Tanggal Prosedur</p>
      <p>Tanggal Delivery</p>

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
          />
          <RequestOrderTable
            title="Instrument"
            category={2}
            list={newOrder?.instruments}
            deleteItem={(e) => deleteItem(2, e)}
          />
          <RequestOrderTable
            title="Unit"
            category={3}
            list={newOrder?.units}
            deleteItem={(e) => deleteItem(3, e)}
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
