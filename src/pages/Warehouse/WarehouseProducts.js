import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
  warehouseType: null,
  brand: "",
  catalogNo: "",
  name: "",
};
const defaultModalErrors = {
  category: "",
  warehouseType: "",
  catalogNo: "",
  name: "",
};

function WarehouseProducts() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);
  const [modalTypeList, setModalTypeList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params?.category, params?.type]);

  useEffect(() => {
    if (modalData?.category === null || parseInt(modalData?.category) < 1) {
      setModalTypeList([]);
      return;
    }
    fetchModalTypeList();
  }, [modalData?.category]);

  const fetchModalTypeList = async (category) => {
    const typeRes = await getWarehouseTypeData(
      category ? category : modalData?.category,
    );
    setModalTypeList(typeRes);
    if (category) {
      setModalData({ ...modalData, category });
    } else {
      setModalData(modalData);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const result = await getWarehouseProductData(
      null,
      null,
      params?.type,
      "name",
    );
    const typeRes = await getWarehouseTypeData(
      params?.category ? params?.category : null,
    );
    setTypeList(typeRes);

    try {
      if (params?.category) {
        let newArray = [];
        for (let r of result) {
          if (
            parseInt(r?.warehouseType?.category) === parseInt(params?.category)
          ) {
            newArray.push(r);
          }
        }
        setProductList(newArray);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

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
    if (modalData?.category === null || parseInt(modalData?.category) < 1) {
      isComplete = false;
      newErrors = { ...newErrors, category: "Isian Kategori wajib diisi" };
    }
    if (modalData?.warehouseType === null || modalData?.warehouseType === "") {
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
        modalData?.brand,
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

  const openModalEdit = async (p) => {
    try {
      //await fetchModalTypeList(p?.warehouseType?.category);
      setModalData({
        visible: true,
        ...p,
        category: p?.warehouseType?.category,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };

  const switchType = (e) => {
    if (e?.target?.value) {
      navigate(
        `/portal/warehouse-products/${params?.category}/${e.target.value}`,
      );
    } else {
      navigate(
        `/portal/warehouse-products${
          params?.category === undefined ||
          isNaN(params?.category) ||
          parseInt(params?.category) < 1
            ? ""
            : `/${params?.category}`
        }`,
      );
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

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params.category}
          onChange={(e) =>
            navigate(
              e.target.value === undefined ||
                e.target.value === null ||
                e.target.value === "" ||
                parseInt(e.target.value) < 1
                ? "/portal/warehouse-products"
                : `/portal/warehouse-products/${e.target.value}`,
            )
          }
          className="form-control"
        >
          {WarehouseTypeCategories.map((item, index) => (
            <option key={index} value={index}>
              {index === 0 ? "----Semua Kategori----" : item}
            </option>
          ))}
        </select>

        <select
          name="warehouseType"
          value={params?.type}
          onChange={(e) => switchType(e)}
          className="form-control ml-20"
        >
          <option value="">----Semua Tipe----</option>
          {typeList.map((item, index) => (
            <option key={index} value={item?.objectId}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {`Daftar Produk, berdasarkan abjad${
              params?.category === undefined ||
              isNaN(params?.category) ||
              parseInt(params?.category) < 1
                ? ""
                : ` --- ${WarehouseTypeCategories[params?.category]}`
            }${
              params?.type
                ? ` --- ${
                    typeList.find(({ objectId }) => objectId === params?.type)
                      ?.name
                  }`
                : ""
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
                    <th>Kategori</th>
                    <th>Tipe</th>
                    <th>Merk</th>
                    <th>Cat No</th>
                    <th width="70%">Nama</th>
                    <th>Updated</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Kategori</th>
                    <th>Tipe</th>
                    <th>Merk</th>
                    <th>Cat No</th>
                    <th width="70%">Nama</th>
                    <th>Updated</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {p?.warehouseType
                            ? p?.warehouseType?.category
                              ? WarehouseTypeCategories[
                                  p?.warehouseType?.category
                                ]
                              : ""
                            : ""}
                        </td>
                        <td>
                          {p?.warehouseType
                            ? p?.warehouseType?.name
                              ? p?.warehouseType?.name
                              : ""
                            : ""}
                        </td>
                        <td>{p?.brand}</td>
                        <td>{p?.catalogNo}</td>

                        <td>{p?.name}</td>
                        <td>
                          <p>
                            {p?.updatedAt
                              ? new Date(p?.updatedAt).toLocaleString("id-ID")
                              : ""}
                          </p>
                        </td>
                        <th>
                          <p>
                            <Link
                              to={`/portal/warehouse-product-mutations/${p.objectId}`}
                              className="btn btn-primary btn-sm mr-1"
                            >
                              Mutasi
                            </Link>
                          </p>
                          <p>
                            <Link
                              to={`/portal/warehouse-product-lots/${p.objectId}`}
                              className="btn btn-info btn-sm mr-1"
                            >
                              Lot
                            </Link>
                          </p>
                          <p>
                            <button
                              onClick={() => openModalEdit(p)}
                              className="btn btn-info btn-sm mr-1"
                            >
                              Edit
                            </button>
                          </p>
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
              ? `Edit Produk ${modalData?.name}`
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
              <label>
                <b>Kategori</b>
              </label>
              <select
                name="category"
                value={modalData?.category ? modalData?.category : ""}
                onChange={(e) =>
                  setModalData({ ...modalData, category: e.target.value })
                }
                className={`form-control ${
                  modalErrors.category ? "is-invalid" : ""
                } `}
              >
                {WarehouseTypeCategories.map((item, index) => (
                  <option key={index} value={index}>
                    {index === 0 ? "----Pilih Kategori----" : item}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.category}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Tipe</b>
              </label>
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
                <option value="">----Pilih Tipe----</option>
                {typeList?.length === undefined || typeList?.length < 1
                  ? null
                  : modalTypeList.map((item, index) => (
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
              <label>
                <b>Merk (opsional)</b>
              </label>
              <input
                name="brand"
                value={modalData?.brand}
                onChange={(e) =>
                  setModalData({ ...modalData, brand: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.brand ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.brand}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Catalog No</b>
              </label>
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
              <label>
                <b>Nama</b>
              </label>
              <textarea
                name="name"
                value={modalData?.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                type={"text"}
                row="10"
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
