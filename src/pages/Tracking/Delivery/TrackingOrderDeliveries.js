import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/*import { faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { hasPrivilege } from "../../utils/account";*/
import { overhaulReduxOrderDeliveryOrderDelivery } from "../../../utils/order";
import { getDeliveryOrderDeliveryData } from "../../../parse/order/orderdelivery";
import TrackingOrderStatusTextBox from "../../../components/textbox/TrackingOrderStatusTextBox";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function TrackingOrderDeliveries(props) {
  const { privileges, deliveryOrderDelivery } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  //const [stats, setStats] = useState(OrderMainStats);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("deliveryOrderDelivery", deliveryOrderDelivery);
  }, [deliveryOrderDelivery]);

  let fetchData = async () => {
    setLoading(true);
    const result = await getDeliveryOrderDeliveryData();
    if (!(result === undefined || result === null)) {
      props.overhaulReduxOrderDeliveryOrderDelivery(result);
    }
    setLoading(false);
  };

  const OrderTableRow = ({ p }) => {
    return (
      <tr>
        <td>
          {p?.deliveryOrder ? p?.deliveryOrder?.deliveryOrderNumber : "-"}
        </td>
        <td>
          {p?.deliveryOrder
            ? p?.deliveryOrder?.surgeryDate
              ? new Date(p?.deliveryOrder?.surgeryDate).toLocaleString("id-ID")
              : "-"
            : "-"}
        </td>
        <td>{p?.driverUser ? p?.driverUser?.name : "Belum ditunjuk"}</td>
        <td>
          <TrackingOrderStatusTextBox {...p} />
        </td>
        <td>
          <p>
            <Link
              to={`/tracking/order-delivery/${p?.objectId}`}
              className="btn btn-primary btn-sm"
            >
              {p?.approvalDate && p?.approvalUser ? "Detil" : "Tinjau"}
            </Link>
          </p>
          {p?.deliveryOrder ? (
            p?.deliveryOrder?.objectId ? (
              <p>
                <Link
                  to={`/order/delivery-order/${p?.deliveryOrder?.objectId}`}
                  className="btn btn-info btn-sm"
                >
                  Lihat DO
                </Link>
              </p>
            ) : null
          ) : null}
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Order Delivery</h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Daftar Order Delivery, diurutkan berdasarkan tanggal dibuat
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
                    <th>Tanggal Operasi</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th width="10%">Aksi</th>
                  </tr>
                </thead>

                <tfoot>
                  <tr>
                    <th>DO No</th>
                    <th>Tanggal Operasi</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th width="10%">Aksi</th>
                  </tr>
                </tfoot>

                <tbody>
                  {deliveryOrderDelivery
                    ? deliveryOrderDelivery.map((p, index) => (
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
  deliveryOrderDelivery: store.orderState.deliveryOrderDelivery,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderDeliveryOrderDelivery,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(TrackingOrderDeliveries);
