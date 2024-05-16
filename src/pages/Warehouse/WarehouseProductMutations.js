import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faShareSquare,
  faArrowAltCircleUp,
} from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehouseProductMutationsData,
  getWarehouseStorageData,
  getWarehouseProductLotsData,
} from "../../parse/warehouse";
import {
  createNewWarehouseProductMutation,
  transferWarehouseProduct,
} from "../../parse/warehouse/product_mutation";
import { getWarehouseProductStoragesData } from "../../parse/warehouse/product_storage";
import CardProductStorage from "../../components/card/CardProductStorage";
import {
  WarehouseProductMutationDefaultActions,
  WarehouseProductMutationImplantActions,
  WarehouseProductMutationTypes,
} from "../../constants/warehouse_product_mutations";
import { getWarehouseProductById } from "../../parse/warehouse/product";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  warehouseStorage: null,
  warehouseProductLot: null,
  newWarehouseProductLotName: "",
  newProductLot: false,
  type: "",
  value: "",
};
const defaultTransferModalData = {
  visible: false,
  loading: false,
  objectId: null,
  warehouseStorage: null,
  destinationWarehouseStorage: null,
  warehouseProductLot: null,
  value: "",
};
const defaultModalErrors = {
  warehouseStorage: "",
  destinationWarehouseStorage: "",
  warehouseProductLot: "",
  type: "",
  value: "",
};

const defaultModalBalances = {
  balanceStock: null,
  balanceOnDelivery: null,
};

