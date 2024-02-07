import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseStorageData } from "../../parse/warehouse";
import {
  createWarehouseStorageEntry,
  deleteWarehouseStorageEntry,
  updateWarehouseStorageEntry,
} from "../../parse/warehouse/storages";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  name: "",
};
const defaultModalErrors = {
  name: "",
};

function WarehouseStorages() {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, []);

  let fetchData = async () => {
    setLoading(true);
    const result = await getWarehouseStorageData();
    setProductList(result);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus data? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteWarehouseStorageEntry(id);
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
      newErrors = { ...newErrors, name: "Isikan nama Storage yang benar" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = null;
      if (modalData?.objectId) {
        result = await updateWarehouseStorageEntry(
          modalData?.objectId,
          modalData?.name,
        );
      } else {
        result = await createWarehouseStorageEntry(modalData?.name);
      }
      if (result) {
        fetchData();
        setModalData(defaultModalData);
      } else {
        setModalData({...modalData, loading: false});
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
        <h1 className="h3 mb-0 text-gray-800">Daftar Region</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Storage
        </a>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Region Aktif</h6>
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
                    <th>Id</th>
                    <th>Nama</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Id</th>
                    <th>Nama</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{p.name}</td>
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
            {modalData?.objectId ? "Edit Storage" : "Tambah Storage"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit keterangan Storage berikut ini`
              : "Tambahkan Storage dengan keterangan berikut ini"}
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


export default WarehouseStorages;
