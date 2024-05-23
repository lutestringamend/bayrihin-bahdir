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
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehousePackageProductData,
  getWarehouseProductData,
  getWarehouseStorageData,
} from "../../../parse/warehouse";
import {
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../../utils/order";
import { RequestOrderModel } from "../../../models/requestorder";
import { getDoctorsData, getHospitalsData } from "../../../parse/order";
import { DATE_TIME_PICKER_FORMAT } from "../../../constants/strings";
import { getRequestOrderById } from "../../../parse/order/requestorders";
import SearchTextInput from "../../../components/textinput/SearchTextInput";
import { hasPrivilege } from "../../../utils/account";
import {
  ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC,
  ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
} from "../../../constants/account";
import { faCancel } from "@fortawesome/free-solid-svg-icons";
import OrderInventoryTable from "../../../components/tables/OrderInventoryTable";
import { WarehouseTypeCategories } from "../../../constants/warehouse_types";
import { getUserData } from "../../../parse/user";
import { USER_ROLE_TECHNICAL_SUPPORT } from "../../../constants/user";
import { createUpdateDeliveryOrderEntry } from "../../../parse/order/deliveryorders";
import { ORDER_PACKAGE_ALACARTE_ID, ORDER_PACKAGE_ALACARTE_NAME } from "../../../constants/order";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  packageId: null,
  packageName: null,
  objectId: null,
  category: null,
  name: "",
  quantity: "",
};
const defaultModalErrors = {
  objectId: "",
  quantity: "",
};

const defaultPackageModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
};
const defaultPackageModalErrors = {
  objectId: "",
};

