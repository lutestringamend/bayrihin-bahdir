import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { faNotesMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { email_regex, phone_regex, username_regex } from "../../constants";
import { convertDateISOStringtoDisplayDateTime } from "../../utils";
import { DocumentsModelData } from "../../models/documents";
import {
  createUpdateDocumentEntry,
  deleteDocumentEntry,
  getDocumentsByName,
  getDocumentsData,
} from "../../parse/documents";
import { convertBase64 } from "../../utils/file";
import { createAndSaveParseFile } from "../../parse/file";

const defaultModalData = {
  visible: false,
  loading: false,
  ...DocumentsModelData,
};

function Documents(props) {
  const { currentUser, accountRoles, privileges } = props;
  const timeoutRef = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(DocumentsModelData);
  const [tempFile, setTempFile] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (searchText === null || searchText === "") {
      fetchDocuments();
      setSearchList([]);
      return;
    }
    timeoutRef.current = setTimeout(searchDocuments, 500);
  }, [searchText]);

  useEffect(() => {
    console.log("tempFile", tempFile);
  }, [tempFile]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await getDocumentsData(20);
      if (result === undefined || result === null) {
        setData([]);
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  let searchDocuments = async () => {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    const result = await getDocumentsByName(searchText);
    setSearchList(result ? result : []);
    setLoading(false);
  };

  const handleDelete = async (objectId, name) => {
    try {
      const confirm = window.confirm(
        `Apa Anda yakin hendak menghapus dokumen "${name}"?`,
      );
      if (confirm) {
        let result = await deleteDocumentEntry(objectId);
        if (result) {
          fetchDocuments();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openNewUserModal = () => {
    setModalErrors(DocumentsModelData);
    setModalData({ ...defaultModalData, visible: true });
    setTempFile(null);
  };

  const setDocumentModal = (p) => {
    setModalData({
      visible: true,
      ...p,
    });
    setTempFile(null);
    setModalErrors(DocumentsModelData);
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(DocumentsModelData);
      setModalData(defaultModalData);
    }
  };

  const saveModalData = async () => {
    let newErrors = DocumentsModelData;
    let isComplete = true;

    if (modalData?.name === "" || modalData?.name?.length < 3) {
      isComplete = false;
      newErrors = { ...newErrors, name: "Nama Dokumen wajib diisi" };
    }
    setModalErrors(newErrors);

    if (isComplete) {
      const confirm = window.confirm(
        "Pastikan semua data dan foto sudah terisi dengan benar. Aksi ini akan mengupdate dokumen.",
      );
      if (!confirm) {
        return;
      }
      setModalData({ ...modalData, loading: true });
      let parseFile = null;
      if (tempFile) {
        let base64 = await convertBase64(tempFile);
        parseFile = await createAndSaveParseFile(tempFile?.name, base64);
        console.log("parseFile created", parseFile);
      }
      let result = createUpdateDocumentEntry(
        modalData?.objectId,
        modalData?.name,
        modalData?.description,
        parseFile,
      );
      if (result) {
        fetchDocuments();
        setModalData(defaultModalData);
        setModalErrors(DocumentsModelData);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Dokumen</h1>
        <button
          onClick={() => openNewUserModal()}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <FontAwesomeIcon
            icon={faNotesMedical}
            className="creatinguser mr-2"
          />
          Tambah Dokumen Baru
        </button>
      </div>
      <div className="d-sm-flex mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-white"
            placeholder="Cari nama dokumen"
            aria-label="Search"
            aria-describedby="basic-addon2"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="input-group-append">
            <button
              onClick={() => searchDocuments()}
              className="btn btn-primary"
              type="button"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {searchText
              ? `Hasil pencarian "${searchText}"`
              : "Daftar Dokumen berdasarkan urutan terakhir dibuat"}
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
                    <th>Nama Dokumen</th>
                    <th>Tanggal Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th>Nama Dokumen</th>
                    <th>Tanggal Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {searchText
                    ? searchList.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td>
                              {item?.createdAt
                                ? convertDateISOStringtoDisplayDateTime(
                                    item?.createdAt,
                                    true,
                                    true,
                                  )
                                : ""}
                            </td>

                            <td>
                              <p>
                                <button
                                  onClick={() => setDocumentModal(item)}
                                  className="btn btn-info btn-sm mr-1"
                                >
                                  Detil
                                </button>
                              </p>

                              <p>
                                <button
                                  onClick={() =>
                                    handleDelete(item?.objectId, item?.name)
                                  }
                                  className="btn btn-danger btn-sm mr-1"
                                >
                                  Hapus
                                </button>
                              </p>
                            </td>
                          </tr>
                        );
                      })
                    : data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td>
                              {item?.createdAt
                                ? convertDateISOStringtoDisplayDateTime(
                                    item?.createdAt,
                                    true,
                                    true,
                                  )
                                : ""}
                            </td>
                            <td>
                              <p>
                                <button
                                  onClick={() => setDocumentModal(item)}
                                  className="btn btn-secondary btn-sm mr-1"
                                >
                                  Detil
                                </button>
                              </p>

                              <p>
                                <button
                                  onClick={() =>
                                    handleDelete(item?.objectId, item?.name)
                                  }
                                  className="btn btn-danger btn-sm mr-1"
                                >
                                  Hapus
                                </button>
                              </p>
                            </td>
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
            {modalData?.objectId ? "Edit Data Dokumen" : "Tambah Dokumen Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Isi detil dokumen berikut dengan lengkap`
              : "Tambahkan dokumen baru dengan data berikut ini"}
          </p>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nama Dokumen</b>
              </label>
              <input
                name="name"
                placeholder="Isi nama dokumen"
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
                <b>Deskripsi Dokumen</b>
              </label>
              <textarea
                name="description"
                value={modalData?.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                type={"text"}
                rows="3"
                className={`form-control ${
                  modalErrors?.description ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.description}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Foto Dokumen</b>
              </label>
              <p>
                {tempFile ? (
                  <img
                    style={{ width: "70%", height: "50%" }}
                    src={URL.createObjectURL(tempFile)}
                    alt="File baru"
                  />
                ) : modalData?.photo && modalData?.photo?.url ? (
                  <img
                    style={{ width: "70%", height: "50%" }}
                    src={modalData?.photo?.url}
                    alt={modalData?.name}
                  />
                ) : (
                  "Belum ada foto"
                )}
              </p>
              <p>
                <input
                  type="file"
                  name={modalData?.photo?.url ? "Ganti Foto" : "Unggah Foto"}
                  onChange={(e) => setTempFile(e.target.files[0])}
                />
              </p>
              {tempFile ? (
                <button
                  onClick={() => setTempFile(null)}
                  className="btn btn-info btn-sm"
                >
                  Reset Foto
                </button>
              ) : null}

              <span style={{ color: "red" }}>{modalErrors?.photo}</span>
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
  accountRoles: store.userState.accountRoles,
  privileges: store.userState.privileges,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserAccountRoles,
      updateReduxUserPrivileges,
      clearReduxUserData,
    },
    dispatch,
  );*/

export default connect(mapStateToProps, null)(Documents);
