import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FadeLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { WarehouseInstrumentTrayModel } from "../../models/warehouse";
import { createUpdateWarehouseInstrumentTrayEntry, getWarehouseInstrumentTrays } from "../../parse/warehouse/instrument_trays";

function WarehouseInstrumentTrays(props) {
  const { currentUser, privileges } = props;

  const [trays, setTrays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState(WarehouseInstrumentTrayModel);
  const [modalErrors, setModalErrors] = useState(WarehouseInstrumentTrayModel);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getWarehouseInstrumentTrays();
      if (result === undefined || result === null) {
        setTrays([]);
      } else {
        setTrays(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setModalErrors(WarehouseInstrumentTrayModel);
    setModalData({ ...WarehouseInstrumentTrayModel, visible: true });
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(WarehouseInstrumentTrayModel);
      setModalData(WarehouseInstrumentTrayModel);
    }
  };

  const setModal = (data) => {
    setModalErrors(WarehouseInstrumentTrayModel);
    setModalData({
      ...WarehouseInstrumentTrayModel,
      ...data,
      visible: true,
    });
  };

  const saveModalData = async () => {
    let newErrors = WarehouseInstrumentTrayModel;
    let isComplete = true;

    if (modalData?.name === "" || modalData?.name?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Nama Tray wajib diisi" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        modalData?.objectId
          ? "Yakin hendak mengedit instrument tray ini?"
          : "Yakin hendak membuat instrument tray baru?",
      );
      if (!confirm) {
        return;
      }
      setModalData({ ...modalData, loading: true });
      let result = await createUpdateWarehouseInstrumentTrayEntry(modalData?.objectId, modalData?.name, modalData?.colorHex);
      if (result) {
        fetchData();
        setModalErrors(WarehouseInstrumentTrayModel);
        setModalData(WarehouseInstrumentTrayModel);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Instrument Tray</h1>
        <button
          onClick={() => openNewModal()}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="creatinguser mr-2" />
          Tambah Instrument Tray
        </button>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Instrument Tray
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
                    <th width="50%">Nama</th>
                    <th>Color Hex</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th width="50%">Nama</th>
                    <th>Color Hex</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {trays
                    ? trays.map((p, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{p?.name}</td>
                            <td>{p?.colorHex}</td>
                          <td>
                            <p>
                              <button
                                onClick={() => setModal(p)}
                                className="btn btn-primary btn-sm mr-1"
                              >
                                Edit
                              </button>
                            </p>

                           
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal show={modalData?.visible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData?.objectId ? "Edit Instrument Tray" : "Tambah Instrument Tray"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit Instrument Tray berikut ini`
              : "Tambahkan Instrument Tray baru"}
          </p>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nama Tray</b>
              </label>
              <input
                name="name"
                placeholder="Isi nama tray"
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
                <b>Color Hex</b>
              </label>
              <input
                name="name"
                placeholder="Isi kode hexadecimal warna tray tersebut"
                value={modalData?.colorHex}
                onChange={(e) =>
                  setModalData({ ...modalData, colorHex: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.colorHex ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.colorHex}</span>
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
              disabled={modalData?.price === ""}
              variant="primary"
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  privileges: store.userState.privileges,
});

export default connect(mapStateToProps, null)(WarehouseInstrumentTrays);
