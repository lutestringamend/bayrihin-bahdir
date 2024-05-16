import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  faWarehouse,
  faList,
  faUsers,
  faHome,
  faDatabase,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hasPrivilege } from "../../utils/account";
import {
  ACCOUNT_PRIVILEGE_CREATE_ORDER,
  ACCOUNT_PRIVILEGE_DOCTORS_CRUD,
  ACCOUNT_PRIVILEGE_HOSPITALS_CRUD,
  ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
  ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
  ACCOUNT_PRIVILEGE_PRICING_CRUD,
  ACCOUNT_PRIVILEGE_UPDATE_ADMIN,
  ACCOUNT_PRIVILEGE_VIEW_DELIVERY_ORDER,
  ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER,
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD,
} from "../../constants/account";
import { USER_ROLE_DEVELOPER, USER_ROLE_SUPERADMIN } from "../../constants/user";

/*

<li className="nav-item active">
            <Link className="nav-link" to="/warehouse-packages">
              <span>Balas Request Order</span>
            </Link>
          </li>

           <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <Link className="nav-link" to="/user">
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
          <span>User Management</span>
        </Link>
      </li>
*/

function Sidebar(props) {
  const { currentUser, privileges } = props;

  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div className="sidebar-brand-icon">
          <img src={require("../../assets/logo_small.png")} />
        </div>
        <div className="sidebar-brand-text mx-2 mt-2">Admin</div>
      </a>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <Link className="nav-link" to="/">
          <FontAwesomeIcon icon={faHome} style={{ marginRight: "0.5rem" }} />
          <span>Beranda</span>
        </Link>
      </li>
      <hr className="sidebar-divider my-0" />

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_UPDATE_ADMIN) ? (
        <>
          <li className="nav-item active">
            <Link className="nav-link" to="/user-management">
              <FontAwesomeIcon
                icon={faUsers}
                style={{ marginRight: "0.5rem" }}
              />
              <span>User Management</span>
            </Link>
          </li>
          <hr className="sidebar-divider my-0" />
        </>
      ) : null}

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD) ? (
        <>
          <li className="nav-item active">
            <Link className="nav-link" to="/warehouse">
              <FontAwesomeIcon
                icon={faWarehouse}
                style={{ marginRight: "0.5rem" }}
              />
              <span>Warehouse</span>
            </Link>
            <ul>
              <li className="nav-item active">
                <Link className="nav-link" to="/warehouse-products">
                  <span>Produk</span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/warehouse-storages">
                  <span>Region</span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/warehouse-packages">
                  <span>Paket</span>
                </Link>
              </li>
              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_PRICING_CRUD) ? (
                <li className="nav-item active">
                  <Link className="nav-link" to="/warehouse-products/prices">
                    <span>Harga Produk</span>
                  </Link>
                </li>
              ) : null}
              {hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT,
              ) ||
              hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
              ) ? (
                <li className="nav-item active">
                  <Link
                    className="nav-link"
                    to="/order/delivery-orders/implant/pending"
                  >
                    <span>Tinjau DO Implant</span>
                  </Link>
                </li>
              ) : null}
              {hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
              ) ||
              hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
              ) ? (
                <li className="nav-item active">
                  <Link
                    className="nav-link"
                    to="/order/delivery-orders/instrument/pending"
                  >
                    <span>Tinjau DO Instrument</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </li>
          <hr className="sidebar-divider my-0" />
        </>
      ) : null}

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ||
      hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
        <>
          <li className="nav-item active">
            <Link className="nav-link" to="/order">
              <FontAwesomeIcon
                icon={faList}
                style={{ marginRight: "0.5rem" }}
              />
              <span>Order Management</span>
            </Link>
            <ul>
              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ? (
                <li className="nav-item active">
                  <Link className="nav-link" to="/order/create-request-order">
                    <span>Buat Request Order</span>
                  </Link>
                </li>
              ) : null}
              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER) || hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
                <li className="nav-item active">
                <Link className="nav-link" to="/order/request-orders">
                  <span>Daftar Request Order</span>
                </Link>
              </li>
              ) : null}
              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_VIEW_DELIVERY_ORDER) || hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
                 <li className="nav-item active">
                 <Link className="nav-link" to="/order/delivery-orders">
                   <span>Daftar Delivery Order</span>
                 </Link>
               </li>
              ) : null}
            </ul>
          </li>
          <hr className="sidebar-divider my-0" />
        </>
      ) : null}

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS) ? (
 <>
 <li className="nav-item active">
   <Link className="nav-link" to="/order">
     <FontAwesomeIcon
       icon={faMotorcycle}
       style={{ marginRight: "0.5rem" }}
     />
     <span>Pengantaran</span>
   </Link>
   <ul>
     {currentUser?.accountRole ? currentUser?.accountRole?.name === USER_ROLE_SUPERADMIN || currentUser?.accountRole?.name === USER_ROLE_DEVELOPER  ? (
       <li className="nav-item active">
         <Link className="nav-link" to="/tracking/events">
           <span>Edit Tracking Event</span>
         </Link>
       </li>
     ) : null : null}
<li className="nav-item active">
         <Link className="nav-link" to="/tracking/order-deliveries">
           <span>Daftar Order Delivery</span>
         </Link>
       </li>
       
   </ul>
 </li>
 <hr className="sidebar-divider my-0" />
</>
      ) : null}

      {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_HOSPITALS_CRUD) ||
      hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DOCTORS_CRUD) ? (
        <>
          <li className="nav-item active">
            <Link className="nav-link" to="/order">
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ marginRight: "0.5rem" }}
              />
              <span>Master Data</span>
            </Link>
            <ul>
              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_HOSPITALS_CRUD) ? (
                <li className="nav-item active">
                  <Link className="nav-link" to="/hospitals">
                    <span>Edit Rumah Sakit</span>
                  </Link>
                </li>
              ) : null}

              {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DOCTORS_CRUD) ? (
                <li className="nav-item active">
                  <Link className="nav-link" to="/doctors">
                    <span>Edit Dokter</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </li>
          <hr className="sidebar-divider my-0" />
        </>
      ) : null}
    </ul>
  );
}

/*
<li className="nav-item active">
         <Link className="nav-link" to="/tracking/order-pickups">
           <span>Daftar Order Pickup</span>
         </Link>
       </li>
*/

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  privileges: store.userState.privileges,
});

export default connect(mapStateToProps, null)(Sidebar);
