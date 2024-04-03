import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseStorageData } from "../../parse/warehouse";
import { getHospitalsData } from "../../parse/order";
import {
  createUpdateHospitalEntry,
  deleteHospitalEntry,
} from "../../parse/order/hospitals";
import { PROVINCE_LIST } from "../../constants/address";

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  warehouseStorageId: null,
  code: "",
  name: "",
  province: "",
  city: "",
  address: "",
  latlng: "",
};
const defaultModalErrors = {
  warehouseStorageId: null,
  code: "",
  name: "",
  province: "",
  city: "",
  address: "",
  latlng: "",
};

function Hospitals() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [storages, setStorages] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params?.storageId]);

  let fetchData = async () => {
    setLoading(true);
    const storages = await getWarehouseStorageData();
    setStorages(storages);
    const result = await getHospitalsData(params?.storageId);
    setProductList(result);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus entry Hospital? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteHospitalEntry(id);
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
    if (
      modalData?.warehouseStorageId === null ||
      modalData?.warehouseStorageId === ""
    ) {
      isComplete = false;
      newErrors = { ...newErrors, warehouseStorageId: "Region harus diisi" };
    }
    if (modalData?.code === "" || modalData?.code < 3) {
      isComplete = false;
      newErrors = { ...newErrors, code: "Isikan Hospital Code yang benar" };
    }
    if (modalData?.name === "" || modalData?.name < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Isikan nama Hospital yang benar" };
    }
    if (modalData?.province === "" || modalData?.province < 3) {
      isComplete = false;
      newErrors = { ...newErrors, province: "Provinsi harus diisi" };
    }
    if (modalData?.city === "" || modalData?.city < 3) {
      isComplete = false;
      newErrors = { ...newErrors, city: "Kota / Kabupaten harus diisi" };
    }
    if (modalData?.address === "" || modalData?.address < 5) {
      isComplete = false;
      newErrors = { ...newErrors, address: "Alamat harus diisi" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = await createUpdateHospitalEntry(
        modalData?.objectId ? modalData?.objectId : "",
        modalData?.warehouseStorageId,
        modalData?.code,
        modalData?.name,
        modalData?.province,
        modalData?.city,
        modalData?.address,
        modalData?.latlng,
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
        <h1 className="h3 mb-0 text-gray-800">Daftar Rumah Sakit</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Rumah Sakit
        </a>
      </div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="storage"
          value={params?.storageId}
          onChange={(e) =>
            navigate(
              e.target.value === undefined ||
                e.target.value === null ||
                e.target.value === ""
                ? "/hospitals"
                : `/hospitals/${e.target.value}`,
            )
          }
          className="form-control"
        >
          <option key={0} value="">
            ----Filter berdasarkan Region----
          </option>
          {storages.map((item, index) => (
            <option key={index + 1} value={item?.objectId}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Rumah Sakit berdasarkan code
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
                    <th>Code</th>
                    <th width="30%">Nama</th>
                    <th>Region</th>
                    <th width="30%">Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Code</th>
                    <th width="30%">Nama</th>
                    <th>Region</th>
                    <th width="30%">Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{p?.code}</td>
                        <td>{p?.name}</td>
                        <td>
                          {p?.warehouseStorage ? p?.warehouseStorage?.name : ""}
                        </td>
                        <td>
                          <p>{p?.address}</p>
                          <p>{`${p?.city}, ${p?.province}`}</p>
                        </td>
                        <th>
                          <a
                            href="#"
                            onClick={() =>
                              setModalData({
                                visible: true,
                                ...p,
                                warehouseStorageId:
                                  p?.warehouseStorage?.objectId,
                              })
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
            {modalData?.objectId ? "Edit Rumah Sakit" : "Tambah Rumah Sakit"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit keterangan Rumah Sakit berikut ini`
              : "Tambahkan Rumah Sakit dengan keterangan berikut ini"}
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Region</b>
              </label>
              <select
                name="warehouseStorageId"
                value={modalData?.warehouseStorageId}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    warehouseStorageId: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.warehouseStorageId ? "is-invalid" : ""
                } `}
              >
                <option value="">---Pilih Region---</option>
                {storages.map((item, index) => (
                  <option key={index} value={item?.objectId}>
                    {item?.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseStorageId}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Hospital Code</label>
              <input
                name="code"
                value={modalData?.code}
                onChange={(e) =>
                  setModalData({ ...modalData, code: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.code ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.code}</span>
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
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Provinsi</b>
              </label>
              <select
                name="warehouseStorageId"
                value={modalData?.province}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    province: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.province ? "is-invalid" : ""
                } `}
              >
                <option value="">---Pilih Provinsi---</option>
                {PROVINCE_LIST.map((item, index) => (
                  <option key={index} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.province}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Kota / Kabupaten</label>
              <input
                name="city"
                value={modalData?.city}
                onChange={(e) =>
                  setModalData({ ...modalData, city: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.city ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.city}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Alamat Lengkap</label>
              <textarea
                name="address"
                value={modalData?.address}
                onChange={(e) =>
                  setModalData({ ...modalData, address: e.target.value })
                }
                type={"text"}
                rows="3"
                className={`form-control ${
                  modalErrors?.address ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.address}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10">
              <label>Koordinat (latitude, longitude)</label>
              <input
                name="latlng"
                value={modalData?.latlng}
                onChange={(e) =>
                  setModalData({ ...modalData, latlng: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.latlng ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.latlng}</span>
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

export default Hospitals;
