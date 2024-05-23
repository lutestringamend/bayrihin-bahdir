import React from "react";
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import { FadeLoader } from "react-spinners";

import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";

function Portal(props) {
  const { currentUser, privileges } = props;
  return (
    <>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />
            <div className="container-fluid">
              {currentUser && privileges ? (
                <Outlet></Outlet>
              ) : (
                <FadeLoader
                  color="#4e73df"
                  loading
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  privileges: store.userState.privileges,
});

export default connect(mapStateToProps, null)(Portal);
