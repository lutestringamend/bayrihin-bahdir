import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/*import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";*/

import { getWarehouseStorageData } from "../../../parse/warehouse";
import {
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../../utils/order";
import { getDoctorsData, getHospitalsData } from "../../../parse/order";
//import { DATE_TIME_PICKER_FORMAT } from "../../../constants/strings";
import SearchTextInput from "../../../components/textinput/SearchTextInput";
import { hasPrivilege } from "../../../utils/account";
import { ACCOUNT_PRIVILEGE_ASSIGN_DRIVER } from "../../../constants/account";
import { faCancel, faEdit, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { getUserData } from "../../../parse/user";
import { createWarehouseProductMutationsForDeliveryOrderDelivery } from "../../../parse/order/deliveryorders";
import { DeliveryOrderDeliveryModel } from "../../../models/deliveryorder";
import {
  getDeliveryOrderDeliveryData,
  updateDeliveryOrderDelivery,
} from "../../../parse/order/orderdelivery";
import DeliveryOrderInfoForm from "../../../components/form/DeliveryOrderInfoForm";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function TrackingOrderDelivery(props) {
  const { currentUser, privileges, doctors, hospitals, warehouseStorages } =
    props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(DeliveryOrderDeliveryModel);

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

  const fetchDriverData = async () => {
    const result = await getUserData();
    if (!(result === undefined || result?.length === undefined)) {
      let newUsers = [];
      for (let r of result) {
        newUsers.push({
          ...r,
          name: r?.fullName ? r?.fullName : r?.username,
        });
      }
      setUsers(newUsers);
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const result = await getDeliveryOrderDeliveryData(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Order Delivery");
    } else {
      if (hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_DRIVER)) {
        fetchDriverData();
      }
      if (!(result?.implantJSON && result?.instrumentJSON && result?.unitJSON)) {
        setError("DO masih belum disetujui. Mohon klik Lihat DO dan cek kembali DO Implant dan DO Instrument");
      }
      setData({
        ...result,
        implantJSON: result?.implantJSON ? JSON.parse(result?.implantJSON) : null,
        instrumentJSON: result?.instrumentJSON ? JSON.parse(result?.instrumentJSON) : null,
        unitJSON: result?.unitJSON ? JSON.parse(result?.unitJSON) : null,
      });
    }
    setLoading(false);
  };

  const setNewDriver = (e) => {
    try {
      const driverUser = users.find(({ objectId }) => objectId === e);
      if (driverUser) {
        setData({ ...data, driverUser });
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
    let newErrors = DeliveryOrderDeliveryModel;
    let isComplete = true;

    if (
      data?.driverUser === undefined ||
      data?.driverUser === null ||
      data?.driverUser === ""
    ) {
      newErrors = {
        ...newErrors,
        driverUserId: "Driver wajib diisi",
      };
      isComplete = false;
    }
    setErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        "Pastikan semua data sudah terisi dengan benar. Aksi ini akan mengaktifkan Order Delivery ini.",
      );
      if (!confirm) {
        return;
      }
      setSubmitting(true);
      try {
        let params = {
          warehouseStorageId: data?.deliveryOrder?.warehouseStorage?.objectId,
          deliveryOrderId: data?.deliveryOrder?.objectId,
          deliveryOrderImplantId: data?.deliveryOrderImplant?.objectId,
          deliveryOrderInstrumentId: data?.deliveryOrderInstrument?.objectId,
          deliveryOrderDeliveryId: data?.objectId,
          approverUserId: currentUser?.objectId,
          implants: data?.implantJSON,
          instruments: data?.instrumentJSON,
          units: data?.unitJSON,
        };
        console.log(params);
        let update = await updateDeliveryOrderDelivery(
          data?.objectId,
          currentUser?.objectId,
          data?.driverUser?.objectId,
        );
        if (update) {
          let mutations =
            await createWarehouseProductMutationsForDeliveryOrderDelivery(
              params,
            );
          if (mutations) {
            fetchData();
          }
        } else {
          window.alert("Tidak bisa mengupdate Order Delivery");
        }
      } catch (e) {
        console.error(e);
        setError(e.toString());
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Detail Order Delivery</h1>
        {loading ? null : submitting ? (
          <FadeLoader
            color="#4e73df"
            loading={submitting}
            size={16}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div className="d-sm-flex align-items-center mb-4">
            {(data?.approvalDate && data?.approverUser) || !(hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_DRIVER) && data?.implantJSON && data?.instrumentJSON && data?.unitJSON) ? null : (
              <>
                <button
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  onClick={() => submit()}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ marginRight: "0.25rem", color: "white" }}
                  />
                  Setujui Order Delivery
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
              </>
            )}

            {data?.deliveryOrder ? (
              data?.deliveryOrder?.objectId ? (
                <Link
                  className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm mx-3"
                  to={`/order/delivery-order/${data?.deliveryOrder?.objectId}`}
                >
                  <FontAwesomeIcon
                    icon={faNewspaper}
                    style={{ marginRight: "0.25rem", color: "white" }}
                  />
                  Lihat DO
                </Link>
              ) : null
            ) : null}
          </div>
        )}
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
          <DeliveryOrderInfoForm data={data} />

          <SearchTextInput
            label="Driver untuk Delivery"
            name="driverUser"
            disabled={
              !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_DRIVER) ||
              (data?.approvalDate && data?.approverUser)
            }
            value={data?.driverUser ? data?.driverUser?.objectId : ""}
            error={errors?.driverUserId}
            defaultOption="----Pilih Driver untuk Delivery----"
            data={users}
            searchPlaceholder="Cari nama Driver"
            onChange={(e) => setNewDriver(e.target.value)}
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

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(TrackingOrderDelivery);
