import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehousePackageData } from "../../parse/warehouse";
import {
  createWarehousePackageEntry,
  deleteWarehousePackageEntry,
  updateWarehousePackageEntry,
} from "../../parse/warehouse/packages";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import {
  WAREHOUSE_UNIT_FULL_SET,
  WAREHOUSE_UNIT_PARTIAL_SET,
  WarehousePackageUnitGrouping,
} from "../../constants/warehouse_packages";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
  name: "",
  unitPackageGrouping: "",
};
const defaultModalErrors = {
  name: "",
  category: "",
  unitPackageGrouping: "",
};

function WarehousePackages() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params?.category]);

  let fetchData = async () => {
    setLoading(true);
    const result = await getWarehousePackageData(params?.category);
    setProductList(result);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus data? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteWarehousePackageEntry(id);
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
    if (modalData?.category === "" || parseInt(modalData?.category) < 1) {
      isComplete = false;
      newErrors = { ...newErrors, category: "Kategori belum diisi" };
    }
    if (modalData?.name === "" || modalData?.name < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Isikan nama Tipe yang benar" };
    }
    if (
      modalData?.category === 3 &&
      modalData?.name.toLowerCase() !== WAREHOUSE_UNIT_FULL_SET &&
      modalData?.name.toLowerCase() !== WAREHOUSE_UNIT_PARTIAL_SET &&
      (modalData?.unitPackageGrouping === undefined ||
        modalData?.unitPackageGrouping === null ||
        modalData?.unitPackageGrouping === "")
    ) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        unitPackageGrouping: "Pilih tipe grouping paket",
      };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = null;
      if (modalData?.objectId) {
        result = await updateWarehousePackageEntry(
          modalData?.objectId,
          modalData?.category,
          modalData?.name,
          modalData?.unitPackageGrouping,
        );
      } else {
        result = await createWarehousePackageEntry(
          modalData?.category,
          modalData?.name,
          modalData?.unitPackageGrouping,
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
    let unitPackageGrouping = "0";
    if (p?.isPartOfUnitFullSetPackage) {
      if (p?.isPartOfUnitPartialSetPackage) {
        unitPackageGrouping = "3";
      } else {
        unitPackageGrouping = "1";
      }
    } else if (p?.isPartOfUnitPartialSetPackage) {
      unitPackageGrouping = "2";
    }
    setModalData({ visible: true, ...p, unitPackageGrouping });
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
        <h1 className="h3 mb-0 text-gray-800">
          Daftar Paket untuk Request Order
        </h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Paket
        </a>
      </div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params?.category}
          onChange={(e) =>
            navigate(
              parseInt(e.target.value) > 0
                ? `/warehouse-packages/${e.target.value}`
                : "/warehouse-packages",
            )
          }
          className="form-control"
        >
          <option value=""></option>
          {WarehouseTypeCategories.map((item, index) => (
            <option key={index} value={index}>
              {index === 0 ? "----Semua Kategori----" : item}
            </option>
          ))}
        </select>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{`Paket untuk Request Order${
            params?.category === undefined || params?.category === null
              ? ""
              : ` --- ${WarehouseTypeCategories[params.category]}`
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
                    <th>Kategori</th>
                    <th>Nama</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th>Kategori</th>
                    <th>Nama</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{WarehouseTypeCategories[p?.category]}</td>
                        <td>{p.name}</td>
                        {parseInt(p?.category) === 3 &&
                        (p?.name.toLowerCase() === WAREHOUSE_UNIT_FULL_SET ||
                          p?.name.toLowerCase() ===
                            WAREHOUSE_UNIT_PARTIAL_SET) ? (
                          <th></th>
                        ) : (
                          <th>
                            <Link
                              to={`/warehouse-package-products/${p.objectId}`}
                              className="btn btn-primary btn-sm mr-1"
                            >
                              Isi Paket
                            </Link>
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
                        )}
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
              ? `Edit Paket berikut ini`
              : "Tambahkan Paket dengan keterangan berikut ini"}
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
                  setModalData({
                    ...modalData,
                    category: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.category ? "is-invalid" : ""
                } `}
              >
                {WarehouseTypeCategories.map((item, index) => (
                  <option key={index} value={index}>
                    {item}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.category}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nama</b>
              </label>
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

          {parseInt(modalData?.category) === 3 &&
          modalData?.name.toLowerCase() !== WAREHOUSE_UNIT_FULL_SET &&
          modalData?.name.toLowerCase() !== WAREHOUSE_UNIT_PARTIAL_SET ? (
            <div className="row">
              <div className="col-lg-10">
                <label>
                  <b>Grouping Kategori</b>
                </label>
                <select
                  name="unitPackageGrouping"
                  value={
                    modalData?.unitPackageGrouping
                      ? modalData?.unitPackageGrouping
                      : ""
                  }
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      unitPackageGrouping: e.target.value,
                    })
                  }
                  className={`form-control ${
                    modalErrors.unitPackageGrouping ? "is-invalid" : ""
                  } `}
                >
                  {WarehousePackageUnitGrouping.map((item, index) => (
                    <option key={index} value={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <span style={{ color: "red" }}>
                  {modalErrors?.unitPackageGrouping}
                </span>
              </div>
            </div>
          ) : null}
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

export default WarehousePackages;