function RequestOrder(props) {
  const { currentUser, privileges, doctors, hospitals, warehouseStorages } =
    props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [errors, setErrors] = useState(RequestOrderModel);

  const [packages, setPackages] = useState([]);
  const [packageModalData, setPackageModalData] = useState(
    defaultPackageModalData,
  );
  const [packageModalErrors, setPackageModalErrors] = useState(
    defaultPackageModalErrors,
  );

  const [products, setProducts] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

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
    setInventory(null);
    const result = await getRequestOrderById(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Request Order");
    } else {
      fetchHospitals();
      if (!(result?.approvalDate && result?.approverUser)) {
        fetchTSData();
      }
      setData(result);
      if (result?.inventoryJSON) {
        setInventory(JSON.parse(result?.inventoryJSON));
        //console.log(JSON.parse(result?.inventoryJSON));
      }
    }
    setLoading(false);
  };

  const editInventoryPackage = (
    category,
    objectId,
    isDelete,
    notes,
    newItem,
    productId,
    quantity,
    deleteItem,
  ) => {
    try {
      //console.log("editInventoryPackage", category, objectId, newItem);
      let theCategory =
        category === 1
          ? inventory["implants"]
          : category === 2
            ? inventory["instruments"]
            : category === 3
              ? inventory["units"]
              : null;
      if (objectId === ORDER_PACKAGE_ALACARTE_ID) {
        const alacarteFound = theCategory.find(({ objectId }) => objectId === ORDER_PACKAGE_ALACARTE_ID);
        if (alacarteFound === undefined || alacarteFound === null) {
          let newPackage = {
            items: [],
            objectId: ORDER_PACKAGE_ALACARTE_ID,
            name: ORDER_PACKAGE_ALACARTE_NAME,
            notes: "",
          };
          theCategory.push(newPackage);
        }
      }

      let newCategory = [];
      for (let p of theCategory) {
        if (p?.objectId === objectId) {
          if (isDelete) {
            //console.log("to be deleted", p?.objectId);
          } else {
            let items = newItem || productId ? [] : p?.items;
            if (newItem) {
              let isFound = false;
              for (let i of p?.items) {
                if (i?.objectId === newItem?.objectId) {
                  isFound = true;
                  items.push({
                    ...i,
                    quantity:
                      i?.quantity +
                      (newItem?.quantity ? parseInt(newItem?.quantity) : 0),
                  });
                } else {
                  items.push(i);
                }
              }
              if (!isFound) {
                items.push(newItem);
              }
            } else if (productId) {
              for (let i of p?.items) {
                if (i?.objectId === productId) {
                  if (deleteItem) {
                    //console.log("to be deleted", p?.objectId, i?.objectId)
                  } else {
                    items.push({
                      ...i,
                      quantity,
                    });
                  }
                } else {
                  items.push(i);
                }
              }
            }
            newCategory.push({
              ...p,
              notes: notes === undefined || notes === null ? p?.notes : notes,
              items,
            });
          }
        } else {
          newCategory.push(p);
        }
      }
      //console.log("newcategory", category, isDelete, newCategory);
      setInventory({
        implants: category === 1 ? newCategory : inventory["implants"],
        instruments: category === 2 ? newCategory : inventory["instruments"],
        units: category === 3 ? newCategory : inventory["units"],
      });
      return true;
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    return false;
  };

  const openModalPackage = async (category) => {
    setPackages([]);
    setPackageModalErrors(defaultPackageModalErrors);
    setPackageModalData({
      ...packageModalData,
      category,
      visible: true,
    });
    const result = await getWarehousePackageData(category);
    if (!(result?.length === undefined || result?.length < 1)) {
      setPackages(result);
    }
  };

  const closeModalPackage = () => {
    setPackageModalData(defaultPackageModalData);
    setPackageModalErrors(defaultPackageModalErrors);
  };

  const saveModalPackageData = async () => {
    let newErrors = defaultPackageModalErrors;
    let isComplete = true;
    let newCategory =
      packageModalData?.category === 1
        ? inventory["implants"]
        : packageModalData?.category === 2
          ? inventory["instruments"]
          : packageModalData?.category === 3
            ? inventory["units"]
            : null;

    if (
      packageModalData?.objectId === null ||
      packageModalData?.objectId === ""
    ) {
      newErrors = { ...newErrors, objectId: "Paket wajib diisi" };
      isComplete = false;
    }
    const found = newCategory.find(
      ({ objectId }) => objectId === packageModalData?.objectId,
    );
    if (found) {
      newErrors = { ...newErrors, objectId: "Paket sudah ada" };
      isComplete = false;
    }
    setPackageModalErrors(newErrors);

    if (isComplete) {
      try {
        setPackageModalData({ ...packageModalData, loading: true });
        const result = await getWarehousePackageProductData(
          packageModalData?.objectId,
          packageModalData?.category,
        );
        if (result === undefined || result === null) {
          setPackageModalErrors({
            ...packageModalErrors,
            objectId: "Tidak bisa menambahkan paket ini",
          });
          setPackageModalData({ ...packageModalData, loading: false });
        } else {
          let items = [];
          for (let r of result) {
            if (r?.warehouseProduct) {
              items.push({
                objectId: r?.warehouseProduct?.objectId,
                name: r?.warehouseProduct?.name,
                quantity: parseInt(r?.quantity),
              });
            }
          }
          let newPackage = {
            items,
            objectId: packageModalData?.objectId,
            name: packages.find(
              ({ objectId }) => objectId === packageModalData?.objectId,
            )?.name,
            notes: "",
          };
          newCategory.push(newPackage);
          setInventory({
            implants:
              packageModalData?.category === 1
                ? newCategory
                : inventory["implants"],
            instruments:
              packageModalData?.category === 2
                ? newCategory
                : inventory["instruments"],
            units:
              packageModalData?.category === 3
                ? newCategory
                : inventory["units"],
          });
          closeModalPackage();
        }
      } catch (e) {
        console.error(e);
        setPackageModalErrors({
          ...packageModalErrors,
          objectId: e.toString(),
        });
      }
    }
  };

  const openModalItem = async (category, packageId, packageName) => {
    setProducts([]);
    setModalErrors(defaultModalErrors);
    setModalData({
      ...modalData,
      category,
      packageId,
      packageName,
      visible: true,
    });
    const result = await getWarehouseProductData(null, null, category, "name");
    if (!(result?.length === undefined || result?.length < 1)) {
      setProducts(result);
    }
  };

  const closeModal = () => {
    setModalData(defaultModalData);
    setModalErrors(defaultModalErrors);
  };

  const saveModalData = () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;

    if (modalData?.objectId === null || modalData?.objectId === "") {
      newErrors = { ...newErrors, objectId: "Produk wajib diisi" };
      isComplete = false;
    }
    if (
      isNaN(parseInt(modalData?.quantity)) ||
      parseInt(modalData?.quantity) < 1
    ) {
      newErrors = {
        ...newErrors,
        quantity: "Jumlah harus diisi angka lebih dari 0",
      };
      isComplete = false;
    }
    setModalErrors(newErrors);

    if (isComplete) {
      try {
        let newItem = {
          objectId: modalData?.objectId,
          name: products.find(
            ({ objectId }) => objectId === modalData?.objectId,
          )?.name,
          quantity: parseInt(modalData?.quantity),
        };
        let result = editInventoryPackage(
          modalData?.category,
          modalData?.packageId,
          false,
          null,
          newItem,
        );
        if (result) {
          closeModal();
        } else {
          setModalErrors({
            ...modalErrors,
            objectId: "Gagal menambahkan item ini",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const selectNewDoctor = (id) => {
    try {
      const found = doctors.find(({ objectId }) => objectId === id);
      if (found) {
        setData({
          ...data,
          doctor: found,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectNewRegion = (id) => {
    try {
      const found = warehouseStorages.find(({ objectId }) => objectId === id);
      if (found) {
        fetchHospitals(id);
        setData({
          ...data,
          warehouseStorage: found,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectNewHospital = (id) => {
    try {
      const found = hospitals.find(({ objectId }) => objectId === id);
      setData({
        ...data,
        hospital: found ? found : null,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const submit = async () => {
    if (submitting) {
      return;
    }
    let newErrors = RequestOrderModel;
    let isComplete = true;

    if (data?.deliveryOrderNumber === "") {
      newErrors = {
        ...newErrors,
        deliveryOrderNumber: "Delivery Order No tidak boleh kosong",
      };
      isComplete = false;
    }
    if (
      data?.doctor === null ||
      data?.doctor?.objectId === undefined ||
      data?.doctor?.objectId === null
    ) {
      newErrors = { ...newErrors, doctorId: "Dokter wajib diisi" };
      isComplete = false;
    }
    if (
      data?.warehouseStorage === null ||
      data?.warehouseStorage?.objectId === undefined ||
      data?.warehouseStorage?.objectId === null
    ) {
      newErrors = { ...newErrors, warehouseStorageId: "Region wajib diisi" };
      isComplete = false;
    }
    if (
      data?.hospital === null ||
      data?.hospital?.objectId === undefined ||
      data?.hospital?.objectId === null
    ) {
      newErrors = { ...newErrors, hospitalId: "Rumah Sakit wajib diisi" };
      isComplete = false;
    }
    if (data?.procedure === null || data?.procedure === "") {
      newErrors = { ...newErrors, procedure: "Prosedur wajib diisi" };
      isComplete = false;
    }
    if (data?.surgeryDate === null || data?.surgeryDate === "") {
      newErrors = { ...newErrors, surgeryDate: "Tanggal Prosedur wajib diisi" };
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
        "Pastikan semua data sudah terisi dengan benar. Aksi ini akan membuat Delivery Order baru.",
      );
      if (!confirm) {
        return;
      }
      setSubmitting(true);
      let deliveryOrderNumber = data?.deliveryOrderNumber.replace("REQUEST ORDER", "DO REQUEST");
      try {
        const result = await createUpdateDeliveryOrderEntry(
          null,
          currentUser?.objectId,
          data?.objectId,
          deliveryOrderNumber,
          data?.doctor?.objectId,
          data?.hospital?.objectId,
          data?.warehouseStorage?.objectId,
          data?.procedure,
          data?.surgeryDate,
          data?.remark,
          JSON.stringify(inventory["implants"]),
          JSON.stringify(inventory["instruments"]),
          JSON.stringify(inventory["units"]),
          data?.tsPICUserId,
        );
        if (result) {
          setSubmitting(false);
          navigate("/order/delivery-orders");
          return;
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
        <h1 className="h3 mb-0 text-gray-800">Detail Request Order</h1>
        {submitting ? (
          <FadeLoader
            color="#4e73df"
            loading={submitting}
            size={16}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : data?.approvalDate && data?.approverUser ? null : hasPrivilege(
            privileges,
            ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
          ) ? (
          <div className="d-sm-flex align-items-center mb-4">
            {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC) ? (
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
              <b>Request Order No</b>
            </label>
            <input
              name="deliveryOrderNumber"
              value={data?.deliveryOrderNumber}
              disabled
              type="text"
              className="form-control"
            />
          </div>

          <SearchTextInput
            label="Nama Dokter"
            name="doctor"
            disabled={data?.approvalDate && data?.approverUser}
            value={data?.doctor ? data?.doctor?.objectId : ""}
            error={errors?.doctorId}
            defaultOption="----Pilih Dokter----"
            data={doctors}
            searchPlaceholder="Cari nama dokter"
            onChange={(e) => selectNewDoctor(e.target.value)}
          />

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Region</b>
            </label>
            <select
              name="warehouseStorage"
              disabled={data?.approvalDate && data?.approverUser}
              value={
                data?.warehouseStorage ? data?.warehouseStorage?.objectId : ""
              }
              onChange={(e) => selectNewRegion(e.target.value)}
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
            disabled={data?.approvalDate && data?.approverUser}
            value={data?.hospital ? data?.hospital?.objectId : ""}
            error={errors?.hospitalId}
            defaultOption="----Pilih Rumah Sakit----"
            data={hospitals}
            searchPlaceholder="Cari nama rumah sakit"
            onChange={(e) => selectNewHospital(e.target.value)}
          />

          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Prosedur</b>
            </label>
            <input
              name="procedure"
              value={data?.procedure}
              disabled={data?.approvalDate && data?.approverUser}
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
                readOnly={data?.approvalDate && data?.approverUser}
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
         

          {data?.approvalDate && data?.approverUser ? (
            <>
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
              <div className="d-sm justify-content-between mb-4">
                <label>
                  <b>Disetujui Tanggal</b>
                </label>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="id"
                >
                  <DateTimePicker
                    readOnly
                    format={DATE_TIME_PICKER_FORMAT}
                    views={["year", "month", "day", "hours", "minutes"]}
                    value={
                      data?.approvalDate ? dayjs(data?.approvalDate) : null
                    }
                    className="w-100"
                  />
                </LocalizationProvider>
              </div>
            </>
          ) : hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC) ? (
            <SearchTextInput
              label="Technical Support PIC"
              name="tsPICUserId"
              disabled={data?.approvalDate && data?.approverUser}
              value={data?.tsPICUserId ? data?.tsPICUserId : ""}
              error={errors?.tsPICUserId}
              defaultOption="----Pilih Technical Support----"
              data={users}
              searchPlaceholder="Cari nama Technical Support"
              onChange={(e) =>
                setData({ ...data, tsPICUserId: e.target.value })
              }
            />
          ) : null}
          <div className="d-sm justify-content-between mb-4">
            <label>
              <b>Catatan</b>
            </label>
            <textarea
              name="remark"
              disabled={data?.approvalDate && data?.approverUser}
              value={data?.remark ? data?.remark : ""}
              onChange={(e) => setData({ ...data, remark: e.target.value })}
              type="text"
              rows="3"
              className="form-control"
            />
            <span style={{ color: "red" }}>{errors?.remark}</span>
          </div>
        </>
      )}

      {inventory === null ? null : (
        <>
          <OrderInventoryTable
            category={1}
            list={inventory?.implants}
            disabled={(data?.approvalDate && data?.approverUser) || !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL)}
            warehouseStorageId={
              data?.warehouseStorage ? data?.warehouseStorage?.objectId : null
            }
            editInventoryPackage={(
              objectId,
              isDelete,
              notes,
              newItem,
              productId,
              quantity,
              deleteItem,
            ) =>
              editInventoryPackage(
                1,
                objectId,
                isDelete,
                notes,
                newItem,
                productId,
                quantity,
                deleteItem,
              )
            }
            openModalPackage={() => openModalPackage(1)}
            openModalItem={(packageId, packageName) =>
              openModalItem(1, packageId, packageName)
            }
          />
          <OrderInventoryTable
            category={2}
            list={inventory?.instruments}
            disabled={(data?.approvalDate && data?.approverUser) || !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL)}
            warehouseStorageId={
              data?.warehouseStorage ? data?.warehouseStorage?.objectId : null
            }
            editInventoryPackage={(
              objectId,
              isDelete,
              notes,
              newItem,
              productId,
              quantity,
              deleteItem,
            ) =>
              editInventoryPackage(
                2,
                objectId,
                isDelete,
                notes,
                newItem,
                productId,
                quantity,
                deleteItem,
              )
            }
            openModalPackage={() => openModalPackage(2)}
            openModalItem={(packageId, packageName) =>
              openModalItem(2, packageId, packageName)
            }
          />
          <OrderInventoryTable
            category={3}
            list={inventory?.units}
            disabled={(data?.approvalDate && data?.approverUser) || !hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL)}
            warehouseStorageId={
              data?.warehouseStorage ? data?.warehouseStorage?.objectId : null
            }
            editInventoryPackage={(
              objectId,
              isDelete,
              notes,
              newItem,
              productId,
              quantity,
              deleteItem,
            ) =>
              editInventoryPackage(
                3,
                objectId,
                isDelete,
                notes,
                newItem,
                productId,
                quantity,
                deleteItem,
              )
            }
            openModalPackage={() => openModalPackage(3)}
            openModalItem={(packageId, packageName) =>
              openModalItem(3, packageId, packageName)
            }
          />
        </>
      )}
      <Modal
        show={packageModalData?.visible}
        onHide={() => closeModalPackage()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {`Tambah Paket ${WarehouseTypeCategories[packageModalData?.category]}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Masukkan nama paket baru untuk ditambahkan</p>
          <div className="row">
            <div className="col-lg-10">
              <SearchTextInput
                label="Nama Paket"
                name="objectId"
                value={
                  packageModalData?.objectId ? packageModalData.objectId : ""
                }
                error={packageModalErrors?.objectId}
                loading={packages?.length === undefined || packages?.length < 1}
                defaultOption="----Pilih Paket----"
                data={packages}
                searchPlaceholder="Cari nama paket"
                onChange={(e) =>
                  setPackageModalData({
                    ...packageModalData,
                    objectId: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>
        {packageModalData?.loading ? (
          <Modal.Footer>
            <FadeLoader
              color="#4e73df"
              loading={packageModalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModalPackage()}>
              Tutup
            </Button>
            <Button variant="primary" onClick={() => saveModalPackageData()}>
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      <Modal show={modalData?.visible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`Tambah Item ${
              WarehouseTypeCategories[modalData?.category]
            } ke Paket ${modalData?.packageName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Masukkan nama produk dan kuantitas untuk ditambahkan</p>
          <div className="row">
            <div className="col-lg-10">
              <SearchTextInput
                label="Nama Produk"
                name="objectId"
                value={modalData?.objectId ? modalData.objectId : ""}
                error={modalErrors?.objectId}
                loading={products?.length === undefined || products?.length < 1}
                defaultOption="----Pilih Produk----"
                data={products}
                searchPlaceholder="Cari nama produk"
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    objectId: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Jumlah</b>
              </label>
              <input
                name="quantity"
                value={modalData?.quantity}
                onChange={(e) =>
                  setModalData({ ...modalData, quantity: e.target.value })
                }
                type="decimal"
                className={`form-control ${
                  modalErrors?.quantity ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.quantity}</span>
            </div>
          </div>
        </Modal.Body>
        {modalData?.loading ? (
          <Modal.Footer>
            <FadeLoader
              color="#4e73df"
              loading={modalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal()}>
              Tutup
            </Button>
            <Button variant="primary" onClick={() => saveModalData()}>
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
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
