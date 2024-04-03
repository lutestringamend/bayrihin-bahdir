import {
  faWarehouse,
  faList,
  faUsers,
  faCodePullRequest,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

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

function Sidebar() {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="index.html"
      >
        <div className="sidebar-brand-icon">
          <img src={require("../../assets/logo_small.png")} />
        </div>
        <div className="sidebar-brand-text mx-2 mt-2">Admin</div>
      </a>

      <hr className="sidebar-divider my-0" />

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
        </ul>
      </li>
      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <Link className="nav-link" to="/order">
          <FontAwesomeIcon icon={faList} style={{ marginRight: "0.5rem" }} />
          <span>Order Management</span>
        </Link>
        <ul>
          <li className="nav-item active">
            <Link className="nav-link" to="/create-request-order">
              <span>Buat Request Order</span>
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/hospitals">
              <span>Daftar Rumah Sakit</span>
            </Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/doctors">
              <span>Daftar Dokter</span>
            </Link>
          </li>
          
        </ul>
      </li>
     
    </ul>
  );
}

/*
<li className="nav-item active">
                <Link className="nav-link" to="/dashboard">
                    <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
                    <span>Dashboard</span>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />

            <li className="nav-item active">
                <Link className="nav-link" to="/user-list">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
                    <span>User</span>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />

*/

export default Sidebar;