function WarehouseProductMutations() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [productList, setProductList] = useState([]);
  const [productStorageList, setProductStorageList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [filterStorageId, setFilterStorageId] = useState(null);
  const [productLotList, setProductLotList] = useState([]);
  const [productLotData, setProductLotData] = useState(null);

  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);
  const [modalBalances, setModalBalances] = useState(defaultModalBalances);
  const [mutationActions, setMutationActions] = useState([]);

  const [transferModalData, setTransferModalData] = useState(
    defaultTransferModalData,
  );
  const [transferStorageList, setTransferStorageList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params?.id, params?.lotId]);

  useEffect(() => {
    if (filterStorageId === null) {
      return;
    }
    fetchData();
  }, [filterStorageId]);

  useEffect(() => {
    if (
      !(
        params?.lotId === undefined ||
        params?.lotId === null ||
        productLotList?.length === undefined ||
        productLotList?.length < 1
      )
    ) {
      const found = productLotList.find(
        ({ objectId }) => objectId === params?.lotId,
      );
      if (found) {
        setProductLotData(found);
        return;
      }
    }
    setProductLotData(null);
  }, [productLotList]);

  useEffect(() => {
    if (
      productData?.category === undefined ||
      productData?.category === null ||
      productData?.category === ""
    ) {
      setMutationActions([]);
      return;
    }
    if (parseInt(productData?.category) === 1) {
      setMutationActions(WarehouseProductMutationImplantActions);
    } else {
      setMutationActions(WarehouseProductMutationDefaultActions);
    }
  }, [productData]);

  useEffect(() => {
    if (
      modalData.warehouseStorage === null ||
      modalData.warehouseProductLot === null ||
      modalData.newProductLot
    ) {
      setModalBalances(defaultModalBalances);
      return;
    }

    fetchProductStorageBalancesData(
      modalData?.warehouseStorage,
      modalData?.warehouseProductLot,
    );
  }, [
    modalData.warehouseStorage,
    modalData.warehouseProductLot,
    modalData.newProductLot,
  ]);

  useEffect(() => {
    if (
      storageList?.length === undefined ||
      storageList?.length < 1 ||
      transferModalData.warehouseStorage === null
    ) {
      setTransferStorageList([]);
      return;
    }
    try {
      let newArray = [];
      for (let s of storageList) {
        if (s?.objectId !== transferModalData.warehouseStorage) {
          newArray.push(s);
        }
      }
      setTransferStorageList(newArray);
    } catch (e) {
      console.error(e);
    }
  }, [transferModalData.warehouseStorage]);

  useEffect(() => {
    if (
      transferModalData.warehouseStorage === null ||
      transferModalData.warehouseProductLot === null
    ) {
      return;
    }

    fetchProductStorageBalancesData(
      transferModalData?.warehouseStorage,
      transferModalData?.warehouseProductLot,
    );
  }, [
    transferModalData.warehouseStorage,
    transferModalData.warehouseProductLot,
  ]);

  let fetchData = async () => {
    setLoading(true);
    const productData = await getWarehouseProductById(params.id);
    console.log("productData", productData);
    setProductData(productData);
    const storageRes = await getWarehouseStorageData();
    setStorageList(storageRes);
    ////console.log("getWarehouseProductMutationsData", params.id, params.lotId);
    const result = await getWarehouseProductMutationsData(
      params.id,
      params.lotId,
      filterStorageId,
    );
    setProductList(result);
    const productStorageRes = await getWarehouseProductStoragesData(
      params.id,
      filterStorageId,
      params.lotId,
    );
    setProductStorageList(productStorageRes);
    const productLotRes = await getWarehouseProductLotsData(params.id);
    setProductLotList(productLotRes);
    setLoading(false);
  };

  const fetchProductStorageBalancesData = async (
    warehouseStorageId,
    warehouseProductLotId,
  ) => {
    const productStorageRes = await getWarehouseProductStoragesData(
      params.id,
      warehouseStorageId,
      warehouseProductLotId,
    );
    if (
      productStorageRes === undefined ||
      productStorageRes?.length === undefined ||
      productStorageRes?.length < 1
    ) {
      setModalBalances({
        balanceStock: 0,
        balanceOnDelivery: 0,
      });
    } else {
      setModalBalances({
        balanceStock: productStorageRes[0]?.balanceStock,
        balanceOnDelivery: productStorageRes[0]?.balanceOnDelivery,
      });
    }
  };

  /*const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus data? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteWarehouseTypeEntry(id);
        if (result) {
          fetchData();
        }
      }
    } catch (error) {
      //console.log(error);
    }
  };*/

  const saveModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;

    if (modalData?.warehouseStorage === null) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        warehouseStorage: "Isian Gudang wajib diisi",
      };
    }
    if (
      (!modalData?.newProductLot && modalData?.warehouseProductLot === null) ||
      (modalData?.newProductLot &&
        modalData?.newWarehouseProductLotName?.length < 3)
    ) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        warehouseStorage: "Isian Lot Produk wajib diisi",
      };
    }
    if (modalData?.type === "" || modalData?.type?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, type: "Isikan tipe mutasi yang benar" };
    }
    if (modalData?.value === "" || isNaN(parseInt(modalData?.value))) {
      isComplete = false;
      newErrors = { ...newErrors, value: "Isikan angka yang benar" };
    }
    if (
      !modalData?.newProductLot &&
      ((modalData.type === WarehouseProductMutationTypes[1] &&
        modalBalances.balanceStock < modalData.value) ||
        (modalData.type === WarehouseProductMutationTypes[2] &&
          modalBalances.balanceOnDelivery < modalData.value))
    ) {
      isComplete = false;
      newErrors = { ...newErrors, value: "Angka melebihi maksimal" };
    }
    //console.log("new mutation", modalData, newErrors);
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });

      const body = {
        warehouseStorageId: modalData?.warehouseStorage,
        warehouseProductId: params.id,
        warehouseProductLotId: modalData?.newProductLot
          ? null
          : modalData?.warehouseProductLot,
        type: modalData?.type,
        num: parseInt(modalData?.value),
        category: parseInt(productData?.category),
        newWarehouseProductLotName: modalData?.newProductLot
          ? modalData?.newWarehouseProductLotName
          : null,
      };
      let result = await createNewWarehouseProductMutation(body);
      if (result) {
        fetchData();
        setModalData(defaultModalData);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  const saveTransferModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;

    if (transferModalData?.warehouseStorage === null) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        warehouseStorage: "Isian Gudang Asal wajib diisi",
      };
    }
    if (transferModalData?.destinationWarehouseStorage === null) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        destinationWarehouseStorage: "Isian Gudang Tujuan wajib diisi",
      };
    }
    if (transferModalData?.warehouseProductLot === null) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        warehouseStorage: "Isian Lot Produk wajib diisi",
      };
    }
    if (
      transferModalData?.value === "" ||
      isNaN(parseInt(transferModalData?.value))
    ) {
      isComplete = false;
      newErrors = { ...newErrors, value: "Isikan angka yang benar" };
    }
    if (modalBalances.balanceStock < transferModalData.value) {
      isComplete = false;
      newErrors = { ...newErrors, value: "Angka melebihi maksimal" };
    }
    //console.log("new transfer", transferModalData, newErrors);
    setModalErrors(newErrors);

    if (isComplete) {
      setTransferModalData({ ...transferModalData, loading: true });
      let result = await transferWarehouseProduct(
        transferModalData?.warehouseStorage,
        transferModalData?.destinationWarehouseStorage,
        params.id,
        transferModalData?.warehouseProductLot,
        parseInt(transferModalData?.value),
        parseInt(productData?.category),
      );
      if (result) {
        fetchData();
        setTransferModalData(defaultTransferModalData);
      } else {
        setTransferModalData({ ...transferModalData, loading: false });
      }
    }
  };

  const openNewMutationModal = () => {
    setModalBalances(defaultModalBalances);
    setModalErrors(defaultModalErrors);
    setModalData({ ...defaultModalData, visible: true });
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalBalances(defaultModalBalances);
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };

  const openNewTransferModal = () => {
    setModalBalances(defaultModalBalances);
    setModalErrors(defaultModalErrors);
    setTransferModalData({ ...defaultTransferModalData, visible: true });
  };

  const closeTransferModal = () => {
    if (!transferModalData?.loading) {
      setModalBalances(defaultModalBalances);
      setModalErrors(defaultModalErrors);
      setTransferModalData(defaultTransferModalData);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Catatan Mutasi Stok</h1>
        <div className="d-sm-flex flex-1 mb-0 align-items-center justify-content-between">
          <button
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mx-3"
            onClick={() => openNewMutationModal()}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Tambah Mutasi
          </button>
          <button
            className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm"
            onClick={() => openNewTransferModal()}
          >
            <FontAwesomeIcon
              icon={faShareSquare}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Transfer
          </button>
        </div>
      </div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="warehouseProductLot"
          value={params?.lotId}
          onChange={(e) =>
            navigate(
              `/warehouse-product-mutations/${params?.id}/${e.target.value}`,
            )
          }
          className="form-control"
        >
          <option value="">----Semua Lot Produk----</option>
          {productLotList.map((item, index) => (
            <option key={index} value={item?.objectId}>
              {`Lot ${item?.name}`}
            </option>
          ))}
        </select>

        <select
          name="warehouseProductStorage"
          value={filterStorageId}
          onChange={(e) => setFilterStorageId(e.target.value)}
          className="form-control ml-20"
        >
          <option value="">----Semua Region----</option>
          {storageList.map((item, index) => (
            <option key={index} value={item?.objectId}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>
      {loading ||
      productStorageList?.length === undefined ||
      productStorageList?.length < 1 ? null : (
        <div className="row">
          {productStorageList.map((item, index) => (
            <CardProductStorage
              key={index}
              title={item?.warehouseStorage?.name}
              balanceStock={item?.balanceStock}
              balanceOnDelivery={item?.balanceOnDelivery}
              balancePending={item?.balancePending}
              balanceMarketing={item?.balanceMarketing}
              balanceService={item?.balanceService}
              numLots={item?.productLots?.length}
              color="info"
            />
          ))}
        </div>
      )}

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {`${
              productData
                ? `${
                    productData?.category
                      ? WarehouseTypeCategories[parseInt(productData?.category)]
                      : ""
                  } -- ${productData?.name}`
                : "Loading..."
            }${
              productLotData === null || productLotData?.name === undefined
                ? ""
                : ` -- Lot ${productLotData?.name}`
            }`}
          </h6>
        </div>
        <div className="card-body">
          {loading ? (
            <FadeLoader
              color="#4e73df"
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Gudang</th>
                    <th>Lot</th>
                    <th>Jenis</th>
                    <th>Mutasi</th>
                    <th>Stock</th>
                    <th>On-Delivery</th>
                    <th>Pending</th>
                    <th>Service</th>
                    <th>Marketing</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Tanggal</th>
                    <th>Gudang</th>
                    <th>Lot</th>
                    <th>Jenis</th>
                    <th>Mutasi</th>
                    <th>Stock</th>
                    <th>On-Delivery</th>
                    <th>Pending</th>
                    <th>Service</th>
                    <th>Marketing</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{new Date(p.createdAt).toLocaleString("id-ID")}</td>
                        <td>
                          {p?.warehouseStorage?.name
                            ? p?.warehouseStorage?.name
                            : ""}
                        </td>
                        <td>
                          {p?.warehouseProductLot
                            ? p?.warehouseProductLot?.name
                            : ""}
                        </td>
                        <td>
                          <div
                            className={
                              p?.numOutDelivery > 0 ||
                              p?.numOutNextOrder > 0 ||
                              p?.numOutService > 0 ||
                              p?.numOutMarketing > 0 ||
                              p?.numOutBroken > 0
                                ? p?.type === "Transfer Out"
                                  ? "text-yellow-highlight"
                                  : "text-danger-highlight"
                                : p?.type === "Transfer In"
                                  ? "text-info-highlight"
                                  : "text-primary-highlight"
                            }
                          >
                            {p.type}
                          </div>
                        </td>
                        <td>
                          <div
                            className={
                              p?.numOutDelivery > 0 ||
                              p?.numOutNextOrder > 0 ||
                              p?.numOutService > 0 ||
                              p?.numOutMarketing > 0 ||
                              p?.numOutBroken > 0
                                ? p?.type === "Transfer Out"
                                  ? "text-yellow-highlight"
                                  : "text-danger-highlight"
                                : p?.type === "Transfer In"
                                  ? "text-info-highlight"
                                  : "text-primary-highlight"
                            }
                          >
                            {p?.numInSupplier ? <p>{p.numInSupplier}</p> : null}
                            {p?.numInReturn ? <p>{p.numInReturn}</p> : null}
                            {p?.numInMarketing ? (
                              <p>{p.numInMarketing}</p>
                            ) : null}
                            {p?.numInService ? <p>{p.numInService}</p> : null}
                            {p?.numOutDelivery ? (
                              <p>{p?.numOutDelivery}</p>
                            ) : null}
                            {p?.numOutService ? (
                              <p>{p?.numOutService}</p>
                            ) : null}
                            {p?.numOutNextOrder ? (
                              <p>{p?.numOutNextOrder}</p>
                            ) : null}
                            {p?.numOutMarketing ? (
                              <p>{p?.numOutMarketing}</p>
                            ) : null}
                            {p?.numOutBroken ? <p>{p?.numOutBroken}</p> : null}
                          </div>
                        </td>
                        <td>{p.balanceStock}</td>
                        <td>{p.balanceOnDelivery}</td>
                        <td>{p.balancePending}</td>
                        <td>{p.balanceService}</td>
                        <td>{p.balanceMarketing}</td>
                        <td>
                          {p?.deliveryOrder ? (
                            p?.deliveryOrder?.objectId ? (
                              <p>
                                <Link
                                  to={`/order/delivery-order/${p?.deliveryOrder?.objectId}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  Lihat DO
                                </Link>
                              </p>
                            ) : null
                          ) : null}
                          {p?.deliveryOrderImplant ? (
                            p?.deliveryOrderImplant?.objectId ? (
                              <p>
                                <Link
                                  to={`/order/delivery-order-implant/${p?.deliveryOrderImplant?.objectId}`}
                                  className="btn btn-secondary btn-sm"
                                >
                                  DO Implant
                                </Link>
                              </p>
                            ) : null
                          ) : null}
                          {p?.deliveryOrderInstrument ? (
                            p?.deliveryOrderInstrument?.objectId ? (
                              <p>
                                <Link
                                  to={`/order/delivery-order-instrument/${p?.deliveryOrderInstrument?.objectId}`}
                                  className="btn btn-secondary btn-sm"
                                >
                                  DO Instrument
                                </Link>
                              </p>
                            ) : null
                          ) : null}
                          {p?.deliveryOrderDelivery ? (
                            p?.deliveryOrderDelivery?.objectId ? (
                              <p>
                                <Link
                                  to={`/tracking/order-delivery/${p?.deliveryOrderDelivery?.objectId}`}
                                  className="btn btn-info btn-sm"
                                >
                                  Delivery
                                </Link>
                              </p>
                            ) : null
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal show={modalData?.visible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData?.objectId ? "Edit Mutasi" : "Tambah Mutasi"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit Mutasi produk berikut ini`
              : "Tambahkan Mutasi produk dengan keterangan berikut ini"}
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Gudang</b>
              </label>
              <select
                name="warehouseStorage"
                value={
                  modalData?.warehouseStorage
                    ? modalData?.warehouseStorage?.objectId
                    : ""
                }
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    warehouseStorage: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.warehouseStorage ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {storageList?.length === undefined || storageList?.length < 1
                  ? null
                  : storageList.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseStorage}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Lot Produk</b>
              </label>{" "}
              <button
                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm mx-1"
                onClick={() =>
                  setModalData((modalData) => ({
                    ...modalData,
                    newProductLot: !modalData.newProductLot,
                  }))
                }
              >
                <FontAwesomeIcon
                  icon={faArrowAltCircleUp}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                {modalData?.newProductLot ? "Lot yang Ada" : "Lot Baru"}
              </button>
              {modalData.newProductLot ? (
                <input
                  name="newWarehouseProductLotName"
                  placeholder="Isi lot produk baru"
                  value={modalData?.newWarehouseProductLotName}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      newWarehouseProductLotName: e.target.value,
                    })
                  }
                  type={"text"}
                  className={`form-control ${
                    modalErrors?.warehouseProductLot ? "is-invalid" : ""
                  } `}
                />
              ) : (
                <select
                  name="warehouseProductLot"
                  value={
                    modalData?.warehouseProductLot
                      ? modalData?.warehouseProductLot?.objectId
                      : ""
                  }
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      warehouseProductLot: e.target.value,
                    })
                  }
                  className={`form-control ${
                    modalErrors.warehouseProductLot ? "is-invalid" : ""
                  } `}
                >
                  <option value="">----Pilih----</option>
                  {productLotList.map((item, index) => (
                    <option key={index} value={item?.objectId}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              )}
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseProductLot}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Jenis</b>
              </label>
              <select
                name="type"
                value={modalData?.type ? modalData?.type : ""}
                onChange={(e) =>
                  setModalData({ ...modalData, type: e.target.value })
                }
                className={`form-control ${
                  modalErrors.type ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {modalData?.newProductLot ? (
                  <option key={0} value={WarehouseProductMutationTypes[0]}>
                    {WarehouseProductMutationTypes[0]}
                  </option>
                ) : (
                  mutationActions.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                )}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.type}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Angka</b>
                {modalData?.warehouseStorage === null ||
                modalData?.warehouseProductLot === null ||
                modalBalances?.balanceStock === null ||
                modalBalances?.balanceOnDelivery === null
                  ? ""
                  : `\n(Saldo Stock ${modalBalances?.balanceStock}, Saldo On-Delivery ${modalBalances?.balanceOnDelivery})`}
              </label>
              <input
                name="value"
                placeholder="Isi dengan angka"
                value={modalData?.value}
                onChange={(e) =>
                  setModalData({ ...modalData, value: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.value ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.value}</span>
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
            <Button
              disabled={
                (!modalData.newProductLot &&
                  (modalBalances.balanceStock === null ||
                    modalBalances.balanceOnDelivery === null)) ||
                isNaN(modalData.value) ||
                modalData.value < 1
              }
              variant="primary"
              onClick={() => saveModalData()}
            >
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      <Modal
        show={transferModalData?.visible}
        onHide={() => closeTransferModal()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer Stock Antar Gudang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Transfer stock produk sesuai lot antar gudang sebagai berikut.</p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Gudang Asal</b>
              </label>
              <select
                name="warehouseStorage"
                value={
                  transferModalData?.warehouseStorage
                    ? transferModalData?.warehouseStorage?.objectId
                    : ""
                }
                onChange={(e) =>
                  setTransferModalData({
                    ...transferModalData,
                    warehouseStorage: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.warehouseStorage ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {storageList?.length === undefined || storageList?.length < 1
                  ? null
                  : storageList.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseStorage}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Gudang Tujuan</b>
              </label>
              <select
                name="destinationWarehouseStorage"
                value={
                  transferModalData?.destinationWarehouseStorage
                    ? transferModalData?.destinationWarehouseStorage?.objectId
                    : ""
                }
                onChange={(e) =>
                  setTransferModalData({
                    ...transferModalData,
                    destinationWarehouseStorage: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.destinationWarehouseStorage ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {transferStorageList.map((item, index) => (
                  <option key={index} value={item?.objectId}>
                    {item?.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.destinationWarehouseStorage}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Lot Produk</b>
              </label>
              <select
                name="type"
                value={
                  transferModalData?.warehouseProductLot
                    ? transferModalData?.warehouseProductLot?.objectId
                    : ""
                }
                onChange={(e) =>
                  setTransferModalData({
                    ...transferModalData,
                    warehouseProductLot: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.warehouseProductLot ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {productLotList.map((item, index) => (
                  <option key={index} value={item?.objectId}>
                    {item?.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseProductLot}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Angka</b>
                {transferModalData?.warehouseStorage === null ||
                transferModalData?.warehouseProductLot === null ||
                modalBalances?.balanceStock === null
                  ? ""
                  : `\n(maksimal ${modalBalances?.balanceStock})`}
              </label>
              <input
                name="value"
                placeholder="Isi dengan angka"
                value={transferModalData?.value}
                onChange={(e) =>
                  setTransferModalData({
                    ...transferModalData,
                    value: e.target.value,
                  })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.value ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.value}</span>
            </div>
          </div>
        </Modal.Body>
        {transferModalData?.loading ? (
          <Modal.Footer>
            <FadeLoader
              color="#4e73df"
              loading={transferModalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeTransferModal()}>
              Tutup
            </Button>
            <Button
              disabled={
                modalBalances.balanceStock === null ||
                isNaN(transferModalData.value) ||
                transferModalData.value < 1
              }
              variant="primary"
              onClick={() => saveTransferModalData()}
            >
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default WarehouseProductMutations;
