import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FadeLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { TrackingEventModel } from "../../models/tracking";
import { getTrackingEvents } from "../../parse/tracking";
import { createUpdateTrackingUpdateEntry } from "../../parse/tracking/events";

function TrackingEvents(props) {
  const { currentUser, privileges } = props;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState(TrackingEventModel);
  const [modalErrors, setModalErrors] = useState(TrackingEventModel);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getTrackingEvents();
      if (result === undefined || result === null) {
        setEvents([]);
      } else {
        setEvents(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleStatus = async (objectId, isActive) => {
    try {
      const confirm = window.confirm(
        isActive
          ? "Apa Anda yakin ingin mematikan event ini?"
          : "Apa Anda yakin ingin mengaktifkan event ini?",
      );
      if (confirm) {
        //console.log("updateUserStatus", objectId, isActive);
        const result = await createUpdateTrackingUpdateEntry(
          objectId,
          null,
          isActive,
        );
        if (result) {
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openNewModal = () => {
    setModalErrors(TrackingEventModel);
    setModalData({ ...TrackingEventModel, visible: true });
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(TrackingEventModel);
      setModalData(TrackingEventModel);
    }
  };

  const setModal = (data) => {
    setModalErrors(TrackingEventModel);
    setModalData({
      ...TrackingEventModel,
      ...data,
      visible: true,
    });
  };

  const saveModalData = async () => {
    let newErrors = TrackingEventModel;
    let isComplete = true;

    if (modalData?.name === "" || modalData?.name?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Nama Event wajib diisi" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        modalData?.objectId
          ? "Yakin hendak mengedit tracking event ini?"
          : "Yakin hendak membuat tracking event baru?",
      );
      if (!confirm) {
        return;
      }
      setModalData({ ...modalData, loading: true });
      let result = await createUpdateTrackingUpdateEntry(
        modalData?.objectId ? modalData?.objectId : null,
        modalData?.name,
      );
      if (result) {
        fetchData();
        setModalErrors(TrackingEventModel);
        setModalData(TrackingEventModel);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Tracking Event</h1>
        <button
          onClick={() => openNewModal()}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="creatinguser mr-2" />
          Tambah Tracking Event
        </button>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Tracking Event
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
                    <th width="70%">Nama</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th width="70%">Nama</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {events
                    ? events.map((p, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{p?.name}</td>

                          <td>
                            <p>
                              <button
                                onClick={() => setModal(p)}
                                className="btn btn-primary btn-sm mr-1"
                              >
                                Edit
                              </button>
                            </p>

                            <p>
                              <button
                                onClick={() =>
                                  handleStatus(p?.objectId, !p?.isActive)
                                }
                                className={`btn ${
                                  p?.isActive ? "btn-danger" : "btn-info"
                                } btn-sm mr-1`}
                              >
                                {p?.isActive ? "Matikan" : "Aktifkan"}
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
            {modalData?.objectId ? "Edit Data User" : "Tambah User Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit Event berikut ini`
              : "Tambahkan Event baru"}
          </p>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nama Event</b>
              </label>
              <input
                name="name"
                placeholder="Isi nama event"
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

export default connect(mapStateToProps, null)(TrackingEvents);
