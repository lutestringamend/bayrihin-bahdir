import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { getWarehouseProductByName } from "../../parse/warehouse/product";
import { hasPrivilege } from "../../utils/account";
import {
  ACCOUNT_PRIVILEGE_CREATE_ORDER,
  ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
} from "../../constants/account";
import {
  overhaulReduxOrderRequestOrders,
  overhaulReduxOrderDeliveryOrders,
  overhaulReduxOrderCombinedOrders,
} from "../../utils/order";
import { fetchOrdersData } from "../../parse/order";
import {
  ORDER_TYPE_DELIVERY_ORDER,
  ORDER_TYPE_REQUEST_ORDER,
} from "../../constants/order";
import OrderStatusTextBox from "../../components/textbox/OrderStatusTextBox";
import { OrderMainStats } from "../../models/orders";
import OrderActionButton from "../../components/buttons/OrderActionButton";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function OrderMain(props) {
  const { privileges, requestOrders, deliveryOrders, combinedOrders } = props;
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(OrderMainStats);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  /*useEffect(() => {
    console.log("combinedOrders", combinedOrders);
  }, [combinedOrders]);*/

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (searchText === null || searchText === "") {
      setSearchList([]);
      return;
    }
    timeoutRef.current = setTimeout(searchProductByName, 500);
  }, [searchText]);

  let fetchData = async () => {
    setLoading(true);
    let newCombined = [];
    let requestUnapproved = 0;
    let deliveryActive = 0;
    const result = await fetchOrdersData(20);
    if (hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL)) {
      if (result?.requestOrders) {
        for (let r of result?.requestOrders) {
          if (!(r?.approvalDate && r?.approverUser)) {
            requestUnapproved++;
          }
          newCombined.push({
            ...r,
            type: ORDER_TYPE_REQUEST_ORDER,
          });
        }
        props.overhaulReduxOrderRequestOrders(result?.requestOrders);
      }
    } else {
      props.overhaulReduxOrderRequestOrders(null);
    }

    if (result?.deliveryOrders) {
      for (let r of result?.deliveryOrders) {
        if (r?.approverUser) {
          deliveryActive++;
        }
        newCombined.push({
          ...r,
          type: ORDER_TYPE_DELIVERY_ORDER,
        });
      }
      props.overhaulReduxOrderDeliveryOrders(result?.deliveryOrders);
    }

    newCombined.sort(function (a, b) {
      let aTime = new Date(a?.createdAt).getTime();
      let bTime = new Date(b?.createdAt).getTime();
      if (aTime < bTime) {
        return 1;
      }
      if (aTime > bTime) {
        return -1;
      }
      return 0;
    });
    props.overhaulReduxOrderCombinedOrders(newCombined);
    setStats({
      requestUnapproved,
      deliveryActive,
    });
    setLoading(false);
  };

  let searchProductByName = async () => {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    const result = await getWarehouseProductByName(
      searchText,
      params?.category,
    );
    setSearchList(result);
    setLoading(false);
  };

  const OrderTableRow = ({ p }) => {
    return (
      <tr>
        <td>
          <div
            className={
              p?.type === ORDER_TYPE_DELIVERY_ORDER
                ? "text-primary-highlight"
                : "text-yellow-highlight"
            }
          >
            {p?.type}
          </div>
        </td>
        <td>{p?.deliveryOrderNumber}</td>
        <td>
          {p?.surgeryDate ? new Date(p?.surgeryDate).toLocaleString("id-ID") : ""}
        </td>
        <td>{p?.warehouseStorage ? p?.warehouseStorage?.name : "-"}</td>

        <td>{p?.hospital ? p?.hospital?.name : "-"}</td>
        <td>{p?.doctor ? p?.doctor?.name : "-"}</td>
        <td>
          <OrderStatusTextBox {...p} />
        </td>
        <td>
          <OrderActionButton {...p} />
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
        <h1 className="h3 mb-0 text-gray-800">Order Management</h1>
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

      <div className="row">
        {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
          <ButtonModuleMain
            target="/order/request-orders/pending"
            title="Request Belum Ditinjau"
            value={stats?.requestUnapproved}
            color="danger"
          />
        ) : null}

        <ButtonModuleMain
          target="/order/delivery-orders/active"
          title="Delivery Order Aktif"
          value={stats?.deliveryActive}
          color="primary"
        />
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {searchText
              ? `Hasil pencarian "${searchText}"`
              : "Daftar order, diurutkan berdasarkan tanggal dibuat"}
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
                    <th>Jenis</th>
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
                    <th>Jenis</th>
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
                    : combinedOrders
                      ? combinedOrders.map((p, index) => (
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

/*
<a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: "0.25rem", color: "white" }} />
                    Generate Report
                </a>
*/
const mapStateToProps = (store) => ({
  privileges: store.userState.privileges,
  combinedOrders: store.orderState.combinedOrders,
  requestOrders: store.orderState.requestOrders,
  deliveryOrders: store.orderState.deliveryOrders,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderRequestOrders,
      overhaulReduxOrderDeliveryOrders,
      overhaulReduxOrderCombinedOrders,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(OrderMain);
