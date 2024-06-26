import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehousePackageProductData,
  getWarehouseProductData,
  getWarehouseProductLotsData,
  getWarehouseStorageData,
} from "../../../parse/warehouse";
import {
  overhaulReduxOrderDoctors,
  overhaulReduxOrderHospitals,
  overhaulReduxOrderWarehouseStorages,
} from "../../../utils/order";
import { getDoctorsData, getHospitalsData } from "../../../parse/order";
import { hasPrivilege } from "../../../utils/account";
import {
  ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
} from "../../../constants/account";
import {
  faCancel,
  faCheckCircle,
  faEdit,
  faMotorcycle,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import {
  createUpdateDeliveryOrderDelivery,
  getDeliveryOrderInstrumentById,
  updateDeliveryOrderInstrumentById,
} from "../../../parse/order/deliveryorders";
import { DeliveryOrderModel } from "../../../models/deliveryorder";
import DeliveryOrderInventoryTable from "../../../components/tables/DeliveryOrderInventoryTable";
import { WarehouseTypeCategories } from "../../../constants/warehouse_types";
import SearchTextInput from "../../../components/textinput/SearchTextInput";
import DeliveryOrderInfoForm from "../../../components/form/DeliveryOrderInfoForm";
import { getWarehouseProductStorageForDeliveryOrder } from "../../../parse/warehouse/product_storage";
import { getDeliveryOrderDeliveryData } from "../../../parse/order/orderdelivery";
import {
  ORDER_PACKAGE_ALACARTE_ID,
  ORDER_PACKAGE_ALACARTE_NAME,
} from "../../../constants/order";
import { getWarehouseInstrumentTrays } from "../../../parse/warehouse/instrument_trays";

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

const defaultModalProductStorageData = {
  visible: false,
  loading: false,
  packageId: null,
  category: null,
  warehouseProductId: null,
  warehouseProductName: "",
  warehouseStorageId: null,
  warehouseProductStorage: null,
  quantity: null,
  balanceStock: null,
};
const defaultModalProductStorageErrors = {
  warehouseStorageId: "",
  warehouseProductStorage: "",
  balanceStock: "",
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

const defaultTrayModalData = {
  visible: false,
  loading: false,
  packageId: null,
  packageName: null,
  warehouseInstrumentTrayId: null,
};
const defaultTrayModalErrors = {
  warehouseInstrumentTrayId: "",
};

function DeliveryOrderInstrument(props) {
  const { currentUser, privileges, doctors, hospitals, warehouseStorages } =
    props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(DeliveryOrderModel);
  const [instruments, setInstruments] = useState(null);
  const [units, setUnits] = useState(null);

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

  const [productStorages, setProductStorages] = useState([]);
  const [productStorageModalData, setProductStorageModalData] = useState(
    defaultModalProductStorageData,
  );
  const [productStorageModalErrors, setProductStorageModalErrors] = useState(
    defaultModalProductStorageErrors,
  );

  const [trays, setTrays] = useState([]);
  const [trayModalData, setTrayModalData] = useState(defaultTrayModalData);
  const [trayModalErrors, setTrayModalErrors] = useState(
    defaultTrayModalErrors,
  );

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

  useEffect(() => {
    console.log("instruments", instruments);
  }, [instruments]);

  useEffect(() => {
    console.log("units", units);
  }, [units]);

  /*useEffect(() => {
    console.log("psmodal", productStorageModalData);
  }, [productStorageModalData]);

  useEffect(() => {
    console.log("PS", productStorages);
  }, [productStorages]);*/

  useEffect(() => {
    if (
      productStorageModalData?.warehouseStorageId === undefined ||
      productStorageModalData?.warehouseStorageId === null ||
      productStorageModalData?.warehouseStorageId === ""
    ) {
      setProductStorages([]);
      return;
    }
    fetchProductStorages();
  }, [productStorageModalData?.warehouseStorageId]);

  useEffect(() => {
    if (
      productStorageModalData?.warehouseProductStorage === undefined ||
      productStorageModalData?.warehouseProductStorage === null ||
      productStorageModalData?.warehouseProductStorage === ""
    ) {
      setProductStorageModalData({
        ...productStorageModalData,
        balanceStock: null,
      });
      return;
    }
    try {
      const found = productStorages.find(
        ({ objectId }) =>
          objectId === productStorageModalData?.warehouseProductStorage,
      );
      if (found) {
        let balanceStock = parseInt(found.balanceStock);
        setProductStorageModalData({
          ...productStorageModalData,
          balanceStock: balanceStock.toString(),
        });
        setProductStorageModalErrors({
          ...productStorageModalErrors,
          balanceStock:
            balanceStock < productStorageModalData?.quantity
              ? "Jumlah Stok tidak mencukupi"
              : "",
        });
      }
    } catch (e) {
      console.error(e);
      setProductStorageModalErrors({
        ...productStorageModalErrors,
        balanceStock: e?.toString(),
      });
    }
  }, [productStorageModalData?.warehouseProductStorage]);

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

  const fetchProductStorages = async () => {
    setProductStorageModalErrors({
      ...productStorageModalErrors,
      warehouseProductStorage: "",
    });
    try {
      const result = await getWarehouseProductStorageForDeliveryOrder(
        productStorageModalData?.warehouseProductId,
        productStorageModalData?.warehouseStorageId,
      );
      if (!(result === undefined || result === null)) {
        setProductStorageModalData({
          ...productStorageModalData,
          warehouseProductStorage: null,
          balanceStock: null,
        });
        setProductStorages(result);
      }
    } catch (e) {
      console.error(e);
      setProductStorageModalErrors({
        ...productStorageModalErrors,
        warehouseProductStorage: "Data tak valid di region ini",
        balanceStock: null,
      });
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

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const result = await getDeliveryOrderInstrumentById(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Delivery Order Instrument & Unit");
    } else {
      setData(result);
      if (result?.instrumentJSON) {
        setInstruments(JSON.parse(result?.instrumentJSON));
      }
      if (result?.unitJSON) {
        setUnits(JSON.parse(result?.unitJSON));
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
    newProductStorage,
  ) => {
    try {
      let theCategory = category === 2 ? instruments : units;
      if (objectId === ORDER_PACKAGE_ALACARTE_ID) {
        const alacarteFound = theCategory.find(
          ({ objectId }) => objectId === ORDER_PACKAGE_ALACARTE_ID,
        );
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
                  } else {
                    items.push({
                      ...i,
                      quantity,
                      warehouseProductStorage: newProductStorage
                        ? newProductStorage
                        : i?.warehouseProductStorage
                          ? i?.warehouseProductStorage
                          : null,
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
      if (category === 2) {
        setInstruments(newCategory);
      } else {
        setUnits(newCategory);
      }
      return true;
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    return false;
  };

  const openModalProductStorage = async (
    category,
    warehouseProductId,
    warehouseProductName,
    quantity,
    packageId,
    warehouseProductStorageId,
  ) => {
    /*console.log(
      "openModalProductStorage",
      warehouseProductId,
      warehouseProductName,
      quantity,
      packageId,
      warehouseProductStorageId,
    );*/
    setProductStorages([]);
    setProductStorageModalErrors(defaultModalProductStorageErrors);
    setProductStorageModalData({
      ...defaultModalProductStorageData,
      category,
      warehouseProductId,
      warehouseProductName,
      packageId,
      warehouseStorageId: data?.deliveryOrder
        ? data?.deliveryOrder?.warehouseStorage
          ? data?.deliveryOrder?.warehouseStorage?.objectId
          : ""
        : "",
      warehouseProductStorage: warehouseProductStorageId
        ? warehouseProductStorageId
        : null,
      quantity: quantity?.toString(),
      visible: true,
    });
  };

  const closeModalProductStorage = () => {
    setProductStorageModalData(defaultModalProductStorageData);
    setProductStorageModalErrors(defaultModalProductStorageErrors);
  };

  const saveModalProductStorage = () => {
    let newErrors = defaultModalProductStorageErrors;
    let isComplete = true;

    if (
      productStorageModalData?.warehouseStorageId === null ||
      productStorageModalData?.warehouseStorageId === ""
    ) {
      newErrors = { ...newErrors, warehouseStorageId: "Region wajib diisi" };
      isComplete = false;
    }
    if (
      productStorageModalData?.warehouseProductStorage === null ||
      productStorageModalData?.warehouseProductStorage === ""
    ) {
      newErrors = {
        ...newErrors,
        warehouseProductStorage: "Lot Produk wajib diisi",
      };
      isComplete = false;
    }
    setProductStorageModalErrors(newErrors);

    if (isComplete) {
      try {
        const found = productStorages.find(
          ({ objectId }) => productStorageModalData?.warehouseProductStorage,
        );
        if (found === undefined || found === null) {
          return;
        }
        let newProductStorage = {
          objectId: found?.objectId,
          balanceStock: parseInt(found.balanceStock),
          balanceOnDelivery: parseInt(found.balanceOnDelivery),
          balanceTotal: parseInt(found.balanceTotal),
          warehouseProductLot: found?.warehouseProductLot
            ? {
                objectId: found?.warehouseProductLot?.objectId,
                name: found?.warehouseProductLot?.name,
              }
            : null,
        };
        let result = editInventoryPackage(
          productStorageModalData?.category,
          productStorageModalData?.packageId,
          false,
          null,
          null,
          productStorageModalData?.warehouseProductId,
          productStorageModalData?.quantity,
          false,
          newProductStorage,
        );
        if (result) {
          closeModalProductStorage();
        } else {
          setProductStorageModalErrors({
            ...productStorageModalErrors,
            warehouseProductStorage: "Gagal menunjuk lot produk ini",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
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
    let newCategory = packageModalData?.category === 2 ? instruments : units;

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
          if (packageModalData?.category === 2) {
            setInstruments(newCategory);
          } else {
            setUnits(newCategory);
          }
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

  const closeModalTray = () => {
    setTrayModalData(defaultTrayModalData);
    setTrayModalErrors(defaultTrayModalErrors);
  };

  const openModalTray = async (packageId, packageName) => {
    setTrayModalErrors(defaultModalErrors);
    setTrayModalData({
      ...defaultTrayModalData,
      packageId,
      packageName,
      visible: true,
    });
    const result = await getWarehouseInstrumentTrays();
    if (!(result?.length === undefined || result?.length < 1)) {
      setTrays(result);
    }
  };

  const saveModalTray = async () => {
    let newErrors = defaultTrayModalErrors;
    let isComplete = true;

    if (
      trayModalData?.warehouseInstrumentTrayId === null ||
      trayModalData?.warehouseInstrumentTrayId === ""
    ) {
      newErrors = {
        ...newErrors,
        warehouseInstrumentTrayId: "Tray wajib diisi",
      };
      isComplete = false;
    }
    setTrayModalErrors(newErrors);
    if (!isComplete) {
      return;
    }

    try {
      setTrayModalData({ ...trayModalData, loading: true });
      let newInstruments = [...instruments];
      let results = [];
      for (let n of newInstruments) {
        if (n?.objectId === trayModalData?.packageId) {
          let items = instruments.find(
            ({ objectId }) => objectId === trayModalData?.packageId,
          )?.items;
          let newItems = [];

          for (let i of items) {
            let warehouseProductStorage = null;
            let productLots = await getWarehouseProductLotsData(
              i?.objectId,
              trayModalData?.warehouseInstrumentTrayId,
            );
            let warehouseProductLotId = productLots
              ? productLots[0]
                ? productLots[0]?.objectId
                : null
              : null;
            if (warehouseProductLotId) {
              let warehouseProductStorages =
                await getWarehouseProductStorageForDeliveryOrder(
                  i?.objectId,
                  null,
                  warehouseProductLotId,
                );
              warehouseProductStorage = warehouseProductStorages
                ? warehouseProductStorages[0]
                  ? warehouseProductStorages[0]
                  : null
                : null;
            }
            if (warehouseProductStorage) {
              //console.log(i, warehouseProductStorage);
              newItems.push({
                ...i,
                warehouseProductStorage: {
                  objectId: warehouseProductStorage?.objectId,
                  balanceStock: warehouseProductStorage?.balanceStock
                    ? warehouseProductStorage?.balanceStock
                    : 0,
                  balanceOnDelivery: warehouseProductStorage?.balanceOnDelivery
                    ? warehouseProductStorage?.balanceOnDelivery
                    : 0,
                  balanceTotal: warehouseProductStorage?.balanceTotal
                    ? warehouseProductStorage?.balanceTotal
                    : 0,
                  warehouseProductLot: {
                    objectId: warehouseProductLotId,
                    name: productLots[0]?.name,
                  }
                },
              });
            } else {
              newItems.push(i);
            }
          }

          results.push({
            ...n,
            items: newItems,
          });
        } else {
          results.push(n);
        }
      }

      setInstruments(results);
      setTrayModalData(defaultTrayModalData);
      return;
    } catch (e) {
      console.error(e);
      setTrayModalErrors({
        ...newErrors,
        warehouseInstrumentTrayId: e?.toString(),
      });
    }
    setTrayModalData({ ...trayModalData, loading: false });
  };

  const submitEdit = async () => {
    if (submitting) {
      return;
    }
    const confirm = window.confirm(
      "Pastikan semua data sudah terisi dengan benar. Aksi ini akan mengedit isi Delivery Order Instrument ini.",
    );
    if (!confirm) {
      return;
    }
    setSubmitting(true);
    const result = await updateDeliveryOrderInstrumentById(
      data?.objectId,
      currentUser?.objectId,
      JSON.stringify(instruments),
      JSON.stringify(units),
    );
    if (result) {
      window.alert("DO Instrument berhasil diupdate");
      fetchData();
    } else {
      window.alert("Gagal mengupdate DO Instrument");
    }
    setSubmitting(false);
  };

  const submit = async () => {
    if (submitting) {
      return;
    }
    let isComplete = true;
    try {
      for (let i of instruments) {
        for (let n of i?.items) {
          if (
            n?.warehouseProductStorage === undefined ||
            n?.warehouseProductStorage?.objectId === undefined ||
            n?.warehouseProductStorage?.objectId === null ||
            n?.warehouseProductStorage?.objectId === ""
          ) {
            isComplete = false;
          }
        }
      }
      for (let i of units) {
        for (let n of i?.items) {
          if (
            n?.warehouseProductStorage === undefined ||
            n?.warehouseProductStorage?.objectId === undefined ||
            n?.warehouseProductStorage?.objectId === null ||
            n?.warehouseProductStorage?.objectId === ""
          ) {
            isComplete = false;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setError(e?.toString());
      return;
    }

    if (isComplete) {
      const confirm = window.confirm(
        "Pastikan semua data sudah terisi dengan benar. Aksi ini akan mengeluarkan perintah delivery dari gudang.",
      );
      if (!confirm) {
        return;
      }
      setSubmitting(true);
      try {
        const update = await updateDeliveryOrderInstrumentById(
          data?.objectId,
          currentUser?.objectId,
          JSON.stringify(instruments),
          JSON.stringify(units),
          new Date().toISOString(),
          currentUser?.objectId,
        );
        if (update) {
          const result = await createUpdateDeliveryOrderDelivery(
            null,
            data?.deliveryOrder?.objectId,
            null,
            data?.objectId,
            currentUser?.objectId,
            null,
            JSON.stringify(instruments),
            JSON.stringify(units),
          );
          if (result) {
            window.alert(
              "Order Delivery baru telah disiapkan untuk Delivery Order ini",
            );
            navigate("/tracking/order-deliveries");
          } else {
            window.alert("Gagal membuat Order Delivery baru");
          }
        } else {
          window.alert("Gagal mengupdate DO Instrument");
        }
      } catch (e) {
        console.error(e);
        setError(e.toString());
      }
      setSubmitting(false);
    } else {
      window.alert("Masih ada lot produk yang belum lengkap");
      setError(
        "Lengkapi produk lot untuk semua item di dalam semua paket terlebih dahulu",
      );
    }
  };

  const openOrderDelivery = async () => {
    const result = await getDeliveryOrderDeliveryData(
      null,
      data?.deliveryOrder?.objectId,
      null,
    );
    if (
      !(
        result === undefined ||
        result?.length === undefined ||
        result?.length < 1 ||
        result[0]?.objectId === undefined
      )
    ) {
      navigate(`/tracking/order-delivery/${result[0]?.objectId}`);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Detail DO Instrument & Unit</h1>
        {submitting ? (
          <FadeLoader
            color="#4e73df"
            loading={submitting}
            size={16}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div className="d-sm-flex align-items-center mb-4">
            {data?.approvalDate && data?.approverUser ? null : hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
              ) ? (
              <>
                <button
                  onClick={() => submitEdit()}
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ marginRight: "0.25rem", color: "white" }}
                  />
                  Edit DO Instrument
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
            ) : null}

            {data?.approvalDate &&
            data?.approverUser &&
            hasPrivilege(
              privileges,
              ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
            ) ? (
              <button
                onClick={() => openOrderDelivery()}
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              >
                <FontAwesomeIcon
                  icon={faMotorcycle}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Buka Order Delivery
              </button>
            ) : data?.editorUser &&
              hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
              ) ? (
              <button
                onClick={() => submit()}
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Setujui DO Instrument
              </button>
            ) : null}

            {data?.deliveryOrder ? (
              <Link
                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm mx-3"
                to={`/order/delivery-order/${data?.deliveryOrder?.objectId}`}
              >
                <FontAwesomeIcon
                  icon={faNewspaper}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Lihat DO Induk
              </Link>
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

          {instruments === null ? null : (
            <DeliveryOrderInventoryTable
              category={2}
              list={instruments}
              disabled={
                (data?.approvalDate && data?.approverUser) ||
                !hasPrivilege(
                  privileges,
                  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
                )
              }
              warehouseStorageId={
                data?.deliveryOrder
                  ? data?.deliveryOrder?.warehouseStorage
                    ? data?.deliveryOrder?.warehouseStorage?.objectId
                    : null
                  : null
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
              openModalProductStorage={(
                objectId,
                name,
                quantity,
                packageId,
                warehouseProductStorageId,
              ) =>
                openModalProductStorage(
                  2,
                  objectId,
                  name,
                  quantity,
                  packageId,
                  warehouseProductStorageId,
                )
              }
              openModalTray={(objectId, name) => openModalTray(objectId, name)}
            />
          )}
        </>
      )}

      {units === null ? null : (
        <DeliveryOrderInventoryTable
          category={3}
          list={units}
          disabled={
            (data?.approvalDate && data?.approverUser) ||
            !hasPrivilege(
              privileges,
              ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
            )
          }
          warehouseStorageId={
            data?.deliveryOrder
              ? data?.deliveryOrder?.warehouseStorage
                ? data?.deliveryOrder?.warehouseStorage?.objectId
                : null
              : null
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
          openModalProductStorage={(
            objectId,
            name,
            quantity,
            packageId,
            warehouseProductStorageId,
          ) =>
            openModalProductStorage(
              3,
              objectId,
              name,
              quantity,
              packageId,
              warehouseProductStorageId,
            )
          }
        />
      )}

      <Modal
        show={packageModalData?.visible}
        onHide={() => closeModalPackage()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {`Tambah Paket ${
              WarehouseTypeCategories[packageModalData?.category]
            }`}
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
      <Modal
        show={productStorageModalData?.visible}
        onHide={() => closeModalProductStorage()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {`Pilih Lot untuk ${productStorageModalData?.warehouseProductName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Pilih Lot dan pastikan bahwa jumlah ketersediaan sesuai dengan
            mutasi terakhir
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Jumlah Dibutuhkan</b>
              </label>
            </div>
            <div className="col-lg-10">
              <input
                name="quantity"
                value={productStorageModalData?.quantity}
                disabled
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Region</b>
              </label>
              <select
                name="warehouseStorage"
                value={productStorageModalData?.warehouseStorageId}
                onChange={(e) =>
                  setProductStorageModalData({
                    ...productStorageModalData,
                    warehouseStorageId: e.target.value,
                  })
                }
                className={`form-control ${
                  productStorageModalErrors.warehouseStorageId
                    ? "is-invalid"
                    : ""
                } `}
              >
                <option value="">----Pilih Region----</option>
                {warehouseStorages
                  ? warehouseStorages.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name}
                      </option>
                    ))
                  : null}
              </select>
              <span style={{ color: "red" }}>
                {productStorageModalErrors?.warehouseStorageId}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Lot Tersedia</b>
              </label>
              <select
                name="warehouseProductStorageId"
                value={productStorageModalData?.warehouseProductStorage}
                onChange={(e) =>
                  setProductStorageModalData({
                    ...productStorageModalData,
                    warehouseProductStorage: e.target.value,
                  })
                }
                className={`form-control ${
                  productStorageModalErrors.warehouseProductStorage
                    ? "is-invalid"
                    : ""
                } `}
              >
                <option value="">----Pilih Lot Tersedia----</option>
                {productStorages
                  ? productStorages.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.warehouseProductLot
                          ? item?.warehouseProductLot?.name
                          : ""}
                      </option>
                    ))
                  : null}
              </select>
              <span style={{ color: "red" }}>
                {productStorageModalErrors?.warehouseProductStorage}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Stok Tersedia</b>
              </label>
            </div>
            <div className="col-lg-10">
              <input
                name="balanceStock"
                value={
                  productStorageModalData?.balanceStock
                    ? productStorageModalData?.balanceStock
                    : "-"
                }
                disabled
                type="number"
                className={`form-control ${
                  productStorageModalErrors.balanceStock ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>
                {productStorageModalErrors?.balanceStock}
              </span>
            </div>
          </div>
        </Modal.Body>
        {productStorageModalData?.loading ? (
          <Modal.Footer>
            <FadeLoader
              color="#4e73df"
              loading={productStorageModalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => closeModalProductStorage()}
            >
              Tutup
            </Button>
            <Button variant="primary" onClick={() => saveModalProductStorage()}>
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      <Modal show={trayModalData?.visible} onHide={() => closeModalTray()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`Pilih Tray untuk keseluruhan Paket ${trayModalData?.packageName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Pilih Tray untuk seluruh produk di dalam paket ini dan cek
            ketersediaan mutasi nanti.
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Lot Tersedia</b>
              </label>
              {trays?.length === undefined || trays?.length < 1 ? (
                <FadeLoader
                  color="#4e73df"
                  loading
                  size={12}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <select
                  name="warehouseInstrumentTrayId"
                  value={trayModalData?.warehouseInstrumentTrayId}
                  onChange={(e) =>
                    setTrayModalData({
                      ...trayModalData,
                      warehouseInstrumentTrayId: e.target.value,
                    })
                  }
                  className={`form-control ${
                    trayModalErrors?.warehouseInstrumentTrayId
                      ? "is-invalid"
                      : ""
                  } `}
                >
                  <option value="">----Pilih Tray Tersedia----</option>
                  {trays.map((item, index) => (
                    <option key={index} value={item?.objectId}>
                      {item?.name ? item?.name : ""}
                    </option>
                  ))}
                </select>
              )}

              <span style={{ color: "red" }}>
                {trayModalErrors?.warehouseInstrumentTrayId}
              </span>
            </div>
          </div>
        </Modal.Body>
        {trayModalData?.loading ? (
          <Modal.Footer>
            <div className="d-sm-flex align-items-center justify-content-between">
            <FadeLoader
              color="#4e73df"
              loading={trayModalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <span>Mencari lot yang sesuai dengan tray untuk setiap produk...</span>
            </div>
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModalTray()}>
              Tutup
            </Button>
            <Button variant="primary" onClick={() => saveModalTray()}>
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

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(DeliveryOrderInstrument);
