import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseTypeData } from "../../parse/warehouse";
import {
  createWarehouseTypeEntry,
  deleteWarehouseTypeEntry,
  updateWarehouseTypeEntry,
} from "../../parse/warehouse/types";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
  name: "",
};
const defaultModalErrors = {
  name: "",
  category: "",
};

function WarehouseTypes() {
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
    const result = await getWarehouseTypeData(params?.category);
    setProductList(result);
    setLoading(false);
  };

  const handleDelete = async (id) => {
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
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = null;
      if (modalData?.objectId) {
        result = await updateWarehouseTypeEntry(
          modalData?.objectId,
          modalData?.category,
          modalData?.name,
        );
      } else {
        result = await createWarehouseTypeEntry(
          modalData?.category,
          modalData?.name,
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

  /*
   <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Tipe
        </a>
        
 <a
                            href="#"
                            onClick={() =>
                              setModalData({ visible: true, ...p })
                            }
                            className="btn btn-info btn-sm mr-1"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(p.objectId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button>
  */

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Tipe Produk</h1>
      </div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params?.category}
          onChange={(e) =>
            navigate(
              parseInt(e.target.value) > 0
                ? `/warehouse-types/${e.target.value}`
                : "/warehouse-types",
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
          <h6 className="m-0 font-weight-bold text-primary">{`Tipe Produk Terdaftar${
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
                        <th></th>
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
              ? `Edit Tipe produk berikut ini`
              : "Tambahkan Tipe produk dengan keterangan berikut ini"}
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

export default WarehouseTypes;
