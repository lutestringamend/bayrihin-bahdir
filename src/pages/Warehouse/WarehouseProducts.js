import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehouseProductData,
  getWarehouseTypeData,
} from "../../parse/warehouse";
import { postWarehouseProductItem } from "../../parse/warehouse/product";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  warehouseType: null,
  catalogNo: "",
  name: "",
};
const defaultModalErrors = {
  warehouseType: "",
  catalogNo: "",
  name: "",
};

function WarehouseProducts() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, []);

  let fetchData = async () => {
    setLoading(true);
    const result = await getWarehouseProductData();
    const typeRes = await getWarehouseTypeData();
    setTypeList(typeRes);
    setProductList(result);
    setLoading(false);
  };

  const setModalType = (id) => {
    let warehouseType = typeList.find(({ objectId }) => id === objectId);
    if (!(warehouseType === undefined || warehouseType === null)) {
      setModalData({ ...modalData, warehouseType });
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
    if (modalData?.warehouseType === null) {
      isComplete = false;
      newErrors = { ...newErrors, warehouseType: "Isian Tipe wajib diisi" };
    }
    if (modalData?.catalogNo === "" || modalData?.catalogNo?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, catalogNo: "Isian Catalog No wajib diisi" };
    }
    if (modalData?.name === "" || modalData?.name?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Isian Nama wajib diisi" };
    }
    console.log("newErrors", newErrors);
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = await postWarehouseProductItem(
        modalData?.objectId,
        modalData?.warehouseType?.objectId,
        modalData?.catalogNo,
        modalData?.name,
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
        <h1 className="h3 mb-0 text-gray-800">Daftar Produk Warehouse</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Produk Baru
        </a>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Produk Aktif
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
                    <th>Catalog No</th>
                    <th>Nama</th>
                    <th>Tipe</th>
                    <th>Saldo Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Catalog No</th>
                    <th>Nama</th>
                    <th>Tipe</th>
                    <th>Saldo Stok</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{p.catalogNo}</td>
                        <td>{p.name}</td>
                        <td>
                          {p.warehouseType?.name ? p.warehouseType?.name : ""}
                        </td>
                        <td>
                          <Link
                            to={`/portal/warehouse-product-mutations/${p.objectId}`}
                            className="btn btn-primary btn-sm mr-1"
                          >
                            {p.balance < 0
                              ? `(${Math.abs(p.balance)})`
                              : p.balance}
                          </Link>
                        </td>
                        <th>
                          <a
                            href="#"
                            onClick={() =>
                              setModalData({ visible: true, ...p })
                            }
                            className="btn btn-info btn-sm mr-1"
                          >
                            Edit
                          </a>
                        </th>
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
            {modalData?.objectId
              ? `Edit Produk ${modalData?.objectId}`
              : "Tambah Produk"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit data produk berikut ini`
              : "Tambahkan Produk baru dengan keterangan berikut ini"}
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>Tipe</label>
              <select
                name="warehouseType"
                value={
                  modalData?.warehouseType
                    ? modalData?.warehouseType?.objectId
                    : ""
                }
                onChange={(e) => setModalType(e.target.value)}
                className={`form-control ${
                  modalErrors.warehouseType ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih----</option>
                {typeList?.length === undefined || typeList?.length < 1
                  ? null
                  : typeList.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.warehouseType}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Catalog No</label>
              <input
                name="catalogNo"
                value={modalData?.catalogNo}
                onChange={(e) =>
                  setModalData({ ...modalData, catalogNo: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.catalogNo ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.catalogNo}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Nama</label>
              <input
                name="name"
                value={modalData?.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.name ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.name}</span>
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

export default WarehouseProducts;
