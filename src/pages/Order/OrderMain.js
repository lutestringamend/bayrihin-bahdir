import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, combineReducers } from "redux";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { WarehouseMainStats } from "../../models/warehouse";
import { fetchWarehouseMainData } from "../../parse/warehouse";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import { WarehouseMainTabs } from "../../constants/warehouse";
import { getWarehouseProductByName } from "../../parse/warehouse/product";
import { hasPrivilege } from "../../utils/account";
import { ACCOUNT_PRIVILEGE_CREATE_ORDER, ACCOUNT_PRIVILEGE_ORDER_APPROVAL, ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD } from "../../constants/account";
import { overhaulReduxOrderRequestOrders, overhaulReduxOrderDeliveryOrders, overhaulReduxOrderCombinedOrders } from "../../utils/order";
import { fetchOrdersData } from "../../parse/order";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function OrderMain(props) {
  const { privileges, requestOrders, deliveryOrders, combinedOrders } = props;
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(WarehouseMainStats);
  const [productList, setProductList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("combinedOrders", combinedOrders);
  }, [combinedOrders]);

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
    const result = await fetchOrdersData(20);
    if (result?.requestOrders) {
      props.overhaulReduxOrderRequestOrders(result?.requestOrders);
    }
    if (result?.deliveryOrders) {
      props.overhaulReduxOrderDeliveryOrders(result?.deliveryOrders);
    }
    newCombined = result?.requestOrders.concat(result?.deliveryOrders);
    newCombined.sort(function (a, b) {
      let aTime = new Date(a?.createdAt).getTime();
      let bTime = new Date(b?.createdAt).getTime();
      if (aTime < bTime) {
        return -1;
      }
      if (aTime > bTime) {
        return 1;
      }
      return 0;
    });
    props.overhaulReduxOrderCombinedOrders(newCombined);
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

  /*
<ButtonModuleMain
          target="/warehouse/mutations"
          title="Check Mutation"
          color="primary"
        />
  */

        /*
<div className="d-sm-flex align-items-center mb-4">
      <Link
            to={`/warehouse/${item.category}`}
            className={`btn ${
              params?.category === item.category ||
              (index === 0 &&
                (params.category === undefined ||
                  params.category === null ||
                  params.category === ""))
                ? "btn-primary"
                : "btn-info"
            } btn-md mr-1`}
          >
            {item.title}
          </Link>
      </div>
        */

  const OrderTableRow = ({ p }) => {
    return (
      <tr>
        <td>
        {p?.createdAt
                                ? new Date(p?.createdAt).toLocaleString("id-ID")
                                : ""}
        </td>
        <td>
          {p?.warehouseStorage
            ? p?.warehouseStorage?.name
            : "-"}
        </td>

        <td>
          {p?.hospital
            ? p?.hospital?.name
            : "-"}
        </td>
        <td>
          {p?.doctor
            ? p?.doctor?.name
            : "-"}
        </td>
        <td>{p?.status === undefined ? "Request Belum Ditinjau" : "Delivery Order"}</td>
        <td>
        <p>
                              <Link
                                to={`/request-order/${p?.objectId}`}
                                className="btn btn-primary btn-sm mr-1"
                              >
                                Tinjau
                              </Link>
                            </p>
        </td>
      </tr>
    );
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Order Management</h1>
      </div>

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ? (
 <div className="d-sm-flex flex-1 mb-4 align-items-center justify-content-end">
 <Link
   className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
   to={`/create-request-order`}
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
        {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ?
        <ButtonModuleMain
        target="/order/request-orders"
        title="Request Belum Ditinjau"
        value={requestOrders ? requestOrders?.length : "-"}
        color="danger"
      />
        : null}
        
        <ButtonModuleMain
          target="/order/delivery-orders"
          title="Delivery Order Aktif"
          value={deliveryOrders ? deliveryOrders?.length : "-"}
          color="info"
        />
      </div>
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
            <button onClick={() => searchProductByName()} className="btn btn-primary" type="button">
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
                    : combinedOrders ? combinedOrders.map((p, index) => 
                        <OrderTableRow key={index} p={p} />
                      ) : null}
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
