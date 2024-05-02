import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faWindowRestore,
} from "@fortawesome/free-regular-svg-icons";

import {
  getAccountRoleEntry,
  updateAccountRoleEntry,
} from "../../parse/account";
import { updateReduxUserPrivileges } from "../../utils/user";
import { ACCOUNT_PRIVILEGES } from "../../constants/account";
import { USER_ROLES } from "../../constants/user";
import RolePrivilegesTable from "../../components/tables/RolePrivilegesTable";

function AccountPrivilegeEdit(props) {
  const { currentUser } = props;
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tempPrivileges, setTempPrivileges] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params]);

  useEffect(() => {
    resetPrivileges();
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("getAccountRoleEntry", params?.id);
      const result = await getAccountRoleEntry(params?.id);
      if (result === undefined || result === null) {
        setError("Tidak bisa mengambil data Role.");
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const resetPrivileges = () => {
    let newPrivileges = [];
    for (let a of ACCOUNT_PRIVILEGES) {
      let privileges = [];
      for (let p of a?.privileges) {
        privileges.push({
          ...p,
          checked: !(
            data?.privileges === undefined ||
            data?.privileges?.length === undefined ||
            data?.privileges.find((e) => e === p?.name) === undefined ||
            data?.privileges.find((e) => e === p?.name) === null
          ),
        });
      }
      let item = { ...a, privileges };
      newPrivileges.push(item);
    }
    setTempPrivileges(newPrivileges);
  };

  const setChecked = (e) => {
    let newPrivileges = [];
    for (let a of tempPrivileges) {
      let privileges = [];
      for (let p of a?.privileges) {
        if (p?.name === e) {
          privileges.push({
            ...p,
            checked: !p?.checked,
          });
        } else {
          privileges.push(p);
        }
      }
      let item = { ...a, privileges };
      newPrivileges.push(item);
    }
    setTempPrivileges(newPrivileges);
  };

  const submit = async () => {
    try {
      const confirm = window.confirm(
        "Yakin ingin merubah privilege dari role ini?",
      );
      if (confirm) {
        let privileges = [];
        for (let a of tempPrivileges) {
          for (let p of a?.privileges) {
            if (p?.checked) {
              privileges.push(p?.name);
            }
          }
        }
        console.log("submit privileges", privileges);
        const result = await updateAccountRoleEntry(data?.objectId, privileges);
        if (result) {
          if (!(currentUser?.accountRole === undefined || currentUser?.accountRole?.objectId === undefined || currentUser?.accountRole?.objectId === null)) {
          if (currentUser?.accountRole?.objectId === data?.objectId) {
            props.updateReduxUserPrivileges(privileges);
          }
        }
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">{`Edit Role${
          data && data?.name
            ? ` -- ${
                USER_ROLES.find(({ name }) => name === data?.name)?.caption
              }`
            : ""
        }`}</h1>
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
            onClick={() => resetPrivileges()}
          >
            <FontAwesomeIcon
              icon={faWindowRestore}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Reset
          </button>
        </div>
      </div>

      {error ? (
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <span style={{ color: "red" }}>{error}</span>
        </div>
      ) : null}

      {loading || data === null ? (
        <FadeLoader
          color="#4e73df"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : tempPrivileges?.length === undefined ||
        tempPrivileges?.length < 1 ? null : (
        tempPrivileges.map((item, index) => (
          <RolePrivilegesTable
            key={index}
            {...item}
            setChecked={(e) => setChecked(e)}
          />
        ))
      )}
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserPrivileges,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(AccountPrivilegeEdit);
