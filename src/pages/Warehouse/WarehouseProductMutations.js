import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faShareSquare,
  faMap,
} from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehouseProductMutationsData,
  getWarehouseStorageData,
} from "../../parse/warehouse";
import { createWarehouseProductMutationEntry } from "../../parse/warehouse/product_mutation";
import { getWarehouseProductStoragesData } from "../../parse/warehouse/product_storage";
import CardProductStorage from "../../components/card/CardProductStorage";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  warehouseStorage: null,
  type: "",
  value: "",
};
const defaultModalErrors = {
  warehouseStorage: "",
  type: "",
  value: "",
};

function WarehouseProductMutations() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [productStorageList, setProductStorageList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  let fetchData = async () => {
    setLoading(true);
    const storageRes = await getWarehouseStorageData();
    setStorageList(storageRes);
    const result = await getWarehouseProductMutationsData(params.id);
    setProductList(result);
    const productStorageRes = await getWarehouseProductStoragesData(params.id);
    setProductStorageList(productStorageRes);
    setLoading(false);
  };

  const setModalStorage = (id) => {
    let warehouseStorage = storageList.find(({ objectId }) => id === objectId);
    if (!(warehouseStorage === undefined || warehouseStorage === null)) {
      setModalData({ ...modalData, warehouseStorage });
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
      console.log(error);
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
    if (modalData?.type === "" || modalData?.type?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, type: "Isikan tipe mutasi yang benar" };
    }
    if (modalData?.value === "" || isNaN(parseInt(modalData?.value))) {
      isComplete = false;
      newErrors = { ...newErrors, value: "Isikan angka nilai dengan benar" };
    }
    console.log("newErrors", newErrors);
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = await createWarehouseProductMutationEntry(
        params.id,
        modalData?.warehouseStorage?.objectId,
        modalData?.type,
        parseInt(modalData?.value),
      );
      if (result) {
        fetchData();
        setModalData(defaultModalData);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Catatan Mutasi Stok</h1>
        <div className="d-sm-flex flex-1 mb-0 align-items-center justify-content-between">
          <a
            href="#"
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            onClick={() => setModalData({ ...defaultModalData, visible: true })}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Tambah Mutasi
          </a>
          <a
            href="#"
            className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm"
          >
            <FontAwesomeIcon
              icon={faShareSquare}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Transfer
          </a>
        </div>
      </div>
      {productStorageList?.length === undefined ||
      productStorageList?.length < 1 ? null : (
        <div className="row">
          {productStorageList.map((item, index) => (
            <CardProductStorage
              key={index}
              title={item?.warehouseStorage?.name}
              balanceStock={item?.balanceStock}
              balanceOnDelivery={item?.balanceOnDelivery}
              numLots={item?.productLots?.length}
              color="info"
            />
          ))}
        </div>
      )}

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {productList
              ? productList[0]
                ? productList[0]?.warehouseProduct?.name
                  ? productList[0]?.warehouseProduct?.name
                  : `Mutasi Stok Produk id ${params.id}`
                : `Mutasi Stok Produk id ${params.id}`
              : `Mutasi Stok Produk id ${params.id}`}
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
                    <th>Saldo<br />Stock</th>
                    <th>Saldo<br />Delivery</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Tanggal</th>
                    <th>Gudang</th>
                    <th>Lot</th>
                    <th>Jenis</th>
                    <th>Mutasi</th>
                    <th>Saldo<br />Stock</th>
                    <th>Saldo<br />Delivery</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{new Date(p.createdAt).toLocaleString("id-ID")}</td>
                        <td>
                          {p?.warehouseStorage?.name
                              ? p?.warehouseStorage
                                  ?.name
                            : ""}
                        </td>
                        <td>
                          {p?.warehouseProductLot
                            ? p?.warehouseProductLot?.name
                            : ""}
                        </td>
                        <td>{p.type}</td>
                        <td>
                          {p?.numInbound ? 
                            <p>{p.numInbound}</p>
                          : null}
                          {p?.numOutbound ? 
                            <p>{`(${p.numOutbound})`}</p>
                          : null}
                        </td>
                        <td>
                          {p.balanceStock}
                        </td>
                        <td>
                          {p.balanceOnDelivery}
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
              <label>Gudang</label>
              <select
                name="warehouseStorage"
                value={
                  modalData?.warehouseStorage
                    ? modalData?.warehouseStorage?.objectId
                    : ""
                }
                onChange={(e) => setModalStorage(e.target.value)}
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
              <label>Jenis</label>
              <input
                name="type"
                placeholder="Stock, Display dll"
                value={modalData?.type}
                onChange={(e) =>
                  setModalData({ ...modalData, type: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.type ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.type}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Angka</label>
              <input
                name="value"
                placeholder="0 - 99"
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
            <Button variant="primary" onClick={() => saveModalData()}>
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default WarehouseProductMutations;
