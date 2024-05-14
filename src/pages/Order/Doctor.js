import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faArrowAltCircleLeft, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  overhaulReduxOrderHospitals,
} from "../../utils/order";
import { getHospitalsData } from "../../parse/order";
import { BIRTHDATE_PICKER_FORMAT } from "../../constants/strings";
import { DoctorModel } from "../../models/doctor";
import { createUpdateDoctorEntry, getDoctorById } from "../../parse/order/doctors";
import { DOCTOR_GENDERS } from "../../constants/doctors";
import { createUpdateDoctorHospitalEntry, getDoctorHospitals } from "../../parse/order/doctorhospitals";
import SearchTextInput from "../../components/textinput/SearchTextInput";

/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  hospitalId: null,
};
const defaultModalErrors = {
  hospitalId: null,
};



function Doctor(props) {
  const {
    currentUser,
    hospitals,
    warehouseStorages,
  } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(DoctorModel);
  const [doctorHospitals, setDoctorHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(DoctorModel);
  const [modalData, setModalData] = useState(defaultModalData);
  const [modalError, setModalError] = useState(defaultModalErrors);

  useEffect(() => {
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    console.log("doctorHospitals", doctorHospitals);
  }, [doctorHospitals]);






  const fetchHospitals = async () => {
    const result = await getHospitalsData();
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderHospitals(result);
    }
  };

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    const result = await getDoctorById(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data Dokter");
      setLoading(false);
    } else {
      setData(result);
      fetchDoctorHospitalsData();
    }
  };

  const fetchDoctorHospitalsData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const result = await getDoctorHospitals(params?.id);
    if (result === undefined || result === null) {
      setError("Tidak bisa mengambil data rumah sakit yang terhubung dengan Dokter ini");
    } else {
      setDoctorHospitals(result);
    }
    setLoading(false);
  }

  const switchStatus = async (item) => {
    try {
      const confirm = window.confirm(
        item?.isActive ? "Yakin untuk non-aktifkan Rumah Sakit untuk Dokter ini?" : "Yakin untuk mengaktifkan kembali Rumah Sakit untuk dokter ini?"
      );
      if (confirm) {
        let result = await createUpdateDoctorHospitalEntry(item?.objectId, params?.id, item?.hospitals?.objectId, !item?.isActive);
        if (result) {
          fetchDoctorHospitalsData();
        }
      }
    } catch (e) {
      console.error(e);
      setError(e?.toString());
    }
  }

  const openModal = () => {
    setModalData(
      {
        ...defaultModalData,
        visible: true,
      }
    )
  }

  const closeModal = () => {
    setModalData(defaultModalData);
  }

  const saveModalData = async () => {
    if (modalData?.hospitalId === null || modalData?.hospitalId === "") {
      setModalError({
        hospitalId: "Rumah Sakit wajib diisi"
      });
      return;
    }
    setModalError(defaultModalErrors);
    const result = await createUpdateDoctorHospitalEntry(null, params?.id, modalData?.hospitalId, true);
    if (result === undefined || result === null) {
      setModalError({
        hospitalId: "Tidak bisa menambahkan Rumah Sakit"
      });
      return;
    }
    fetchDoctorHospitalsData();
    setModalData(defaultModalData);
  }

  const submit = async () => {
    let newErrors = DoctorModel;
    let isComplete = true;

    if (
      data?.name === null ||
      data?.name === "" || data?.name?.length < 3
    ) {
      newErrors = { ...newErrors, name: "Nama Lengkap harus diisi" };
      isComplete = false;
    }
    if (
      data?.gender === null ||
      data?.gender === ""
    ) {
      newErrors = { ...newErrors, gender: "Jenis Kelamin harus diisi" };
      isComplete = false;
    }
    setErrors(newErrors);

    if (isComplete) {
      const result = await createUpdateDoctorEntry(
        params?.id, data?.name, data?.gender, data?.birthdate, data?.specialization, data?.organization);
      if (result) {
        fetchData();
      }
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Edit Data Dokter</h1>
        <div className="d-sm-flex align-items-center mb-4">
        <button
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => submit()}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Submit
        </button>
        <button
            className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm mx-3"
            onClick={() => fetchData()}
          >
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Reset
          </button>
          </div>
        
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <span style={{ color: "red" }}>{error}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Nama Lengkap</b>
        </label>
        <input
          name="name"
          value={data?.name}
          onChange={(e) =>
            setData({
              ...data,
              name: e.target.value,
            })
          }
          type={"text"}
          className={`form-control ${errors?.name ? "is-invalid" : ""} `}
        />
        <span style={{ color: "red" }}>{errors?.name}</span>
      </div>

      

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Jenis Kelamin</b>
        </label>
        <select
          name="gender"
          value={
            data?.gender
              ? data?.gender
              : ""
          }
          onChange={(e) => {
            setData({
              ...data,
              gender: e.target.value,
            });
          }}
          className={`form-control ${
            errors?.gender ? "is-invalid" : ""
          } `}
        >
          <option value="">----Pilih Jenis Kelamin----</option>
          {DOCTOR_GENDERS?.length === undefined
            ? null
            : DOCTOR_GENDERS.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
        </select>
        <span style={{ color: "red" }}>{errors?.gender}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Tanggal Lahir</b>
        </label>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
          <DateTimePicker
            format={BIRTHDATE_PICKER_FORMAT}
            views={["year", "month", "day"]}
            onChange={(e) =>
              setData({
                ...data,
                birthdate: e.toISOString(),
              })
            }
            value={
              data?.birthdate
                ? dayjs(data?.birthdate)
                : null
            }
            className={`w-100 ${errors?.birthdate ? "is-invalid" : ""} `}
          />
        </LocalizationProvider>
        <span style={{ color: "red" }}>{errors?.birthdate}</span>
        <p />
      </div>


      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Spesialisasi</b>
        </label>
        <input
          name="specialization"
          value={data?.specialization}
          onChange={(e) =>
            setData({
              ...data,
              specialization: e.target.value,
            })
          }
          type={"text"}
          className={`form-control ${errors?.specialization ? "is-invalid" : ""} `}
        />
        <span style={{ color: "red" }}>{errors?.specialization}</span>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Organisasi</b>
        </label>
        <input
          name="organization"
          value={data?.organization}
          onChange={(e) =>
            setData({
              ...data,
              organization: e.target.value,
            })
          }
          type={"text"}
          className={`form-control ${errors?.organization ? "is-invalid" : ""} `}
        />
        <span style={{ color: "red" }}>{errors?.organization}</span>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header d-sm-flex py-3 align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Rumah Sakit yang terhubung dengan Dokter ini
          </h6>
          <button
            className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm mx-3"
            onClick={() => openModal()}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Tambah Rumah Sakit
          </button>
        </div>
        <div className="card-body">
      {loading || data === null ? (
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
              <th>Region</th>
              <th width="40%">Nama</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
            <th>No</th>
              <th>Region</th>
              <th width="40%">Nama</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </tfoot>
          <tbody>
            {doctorHospitals.map((p, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{p?.hospital ? p?.hospital?.warehouseStorage ? p?.hospital?.warehouseStorage?.name : "" : ""}</td>
                  <td>{p?.hospital ? p?.hospital?.name : ""}</td>
                  <td>
                    <div className={p?.isActive ? "text-primary" : "text-danger"}>

                    {p?.isActive ? "Aktif" : "Tidak Aktif"}
                    </div>
                  </td>
                  <th>
                    <button
                      onClick={() => switchStatus(p)}
                      className={`btn ${p?.isActive ? "btn-danger" : "btn-primary"} btn-sm mr-1`}
                    >
                     {p?.isActive ? "Non-Aktifkan" : "Aktifkan"}
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
            Tambah Rumah Sakit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Pilih Rumah Sakit tempat Dokter ini bekerja
          </p>
          <div className="row">
            <div className="col-lg-10">
              <SearchTextInput
                label="Nama Rumah Sakit"
                name="hospitalId"
                value={modalData?.hospitalId}
                error={modalError?.hospitalId}
                defaultOption="----Pilih Rumah Sakit----"
                data={hospitals}
                searchPlaceholder="Cari nama rumah sakit"
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    hospitalId: e.target.value,
                  })
                }
              />
             
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
  currentUser: store.userState.currentUser,
  hospitals: store.orderState.hospitals,
  warehouseStorages: store.orderState.warehouseStorages,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderHospitals,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(Doctor);
