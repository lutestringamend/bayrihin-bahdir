import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehousePackageProductData,
} from "../../parse/warehouse";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import {
  createWarehousePackageProductEntry,
  deleteWarehousePackageProductEntry,
  updateWarehousePackageProductEntry,
} from "../../parse/warehouse/package_products";
import { searchWarehouseProductItem } from "../../parse/warehouse/product";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  searching: false,
  objectId: null,
  warehouseProductId: "",
  warehouseProductName: "",
  searchList: [],
  quantity: "",
  notes: "",
};
const defaultModalErrors = {
  warehouseProductId: "",
  quantity: "",
  notes: "",
};

function WarehousePackageProducts() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [productList, setProductList] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    console.log("modalData", modalData);
  }, [modalData]);

  let fetchData = async () => {
    setLoading(true);
    const result = await getWarehousePackageData(null, params?.id);
    setItem(result);
    const list = await getWarehousePackageProductData(params?.id);
    //console.log("list", list);
    setProductList(list);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau mengeluarkan produk dari paket?",
      );
      if (confirmDelete) {
        let result = await deleteWarehousePackageProductEntry(id);
        if (result) {
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchProduct = async () => {
    if (modalData?.warehouseProductName === "") {
      setModalErrors({
        ...modalData,
        warehouseProductId: "Isi dengan nama atau catalog no produk.",
      });
      return;
    }
    setModalErrors({ ...modalErrors, warehouseProductId: "" });
    setModalData({ ...modalData, searching: true });
    const result = await searchWarehouseProductItem(
      item?.category,
      modalData?.warehouseProductName,
    );
    if (
      result === undefined ||
      result?.length === undefined ||
      result?.length < 1
    ) {
      setModalErrors({
        ...modalData,
        warehouseProductId: "Produk tidak ditemukan.",
      });
      setModalData({ ...modalData, searching: false });
    } else {
      setModalData({ ...modalData, searchList: result, searching: false });
    }
  };

  const saveModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;
    if (modalData?.warehouseProductId === "") {
      isComplete = false;
      newErrors = {
        ...newErrors,
        warehouseProductId: "Produk belum ditentukan",
      };
    }
    if (modalData?.quantity === "" || isNaN(parseInt(modalData?.quantity))) {
      isComplete = false;
      newErrors = { ...newErrors, quantity: "Jumlah harus diisi" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = null;
      if (modalData?.objectId) {
        result = await updateWarehousePackageProductEntry(
          modalData?.objectId,
          item,
          modalData?.warehouseProductId,
          modalData?.quantity,
          modalData?.notes,
        );
      } else {
        result = await createWarehousePackageProductEntry(
          item,
          modalData?.warehouseProductId,
          modalData?.quantity,
          modalData?.notes,
        );
      }
      if (result) {
        fetchData();
        setModalData(defaultModalData);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  const setPackageModal = (p) => {
    setModalData({
      visible: true,
      quantity: p?.quantity ? p?.quantity.toString() : "",
      searchList: [],
      warehouseProductId: p?.warehouseProduct
        ? p?.warehouseProduct?.objectId
          ? p?.warehouseProduct?.objectId
          : ""
        : "",
      warehouseProductName: p?.warehouseProduct
        ? p?.warehouseProduct?.name
          ? p?.warehouseProduct?.name
          : ""
        : "",
    });
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
        <h1 className="h3 mb-0 text-gray-800">Daftar Produk dalam Paket</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Masukkan Produk
        </a>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{`${
            item === null || item?.category === undefined
              ? ""
              : `${WarehouseTypeCategories[item?.category]} -- `
          }Paket ${
            item === null || item?.name === undefined ? "" : item?.name
          }`}</h6>
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
                    <th>No</th>
                    <th>Catalog No</th>
                    <th>Nama</th>
                    <th>Qty</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th>Catalog No</th>
                    <th>Nama</th>
                    <th>Qty</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {p?.warehouseProduct
                            ? p?.warehouseProduct?.catalogNo
                            : ""}
                        </td>
                        <td>
                          {p?.warehouseProduct ? p?.warehouseProduct?.name : ""}
                        </td>
                        <td>{p?.quantity}</td>
                        <th>
                          <button
                            onClick={() => setPackageModal(p)}
                            className="btn btn-info btn-sm mr-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.objectId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button>
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
            {modalData?.objectId ? "Edit Tipe" : "Tambah Tipe"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit Setting Produk dalam Paket`
              : "Masukkan Produk ke dalam Paket"}
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Produk</b>
              </label>
              {modalData?.searchList?.length > 0 ? (
                <select
                  name="warehouseProductId"
                  value={modalData?.warehouseProductId?.objectId}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      warehouseProductId: e.target.value,
                    })
                  }
                  className="form-control"
                >
                  <option value="">---Pilih Produk---</option>
                  {modalData?.searchList.map((item, index) => (
                    <option key={index} value={item?.objectId}>
                      {`${item?.catalogNo} - ${item?.name}`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="warehouseProductId"
                  value={modalData?.warehouseProductName}
                  disabled={modalData?.warehouseProductId}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      warehouseProductName: e.target.value,
                    })
                  }
                  placeholder="Ketikkan nama produk atau catalog no (case sensitive)"
                  type={"text"}
                  className={`form-control ${
                    modalErrors?.warehouseProductId ? "is-invalid" : ""
                  } `}
                />
              )}

              <span style={{ color: "red" }}>
                {modalErrors?.warehouseProductId}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              {modalData?.warehouseProductId === "" ? (
                modalData?.searchList?.length === undefined ||
                modalData?.searchList?.length < 1 ? (
                  <Button
                    variant="primary"
                    disabled={modalData?.searching}
                    onClick={() => searchProduct()}
                  >
                    Cari Produk
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setModalData({
                        ...modalData,
                        searchList: [],
                        warehouseProductName: "",
                        warehouseProductId: "",
                      })
                    }
                  >
                    Reset
                  </Button>
                )
              ) : (
                <Button
                  variant="info"
                  onClick={() =>
                    setModalData({
                      ...modalData,
                      searchList: [],
                      warehouseProductId: "",
                      warehouseProductName: "",
                    })
                  }
                >
                  Ganti Produk
                </Button>
              )}
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
                type={"number"}
                className={`form-control ${
                  modalErrors?.quantity ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.quantity}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Catatan</b>
              </label>
              <textarea
                name="notes"
                value={modalData?.notes}
                onChange={(e) =>
                  setModalData({ ...modalData, notes: e.target.value })
                }
                type={"text"}
                rows="3"
                className={`form-control ${
                  modalErrors?.notes ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.notes}</span>
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
              variant="primary"
              disabled={modalData?.searching}
              onClick={() => saveModalData()}
            >
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default WarehousePackageProducts;
