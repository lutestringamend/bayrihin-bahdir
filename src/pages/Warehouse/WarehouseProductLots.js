import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseProductLotsData } from "../../parse/warehouse";
import {
  createWarehouseProductLotEntry,
  deleteWarehouseProductLotEntry,
  updateWarehouseProductLotEntry,
} from "../../parse/warehouse/product_lot";
import { getWarehouseProductById } from "../../parse/warehouse/product";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import { hasPrivilege } from "../../utils/account";
import { ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD } from "../../constants/account";
import { getWarehouseInstrumentTrays } from "../../parse/warehouse/instrument_trays";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  name: "",
  remark: "",
  warehouseInstrumentTrayId: null,
};
const defaultModalErrors = {
  name: "",
  warehouseInstrumentTrayId: "",
};

function WarehouseProductLots(props) {
  const { privileges } = props;
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [productData, setProductData] = useState(null);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);
  const [trays, setTrays] = useState(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (productData === null || productData?.category === undefined || productData?.category === null || productData?.category !== 2) {
      return;
    }
    fetchTrays();
  }, [productData]);

  let fetchData = async () => {
    setLoading(true);
    const productData = await getWarehouseProductById(params.id);
    console.log("productData", productData);
    setProductData(productData);
    const result = await getWarehouseProductLotsData(params.id);
    setProductList(result);
    setLoading(false);
  };

  let fetchTrays = async () => {
    const result = await getWarehouseInstrumentTrays();
    if (!(result === undefined || result === null)) {
      setTrays(result);
    }
  }

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus data? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteWarehouseProductLotEntry(id);
        if (result) {
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;
    if (modalData?.name === "" || modalData?.name < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Isikan nama lot yang benar" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = null;
      if (modalData?.objectId) {
        result = await updateWarehouseProductLotEntry(
          modalData?.objectId,
          modalData?.name,
          modalData?.remark,
          modalData?.warehouseInstrumentTrayId,
        );
      } else {
        result = await createWarehouseProductLotEntry(
          params.id,
          modalData?.name,
          modalData?.remark,
          modalData?.warehouseInstrumentTrayId,
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

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Lot Produk</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Lot
        </a>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {productData
              ? `${
                  productData?.category
                    ? WarehouseTypeCategories[productData?.category]
                    : productData?.warehouseType?.name
                } -- ${productData?.name}`
              : "Loading..."}
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
                    <th>No</th>
                    <th>Lot/SN</th>
                    {productData?.category === 2 ? <th>Tray</th> : null}
                    <th>Kondisi / Lokasi</th>
                    <th>Terakhir Update</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th>Lot/SN</th>
                    {productData?.category === 2 ? <th>Tray</th> : null}
                    <th>Kondisi / Lokasi</th>
                    <th>Terakhir Update</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p?.name}</td>
                        {productData?.category === 2 ? (
                          <td>{p?.warehouseInstrumentTray ? p?.warehouseInstrumentTray?.name : ""}</td>
                        ) : null}
                        <td>{p?.remark}</td>
                        <td>
                          <p>
                            {p?.updatedAt
                              ? new Date(p?.updatedAt).toLocaleString("id-ID")
                              : ""}
                          </p>
                        </td>
                        <th>
                          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD) ? (
                            <Link
                            to={`/warehouse-product-mutations/${params.id}/${p.objectId}`}
                            className="btn btn-primary btn-sm mr-1"
                          >
                            Mutasi
                          </Link>
                          ) : null}
                          
                          <button
                            onClick={() =>
                              setModalData({ visible: true, ...p })
                            }
                            className="btn btn-info btn-sm mx-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.objectId)}
                            className="btn btn-danger btn-sm"
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
            {modalData?.objectId ? "Edit Lot Produk" : "Tambah Lot Produk"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit keterangan Lot Produk berikut ini`
              : "Tambahkan Lot Produk dengan keterangan berikut ini"}
          </p>
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
          {productData?.category === 2 ? (
            <div className="row">
              <div className="col-lg-10">
                <label>Tray</label>
                <select
                  name="warehouseInstrumentTrayId"
                  value={
                    modalData?.warehouseInstrumentTrayId
                      ? modalData?.warehouseInstrumentTrayId
                      : ""
                  }
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      warehouseInstrumentTrayId: e.target.value,
                    })
                  }
                  className={`form-control ${
                    modalErrors.warehouseInstrumentTrayId ? "is-invalid" : ""
                  } `}
                >
                  <option value="">----Pilih Tray----</option>
                  {trays ? trays.map((item, index) => (
                    <option key={index} value={item?.objectId}>
                      {item?.name}
                    </option>
                  )) : null}
                </select>
                <span style={{ color: "red" }}>{modalErrors?.warehouseInstrumentTrayId}</span>
              </div>
            </div>
          ) : null}

          <div className="row">
            <div className="col-lg-10">
              <label>Kondisi / Lokasi</label>
              <textarea
                name="remark"
                value={modalData?.remark}
                onChange={(e) =>
                  setModalData({ ...modalData, remark: e.target.value })
                }
                type={"text"}
                rows="3"
                className={`form-control ${
                  modalErrors?.remark ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.remark}</span>
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
  privileges: store.userState.privileges,
});

export default connect(mapStateToProps, null)(WarehouseProductLots);
