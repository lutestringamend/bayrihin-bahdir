import { faFaceLaughWink, faTachographDigital, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon">
                    <img src={require("../../assets/logo_small.png")} />
                </div>
                <div className="sidebar-brand-text mx-2 mt-2">Admin</div>
            </a>

            <hr className="sidebar-divider my-0" />


            

            

            <li className="nav-item active">
                <Link className="nav-link" to="/portal/warehouse">
                    <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
                    <span>Warehouse</span>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />

        </ul>
    )
}

/*
<li className="nav-item active">
                <Link className="nav-link" to="/portal/dashboard">
                    <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
                    <span>Dashboard</span>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />

            <li className="nav-item active">
                <Link className="nav-link" to="/portal/user-list">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
                    <span>User</span>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />

*/

export default Sidebar