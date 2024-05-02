import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getUserData,
  registerNewUser,
  updateUserEntry,
  updateUserStatus,
} from "../../parse/user";
import { USER_GENDERS, USER_ROLES } from "../../constants/user";
import {
  updateReduxUserAccountRoles,
  updateReduxUserPrivileges,
  clearReduxUserData,
} from "../../utils/user";
import { getAccountRoles } from "../../parse/account";
import { email_regex, phone_regex, username_regex } from "../../constants";
import { generatePassword } from "../../utils/account";

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  accountRoleId: null,
  password: "",
  email: "",
  username: "",
  phoneNumber: "",
  fullName: "",
  gender: "",
  birthdate: "",
};
const defaultModalErrors = {
  accountRoleId: "",
  email: "",
  username: "",
  phoneNumber: "",
  fullName: "",
  gender: "",
  birthdate: "",
};

function UserManagement(props) {
  const { currentUser, accountRoles, privileges } = props;
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (accountRoles?.length === undefined || accountRoles?.length < 1) {
      fetchAccountRoles();
    }
  }, [accountRoles]);

  const fetchAccountRoles = async () => {
    setLoading(true);
    try {
      const result = await getAccountRoles();
      if (result === undefined || result === null) {
        props.updateReduxUserAccountRoles([]);
      } else {
        props.updateReduxUserAccountRoles(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const result = await getUserData();
      if (result === undefined || result === null) {
        setUserList([]);
      } else {
        setUserList(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  let handleStatus = async (objectId, isActive) => {
    try {
      const confirm = window.confirm(
        isActive
          ? "Apa Anda yakin ingin mematikan akun user ini?"
          : "Apa Anda yakin ingin mengaktifkan akun user ini?",
      );
      if (confirm) {
        console.log("updateUserStatus", objectId, isActive);
        const result = await updateUserStatus(
          objectId,
          isActive ? !isActive : false,
        );
        if (result) {
          if (currentUser?.objectId === objectId && isActive) {
            props.clearReduxUserData();
            return;
          }
          getUsers();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openNewUserModal = () => {
    let password = generatePassword();
    setModalErrors(defaultModalErrors);
    setModalData({ ...defaultModalData, password, visible: true });
  };

  const setUserModal = (p) => {
    setModalData({
      visible: true,
      ...p,
      password: "",
      accountRoleId: p?.accountRole
        ? p?.accountRole?.objectId
          ? p?.accountRole?.objectId
          : ""
        : "",
    });
    setModalErrors(defaultModalErrors);
  };

  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };

  const saveModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;

    if (modalData?.accountRoleId === null || modalData?.accountRoleId === "") {
      isComplete = false;
      newErrors = { ...newErrors, accountRoleId: "Role wajib diisi" };
    }
    if (modalData?.username === "") {
      isComplete = false;
      newErrors = { ...newErrors, username: "Username wajib diisi" };
    } else if (!username_regex.test(modalData?.username)) {
      isComplete = false;
      newErrors = {
        ...newErrors,
        username: "Username tidak boleh mengandung spasi",
      };
    }
    if (modalData?.email === "") {
      isComplete = false;
      newErrors = { ...newErrors, email: "Email wajib diisi" };
    } else if (!email_regex.test(modalData?.email)) {
      isComplete = false;
      newErrors = { ...newErrors, email: "Isi alamat email yang benar" };
    }
    if (modalData?.phoneNumber === "") {
      isComplete = false;
      newErrors = { ...newErrors, phoneNumber: "No Telepon wajib diisi" };
    } else if (!phone_regex.test(modalData?.phoneNumber)) {
      isComplete = false;
      newErrors = { ...newErrors, phoneNumber: "Isi nomor telepon yang benar" };
    }
    if (modalData?.birthdate !== "") {
      try {
        let birthDate = new Date(modalData?.birthdate);
        let time = birthDate.getTime();
        if (time <= 0) {
          isComplete = false;
          newErrors = {
            ...newErrors,
            birthdate: "Isi tanggal lahir sesuai format YYYY-MM-DD",
          };
        }
      } catch (e) {
        console.error(e);
        isComplete = false;
        newErrors = {
          ...newErrors,
          birthdate: "Isi tanggal lahir sesuai format YYYY-MM-DD",
        };
      }
    }

    setModalErrors(newErrors);

    if (isComplete) {
      let result =
        modalData?.objectId === null
          ? await registerNewUser(
              modalData?.username,
              modalData?.password,
              modalData?.email,
              modalData?.fullName,
              modalData?.gender,
              modalData?.birthdate,
              modalData?.phoneNumber,
              modalData?.accountRoleId,
            )
          : await updateUserEntry(
              modalData?.objectId,
              modalData?.username,
              modalData?.email,
              modalData?.fullName,
              modalData?.gender,
              modalData?.birthdate,
              modalData?.phoneNumber,
            );
      if (result) {
        getUsers();
        setModalData(defaultModalData);
        setModalErrors(defaultModalErrors);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User Management</h1>
        <button
          onClick={() => openNewUserModal()}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <FontAwesomeIcon icon={faUser} className="creatinguser mr-2" />
          Tambah User Baru
        </button>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Daftar User</h6>
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
                    <th width="20%">Username</th>
                    <th width="30%">Nama Lengkap</th>
                    <th width="30%">Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th width="20%">Username</th>
                    <th width="30%">Nama Lengkap</th>
                    <th width="30%">Role</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {userList.map((user) => {
                    return (
                      <tr>
                        <td>{user?.username}</td>
                        <td>{user?.fullName}</td>
                        <td>
                          {user?.accountRole
                            ? user?.accountRole?.name
                              ? USER_ROLES.find(
                                  ({ name }) =>
                                    name === user?.accountRole?.name,
                                )?.caption
                              : ""
                            : ""}
                        </td>

                        <td>
                          <p>
                            <button
                              onClick={() => setUserModal(user)}
                              className="btn btn-primary btn-sm mr-1"
                            >
                              Edit User
                            </button>
                          </p>
                          {user?.accountRole && user?.accountRole?.objectId ? (
                            <p>
                              <Link
                                to={`/account-privilege/${user?.accountRole?.objectId}`}
                                className="btn btn-secondary btn-sm mr-1"
                              >
                                Edit Role
                              </Link>
                            </p>
                          ) : null}

                          <p>
                            <button
                              onClick={() =>
                                handleStatus(user?.objectId, user?.isActive)
                              }
                              className={`btn ${
                                user?.isActive ? "btn-danger" : "btn-info"
                              } btn-sm mr-1`}
                            >
                              {user?.isActive ? "Matikan" : "Aktifkan"}
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
            {modalData?.objectId ? "Edit Data User" : "Tambah User Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.objectId
              ? `Edit data user berikut ini`
              : "Tambahkan user baru dengan data yang lengkap"}
          </p>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Role*</b>
              </label>
              <select
                name="accountRoleId"
                disabled={
                  modalData?.objectId && modalData?.accountRoleId !== ""
                }
                value={modalData?.accountRoleId ? modalData?.accountRoleId : ""}
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    accountRoleId: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.accountRoleId ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih Role----</option>
                {accountRoles?.length === undefined || accountRoles?.length < 1
                  ? null
                  : accountRoles.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name
                          ? USER_ROLES.find(({ name }) => name === item?.name)
                              ?.caption
                          : ""}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.accountRoleId}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Username*</b>
              </label>
              <input
                name="username"
                placeholder="Isi username tanpa mengandung spasi"
                value={modalData?.username}
                onChange={(e) =>
                  setModalData({ ...modalData, username: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.username ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.username}</span>
            </div>
          </div>

          {modalData?.objectId === null && modalData?.password !== "" ? (
            <div className="row">
              <div className="col-lg-10">
                <label>
                  <b>Password (mohon copy paste sebelum melanjutkan)</b>
                </label>
                <input
                  name="password"
                  placeholder=""
                  value={modalData?.password}
                  type={"text"}
                  className="form-control"
                />
              </div>
            </div>
          ) : null}

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Email*</b>
              </label>
              <input
                name="email"
                placeholder="Isi email aktif"
                value={modalData?.email}
                onChange={(e) =>
                  setModalData({ ...modalData, email: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.email ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.email}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nomor Telepon*</b>
              </label>
              <input
                name="phoneNumber"
                placeholder="Isi nomor telepon aktif"
                value={modalData?.phoneNumber}
                onChange={(e) =>
                  setModalData({ ...modalData, phoneNumber: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.phoneNumber ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.phoneNumber}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Nama Lengkap</b>
              </label>
              <input
                name="fullName"
                placeholder="Isi nama lengkap"
                value={modalData?.fullName}
                onChange={(e) =>
                  setModalData({ ...modalData, fullName: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.fullName ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.fullName}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Jenis Kelamin</b>
              </label>
              <select
                name="gender"
                value={modalData?.gender ? modalData?.gender : ""}
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
                <option value="">----Pilih Jenis Kelamin----</option>
                {USER_GENDERS?.length === undefined || USER_GENDERS?.length < 1
                  ? null
                  : USER_GENDERS.map((item, index) => (
                      <option key={index} value={item?.name}>
                        {item?.caption}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>{modalErrors?.gender}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Tanggal Lahir</b>
              </label>
              <input
                name="birthdate"
                placeholder="Format YYYY-MM-DD"
                value={modalData?.birthdate}
                onChange={(e) =>
                  setModalData({ ...modalData, birthdate: e.target.value })
                }
                type={"text"}
                className={`form-control ${
                  modalErrors?.birthdate ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.birthdate}</span>
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

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserAccountRoles,
      updateReduxUserPrivileges,
      clearReduxUserData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(UserManagement);
