import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
//import { bindActionCreators } from "redux";

import "../App.css";
import "../sb-admin-2.min.css";

//import Dashboard from '.../src/pages/Dashboard/Dashboard';
import Login from "../pages/Auth/Login";
import Userlist from "../pages/User/Userlist";
import Portal from "../pages/Portal/Portal";
import UserCreate from "../pages/User/UserCreate";
import UserView from "../pages/User/UserView";
import UserEdit from "../pages/User/UserEdit";

import WarehouseMain from "../pages/Warehouse/WarehouseMain";
import WarehouseProducts from "../pages/Warehouse/WarehouseProducts";
import WarehouseStorages from "../pages/Warehouse/WarehouseStorages";
import WarehousePackages from "./Warehouse/WarehousePackages";
import WarehouseTypes from "../pages/Warehouse/WarehouseTypes";
import WarehouseProductMutations from "../pages/Warehouse/WarehouseProductMutations";
import WarehouseProductLots from "../pages/Warehouse/WarehouseProductLots";
import WarehousePackageProducts from "./Warehouse/WarehousePackageProducts";

const Init = (props) => {
  const { currentUser } = props;

  if (currentUser === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Portal />}>
          <Route path="warehouse" element={<WarehouseMain />} />
          <Route path="warehouse-storages" element={<WarehouseStorages />} />

          <Route path="warehouse-products" element={<WarehouseProducts />} />
          <Route
            path="warehouse-products/:category"
            element={<WarehouseProducts />}
          />
          <Route
            path="warehouse-products/:category/:type"
            element={<WarehouseProducts />}
          />

          <Route path="warehouse-packages" element={<WarehousePackages />} />
          <Route
            path="warehouse-packages/:category"
            element={<WarehousePackages />}
          />

          <Route path="warehouse-package-products/:id" element={<WarehousePackageProducts />} />

          <Route path="warehouse-types" element={<WarehouseTypes />} />
          <Route
            path="warehouse-types/:category"
            element={<WarehouseTypes />}
          />

          <Route
            path="warehouse-product-mutations/:id"
            element={<WarehouseProductMutations />}
          />
          <Route
            path="warehouse-product-mutations/:id/:lotId"
            element={<WarehouseProductMutations />}
          />
          <Route
            path="warehouse-product-lots/:id"
            element={<WarehouseProductLots />}
          />

          <Route path="user-list" element={<Userlist />} />
          <Route path="create-user" element={<UserCreate />} />
          <Route path="user-view/:id" element={<UserView />} />
          <Route path="user-edit/:id" element={<UserEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

/*const mapDispatchProps = (dispatch) =>
    bindActionCreators(
      {
      },
      dispatch,
    );*/

export default connect(mapStateToProps, null)(Init);
