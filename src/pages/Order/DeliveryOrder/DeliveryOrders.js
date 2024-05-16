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
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
} from "../../../constants/account";
import {
  getAvailableDeliveryOrderTypes,
  overhaulReduxOrderDeliveryOrders,
  overhaulReduxOrderDeliveryOrdersImplant,
  overhaulReduxOrderDeliveryOrdersInstrument,
} from "../../../utils/order";
import {
  fetchDeliveryOrders,
  getDeliveryOrdersData,
  getDeliveryOrdersImplantData,
  getDeliveryOrdersInstrumentData,
} from "../../../parse/order";
import {
  DeliveryOrderFilters,
  DeliveryOrderType,
  ORDER_TYPE_DELIVERY_ORDER,
  ORDER_TYPE_DELIVERY_ORDER_IMPLANT,
  ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT,
} from "../../../constants/order";
import OrderStatusTextBox from "../../../components/textbox/OrderStatusTextBox";
import { OrderMainStats } from "../../../models/orders";
import OrderActionButton from "../../../components/buttons/OrderActionButton";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function DeliveryOrders(props) {
  const {
    privileges,
    deliveryOrders,
    deliveryOrdersImplant,
    deliveryOrdersInstrument,
  } = props;
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(OrderMainStats);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params]);

  /*useEffect(() => {
    if (params?.type === "implant") {
      console.log("DOimplant", deliveryOrdersImplant);
    }
  }, [deliveryOrdersImplant]);

  useEffect(() => {
    if (params?.type === "instrument") {
      console.log("DOinstrument", deliveryOrdersInstrument);
    }
  }, [deliveryOrdersInstrument]);*/

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
    let deliveryActive = 0;
    let deliveryImplantsPending = 0;
    let deliveryInstrumentsPending = 0;
    let result = null;

    if (params?.type === "implant") {
      result = await getDeliveryOrdersImplantData(
        null,
        params?.filter ? params?.filter : "",
      );
      for (let r of result) {
        if (!(r?.approvalDate && r?.approverUser)) {
          deliveryImplantsPending++;
        }
      }
      props.overhaulReduxOrderDeliveryOrdersImplant(result);
      setStats({ ...stats, deliveryImplantsPending });
    } else if (params?.type === "instrument") {
      result = await getDeliveryOrdersInstrumentData(
        null,
        params?.filter ? params?.filter : "",
      );
      for (let r of result) {
        if (!(r?.approvalDate && r?.approverUser)) {
          deliveryInstrumentsPending++;
        }
      }
      props.overhaulReduxOrderDeliveryOrdersInstrument(result);
      setStats({ ...stats, deliveryInstrumentsPending });
    } else {
      result = await fetchDeliveryOrders(params?.filter ? params?.filter : "");
      if (result?.deliveryOrders) {
        deliveryActive = result?.deliveryOrders?.length;
        props.overhaulReduxOrderDeliveryOrders(result?.deliveryOrders);
      }

      if (result?.deliveryOrdersImplant) {
        for (let r of result?.deliveryOrdersImplant) {
          if (!(r?.approvalDate && r?.approverUser)) {
            deliveryImplantsPending++;
          }
        }
        props.overhaulReduxOrderDeliveryOrdersImplant(
          result?.deliveryOrdersImplant,
        );
      }

      if (result?.deliveryOrdersInstrument) {
        for (let r of result?.deliveryOrdersInstrument) {
          if (!(r?.approvalDate && r?.approverUser)) {
            deliveryInstrumentsPending++;
          }
        }
        props.overhaulReduxOrderDeliveryOrdersInstrument(
          result?.deliveryOrdersInstrument,
        );
      }

      setStats({
        deliveryActive,
        deliveryImplantsPending,
        deliveryInstrumentsPending,
      });
    }

    setLoading(false);
  };

  const OrderTableRow = ({
    p,
    isSpecified,
    approvalDate,
    approverUser,
    editorUser,
    objectId,
  }) => {
    return (
      <tr>
        {isSpecified ? (
          <td>
            <div
              className={
                params?.type === "implant"
                  ? "text-yellow-highlight"
                  : "text-info-highlight"
              }
            >
              {params?.type === "implant"
                ? ORDER_TYPE_DELIVERY_ORDER_IMPLANT
                : ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT}
            </div>
          </td>
        ) : null}
        <td>{p?.deliveryOrderNumber}</td>
        <td>
          {p?.surgeryDate ? new Date(p?.surgeryDate).toLocaleString("id-ID") : ""}
        </td>
        <td>{p?.warehouseStorage ? p?.warehouseStorage?.name : "-"}</td>

        <td>{p?.hospital ? p?.hospital?.name : "-"}</td>
        <td>{p?.doctor ? p?.doctor?.name : "-"}</td>
        <td>
          <OrderStatusTextBox
            {...p}
            approvalDate={isSpecified ? approvalDate : p?.approvalDate}
            approverUser={isSpecified ? approverUser : p?.approverUser}
            editorUser={isSpecified ? editorUser : p?.editorUser}
            type={
              params?.type === "implant"
                ? ORDER_TYPE_DELIVERY_ORDER_IMPLANT
                : params?.type === "instrument"
                  ? ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
                  : ORDER_TYPE_DELIVERY_ORDER
            }
          />
        </td>
        <td>
          <OrderActionButton
            {...p}
            approvalDate={isSpecified ? approvalDate : p?.approvalDate}
            approverUser={isSpecified ? approverUser : p?.approverUser}
            objectId={isSpecified ? objectId : p?.objectId}
            type={
              params?.type === "implant"
                ? ORDER_TYPE_DELIVERY_ORDER_IMPLANT
                : params?.type === "instrument"
                  ? ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT
                  : ORDER_TYPE_DELIVERY_ORDER
            }
          />
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
        <h1 className="h3 mb-0 text-gray-800">{`Daftar ${
          params?.type
            ? DeliveryOrderType.find(({ name }) => name === params?.type)
                ?.caption
            : "Delivery Order"
        }`}</h1>
      </div>

      <div className="row">
        <ButtonModuleMain
          target="/order/delivery-orders"
          title="Delivery Order Aktif"
          value={stats?.deliveryActive}
          color="primary"
        />
        {hasPrivilege(
          privileges,
          ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
        ) &&
        params?.type !== "instrument" &&
        params?.filter !== "approved" ? (
          <ButtonModuleMain
            target="/order/delivery-orders/implant"
            title="DO Implant Belum Ditinjau"
            value={stats?.deliveryImplantsPending}
            color="danger"
          />
        ) : null}

        {hasPrivilege(
          privileges,
          ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
        ) &&
        params?.type !== "implant" &&
        params?.filter !== "approved" ? (
          <ButtonModuleMain
            target="/order/delivery-orders/instrument"
            title="DO Instrument Belum Ditinjau"
            value={stats?.deliveryInstrumentsPending}
            color="danger"
          />
        ) : null}
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="type"
          value={params?.type ? params?.type : ""}
          onChange={(e) =>
            navigate(
              `${
                e.target.value
                  ? `/order/delivery-orders/${e.target.value}`
                  : "/order/delivery-orders"
              }${params?.filter ? `/${params?.filter}` : ""}`,
            )
          }
          className="form-control"
        >
          {getAvailableDeliveryOrderTypes(privileges).map((item, index) => (
            <option key={index} value={item?.name}>
              {item?.caption}
            </option>
          ))}
        </select>
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="filter"
          value={params?.filter ? params?.filter : ""}
          onChange={(e) =>
            navigate(
              `/order/delivery-orders/${
                params?.type ? params?.type : e.target.value ? "all" : ""
              }${e.target.value ? `/${e.target.value}` : ""}`,
            )
          }
          className="form-control"
        >
          {DeliveryOrderFilters.map((item, index) => (
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
              : `${
                  params?.type
                    ? DeliveryOrderType.find(
                        ({ name }) => name === params?.type,
                      )?.caption
                    : "Delivery Order"
                }, diurutkan berdasarkan tanggal dibuat`}
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
                    {params?.type === "implant" ||
                    params?.type === "instrument" ? (
                      <th>Jenis</th>
                    ) : null}
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
                    {params?.type === "implant" ||
                    params?.type === "instrument" ? (
                      <th>Jenis</th>
                    ) : null}
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
                        <OrderTableRow
                          key={index}
                          p={p}
                          approvalDate={p?.approvalDate}
                          approverUser={p?.approverUser}
                          editorUser={p?.editorUser}
                          objectId={p?.objectId}
                          isSpecified={
                            params?.type === "implant" ||
                            params?.type === "instrument"
                          }
                        />
                      ))
                    : params?.type === "implant"
                      ? deliveryOrdersImplant
                        ? deliveryOrdersImplant.map((p, index) => (
                            <OrderTableRow
                              key={index}
                              p={p?.deliveryOrder}
                              approvalDate={p?.approvalDate}
                              approverUser={p?.approverUser}
                              editorUser={p?.editorUser}
                              objectId={p?.objectId}
                              isSpecified
                            />
                          ))
                        : null
                      : params?.type === "instrument"
                        ? deliveryOrdersInstrument
                          ? deliveryOrdersInstrument.map((p, index) => (
                              <OrderTableRow
                                key={index}
                                p={p?.deliveryOrder}
                                approvalDate={p?.approvalDate}
                                approverUser={p?.approverUser}
                                editorUser={p?.editorUser}
                                objectId={p?.objectId}
                                isSpecified
                              />
                            ))
                          : null
                        : deliveryOrders
                          ? deliveryOrders.map((p, index) => (
                              <OrderTableRow
                                key={index}
                                p={p}
                                isSpecified={
                                  params?.type === "implant" ||
                                  params?.type === "instrument"
                                }
                              />
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
  deliveryOrders: store.orderState.deliveryOrders,
  deliveryOrdersImplant: store.orderState.deliveryOrdersImplant,
  deliveryOrdersInstrument: store.orderState.deliveryOrdersInstrument,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderDeliveryOrders,
      overhaulReduxOrderDeliveryOrdersImplant,
      overhaulReduxOrderDeliveryOrdersInstrument,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(DeliveryOrders);
