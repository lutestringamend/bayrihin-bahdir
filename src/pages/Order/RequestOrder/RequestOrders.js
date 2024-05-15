import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import ButtonModuleMain from "../../../components/buttons/ButtonModuleMain";
import { hasPrivilege } from "../../../utils/account";
import {
  ACCOUNT_PRIVILEGE_CREATE_ORDER,
  ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
  ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER,
} from "../../../constants/account";
import {
  overhaulReduxOrderRequestOrders,
} from "../../../utils/order";
import { getRequestOrdersData } from "../../../parse/order";
import { ORDER_TYPE_REQUEST_ORDER, RequestOrderFilters } from "../../../constants/order";
import OrderStatusTextBox from "../../../components/textbox/OrderStatusTextBox";
import { OrderMainStats } from "../../../models/orders";
import OrderActionButton from "../../../components/buttons/OrderActionButton";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function RequestOrders(props) {
  const { privileges, requestOrders } = props;
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(OrderMainStats);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params?.filter]);

  /*useEffect(() => {
    console.log("Redux request orders", requestOrders);
  }, [requestOrders]);*/

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (searchText === null || searchText === "") {
      setSearchList([]);
      return;
    }
    //timeoutRef.current = setTimeout(searchProductByName, 500);
  }, [searchText]);

  let fetchData = async () => {
    setLoading(true);
    let requestUnapproved = 0;
    const result = await getRequestOrdersData(null, null, params?.filter ? params?.filter : "");
    if ((hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) || hasPrivilege(privileges, ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER)) && result) {
      for (let r of result) {
        if (!(r?.approvalDate && r?.approverUser)) {
          requestUnapproved++;
        }
      }
      props.overhaulReduxOrderRequestOrders(result);
    } else {
      props.overhaulReduxOrderRequestOrders(null);
    }

    setStats({
      requestUnapproved,
    });
    setLoading(false);
  };

  const OrderTableRow = ({ p }) => {
    return (
      <tr>
        <td>{p?.deliveryOrderNumber}</td>
        <td>
          {p?.createdAt ? new Date(p?.createdAt).toLocaleString("id-ID") : ""}
        </td>
        <td>{p?.warehouseStorage ? p?.warehouseStorage?.name : "-"}</td>

        <td>{p?.hospital ? p?.hospital?.name : "-"}</td>
        <td>{p?.doctor ? p?.doctor?.name : "-"}</td>
        <td>
          <OrderStatusTextBox {...p} type={ORDER_TYPE_REQUEST_ORDER} />
        </td>
        <td>
          <OrderActionButton {...p} type={ORDER_TYPE_REQUEST_ORDER} />
        </td>
      </tr>
    );
  };

  /*
<div className="d-sm-flex mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-white"
            placeholder="Cari Delivery Order No, nama rumah sakit, dokter, prosedur"
            aria-label="Search"
            aria-describedby="basic-addon2"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="input-group-append">
            <button
              onClick={() => searchProductByName()}
              className="btn btn-primary"
              type="button"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
  */

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Request Order</h1>
      </div>

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ? (
        <div className="d-sm-flex flex-1 mb-4 align-items-center justify-content-end">
          <Link
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            to={`/order/create-request-order`}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Buat Request Order
          </Link>
        </div>
      ) : null}

{hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) && params?.filter !== "approved" ? (
   <div className="row">
        <ButtonModuleMain
            target="/order/request-orders/pending"
            title="Request Belum Ditinjau"
            value={stats?.requestUnapproved}
            color="danger"
          />
   </div>
         
        ) : null}

     

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params?.filter}
          onChange={(e) =>
            navigate(
              e.target.value ? `/order/request-orders/${e.target.value}` : "/order/request-orders",
            )
          }
          className="form-control"
        >
          {RequestOrderFilters.map((item, index) => (
            <option key={index} value={item?.name}>
              {item?.caption}
            </option>
          ))}
        </select>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {searchText
              ? `Hasil pencarian "${searchText}"`
              : "Request Order, diurutkan berdasarkan tanggal dibuat"}
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
                    <th>DO No</th>
                    <th>Tanggal</th>
                    <th>Region</th>
                    <th>Rumah Sakit</th>
                    <th>Dokter</th>
                    <th>Status</th>
                    <th width="7%">Aksi</th>
                  </tr>
                </thead>

                <tfoot>
                  <tr>
                    <th>DO No</th>
                    <th>Tanggal</th>
                    <th>Region</th>
                    <th>Rumah Sakit</th>
                    <th>Dokter</th>
                    <th>Status</th>
                    <th width="7%">Aksi</th>
                  </tr>
                </tfoot>

                <tbody>
                  {searchText
                    ? searchList.map((p, index) => (
                        <OrderTableRow key={index} p={p} />
                      ))
                    : requestOrders
                      ? requestOrders.map((p, index) => (
                          <OrderTableRow key={index} p={p} />
                        ))
                      : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (store) => ({
  privileges: store.userState.privileges,
  requestOrders: store.orderState.requestOrders,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderRequestOrders,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(RequestOrders);
