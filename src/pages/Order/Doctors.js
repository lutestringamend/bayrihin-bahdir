import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

//import { getWarehouseStorageData } from "../../parse/warehouse";
import { getDoctorsData } from "../../parse/order";
import {
  createUpdateDoctorEntry,
  deleteDoctorEntry,
  switchDoctorStatus,
} from "../../parse/order/doctors";
import { DOCTOR_GENDERS, DOCTOR_STATUS_OPTIONS } from "../../constants/doctors";

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  name: "",
  gender: "",
  birthdate: "",
};
const defaultModalErrors = {
  name: "",
  gender: "",
  birthdate: "",
};

function Doctors() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  //const [storages, setStorages] = useState([]);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params?.status]);

  useEffect(() => {
    console.log("modalData", modalData);
  }, [modalData]);

  let fetchData = async () => {
    setLoading(true);
    /*const storages = await getWarehouseStorageData();
    setStorages(storages);*/
    const result = await getDoctorsData(params?.status);
    setProductList(result);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus entry Dokter? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        let result = await deleteDoctorEntry(id);
        if (result) {
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const switchStatus = async (id, isActive) => {
    try {
      const confirmStatus = window.confirm(
        isActive
          ? "Yakin ingin mengubah status Dokter ini ke Tidak Aktif?"
          : "Yakin ingin mengubah status Dokter ini ke Aktif?",
      );
      if (confirmStatus) {
        let result = await switchDoctorStatus(id, isActive);
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
      newErrors = { ...newErrors, name: "Isikan nama Dokter yang benar" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });
      let result = await createUpdateDoctorEntry(
        modalData?.objectId ? modalData?.objectId : "",
        modalData?.name ? modalData?.name : "",
        modalData?.gender ? modalData?.gender : null,
        modalData?.birthdate ? modalData?.birthdate : null,
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
        <h1 className="h3 mb-0 text-gray-800">Daftar Dokter</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => setModalData({ ...defaultModalData, visible: true })}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambah Dokter
        </a>
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="status"
          value={params?.status}
          onChange={(e) =>
            navigate(
              e.target.value === undefined ||
                e.target.value === null ||
                e.target.value === ""
                ? "/doctors"
                : `/doctors/${e.target.value}`,
            )
          }
          className="form-control"
        >
          <option key={0} value="">
            ----Filter berdasarkan Status Dokter----
          </option>
          {DOCTOR_STATUS_OPTIONS.map((item, index) => (
            <option key={index + 1} value={item?.value}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Dokter berdasarkan abjad
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
                    <th width="40%">Nama</th>
                    <th>Jenis Kelamin</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th width="40%">Nama</th>
                    <th>Jenis Kelamin</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p?.name}</td>
                        <td>{p?.gender}</td>
                        <td>
                          <button
                            onClick={() =>
                              switchStatus(p?.objectId, p?.isActive)
                            }
                            className={`btn ${
                              p?.isActive ? "btn-primary" : "btn-danger"
                            } btn-sm mr-1`}
                          >
                            {p?.isActive ? "Aktif" : "Tidak Aktif"}
                          </button>
                        </td>
                        <th>
                        <Link
                                to={`/doctor/${p?.objectId}`}
                                className="btn btn-info btn-sm mr-1"
                              >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p?.objectId)}
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
            {modalData?.objectId ? "Edit Dokter" : "Tambah Dokter"}
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
                <b>Region</b>
              </label>
              <select
                name="gender"
                value={modalData?.gender}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    gender: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.gender ? "is-invalid" : ""
                } `}
              >
                <option value="">---Pilih Jenis Kelamin---</option>
                {DOCTOR_GENDERS.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.gender}</span>
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

export default Doctors;
