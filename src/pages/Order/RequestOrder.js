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
} from "../../parse/warehouse";
import {
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../utils/order";
import { RequestOrderModel } from "../../models/requestorder";
import { getDoctorsData, getHospitalsData } from "../../parse/order";
import { DATE_TIME_PICKER_FORMAT } from "../../constants/strings";
import { getRequestOrderById } from "../../parse/order/requestorders";
import SearchTextInput from "../../components/textinput/SearchTextInput";
import { hasPrivilege } from "../../utils/account";
import { ACCOUNT_PRIVILEGE_ORDER_APPROVAL } from "../../constants/account";
import { faCancel } from "@fortawesome/free-solid-svg-icons";
import OrderInventoryTable from "../../components/tables/OrderInventoryTable";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/


function RequestOrder(props) {
  const {
    currentUser,
    privileges,
    doctors,
    hospitals,
    warehouseStorages,
  } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [errors, setErrors] = useState(RequestOrderModel);

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
    if (hospitals?.length === undefined || hospitals?.length < 1) {
      fetchHospitals();
    }
  }, [hospitals]);




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

  const fetchHospitals = async () => {
    const result = await getHospitalsData();
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderHospitals(result);
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    setInventory(null);
    const result = await getRequestOrderById(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Request Order");
    } else {
      setData(result);
      if (result?.inventoryJSON) {
        setInventory(JSON.parse(result?.inventoryJSON));
        console.log(JSON.parse(result?.inventoryJSON));
      }
    }
    setLoading(false);
  };

  const deleteItem = () => {

  }



  const submit = async () => {
    let newErrors = RequestOrderModel;
    let isComplete = true;
 
    setErrors(newErrors);

    if (isComplete) {

    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Detail Request Order</h1>
        {
          hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (

            <div className="d-sm-flex align-items-center mb-4">
            <button
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            onClick={() => submit()}
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Setujui
          </button>
            <button
              className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm mx-3"
              onClick={() => fetchData()}
            >
              <FontAwesomeIcon
                icon={faCancel}
                style={{ marginRight: "0.25rem", color: "white" }}
              />
              Reset
            </button>
          </div>

            
          ) : null
        }
       
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
          value={data?.deliveryOrderNumber}
          onChange={(e) =>
            setData({
              ...data,
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
        value={data?.doctor ? data?.doctor?.objectId : ""}
        error={errors?.doctorId}
        defaultOption="----Pilih Dokter----"
        data={doctors}
        searchPlaceholder="Cari nama dokter"
        onChange={(e) =>
          setData({
            ...data,
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
            data?.warehouseStorage
              ? data?.warehouseStorage?.objectId
              : ""
          }
          onChange={(e) => {
            setData({
              ...data,
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
        value={data?.hospital ? data?.hospital?.objectId : ""}
        error={errors?.hospitalId}
        defaultOption="----Pilih Rumah Sakit----"
        data={hospitals}
        searchPlaceholder="Cari nama rumah sakit"
        onChange={(e) =>
          setData({
            ...data,
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
          value={data?.procedure}
          onChange={(e) =>
            setData({
              ...data,
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
              setData({
                ...data,
                surgeryDate: e.toISOString(),
              })
            }
            value={
              data?.surgeryDate
                ? dayjs(data?.surgeryDate)
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
              setData({
                ...data,
                deliveryDate: e.toISOString(),
              })
            }
            value={
              data?.deliveryDate
                ? dayjs(data?.deliveryDate)
                : null
            }
            className={`w-100 ${errors?.deliveryDate ? "is-invalid" : ""} `}
          />
        </LocalizationProvider>
        <span style={{ color: "red" }}>{errors?.deliveryDate}</span>
        <p />
      </div>

      {loading || data === null ? (
        <FadeLoader
          color="#4e73df"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : inventory === null ? null : (
        <>
        <OrderInventoryTable
          title="Implant & Disposable"
          category={1}
          list={inventory?.implants}
          deleteItem={(e) => deleteItem(1, e)}
          warehouseStorageId={data?.warehouseStorage ? data?.warehouseStorage?.objectId : null}
        />
        <OrderInventoryTable
          title="Instrument"
          category={2}
          list={inventory?.instruments}
          deleteItem={(e) => deleteItem(2, e)}
          warehouseStorageId={data?.warehouseStorage ? data?.warehouseStorage?.objectId : null}
        />
        <OrderInventoryTable
          title="Unit"
          category={3}
          list={inventory?.units}
          deleteItem={(e) => deleteItem(3, e)}
          warehouseStorageId={data?.warehouseStorage ? data?.warehouseStorage?.objectId : null}
        />
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

export default connect(mapStateToProps, mapDispatchProps)(RequestOrder);
