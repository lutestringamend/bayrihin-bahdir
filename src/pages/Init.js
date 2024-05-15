import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../App.css";
import "../sb-admin-2.min.css";

import { updateReduxUserPrivileges } from "../utils/user";

//import Dashboard from '.../src/pages/Dashboard/Dashboard';
import Login from "../pages/Auth/Login";
import Portal from "../pages/Portal/Portal";

import WarehouseMain from "../pages/Warehouse/WarehouseMain";
import WarehouseProducts from "../pages/Warehouse/WarehouseProducts";
import WarehouseStorages from "../pages/Warehouse/WarehouseStorages";
import WarehousePackages from "./Warehouse/WarehousePackages";
import WarehouseTypes from "../pages/Warehouse/WarehouseTypes";
import WarehouseProductMutations from "../pages/Warehouse/WarehouseProductMutations";
import WarehouseProductLots from "../pages/Warehouse/WarehouseProductLots";
import WarehousePackageProducts from "./Warehouse/WarehousePackageProducts";

import OrderMain from "./Order/OrderMain";
import CreateRequestOrder from "./Order/CreateRequestOrder";
import RequestOrder from "./Order/RequestOrder";
import OrderPackageItem from "./Order/OrderPackageItem";
import Hospitals from "./Order/Hospitals";
import Doctors from "./Order/Doctors";
import Doctor from "./Order/Doctor";
import WarehouseProductPriceList from "./Warehouse/WarehouseProductPriceList";
import WarehouseProductPrices from "./Warehouse/WarehouseProductPrices";

import UserManagement from "./User/UserManagement";
import AccountPrivilegeEdit from "./User/AccountPrivilegeEdit";
import {
  ACCOUNT_PRIVILEGE_UPDATE_ADMIN,
  ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD,
  ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD,
  ACCOUNT_PRIVILEGE_CREATE_ORDER,
  ACCOUNT_PRIVILEGE_PRICING_CRUD,
  ACCOUNT_PRIVILEGE_HOSPITALS_CRUD,
  ACCOUNT_PRIVILEGE_DOCTORS_CRUD,
  ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
} from "../constants/account";
import { hasPrivilege } from "../utils/account";
import { getAccountRoleEntry } from "../parse/account";


const Init = (props) => {
  const { currentUser, privileges } = props;

  useEffect(() => {
    if (currentUser === null) {
      return;
    }
    fetchPrivileges();
    console.log("redux currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (privileges?.length === undefined || privileges?.length < 1) {
      return;
    }
    console.log("redux privileges", privileges);
  }, [privileges]);

  const fetchPrivileges = async () => {
    try {
      const result = await getAccountRoleEntry(currentUser?.accountRole?.objectId);
      if (!(result === undefined || result?.privileges === undefined || result?.privileges?.length === undefined)) {
        props.updateReduxUserPrivileges(result?.privileges);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    if (
      currentUser === null ||
      currentUser?.accountRole === undefined ||
      currentUser?.accountRole?.privileges === undefined ||
      currentUser?.accountRole?.privileges?.length === undefined
    ) {
      props.updateReduxUserPrivileges([]);
    } else {
      props.updateReduxUserPrivileges(currentUser?.accountRole?.privileges);
    }
  }

  if (currentUser === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  /*
<Route
            path="warehouse-products/:category/:type"
            element={<WarehouseProducts />}
          />
  */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Portal />}>
          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_UPDATE_ADMIN) ? (
            <Route path="user-management" element={<UserManagement />} />
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_UPDATE_ADMIN) &&
          hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE) ? (
            <Route
              path="account-privilege/:id"
              element={<AccountPrivilegeEdit />}
            />
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD) ? (
            <>
              <Route path="warehouse" element={<WarehouseMain />} />
              <Route path="warehouse/:category" element={<WarehouseMain />} />

              <Route
                path="warehouse-storages"
                element={<WarehouseStorages />}
              />

              <Route
                path="warehouse-products"
                element={<WarehouseProducts />}
              />
              <Route
                path="warehouse-products/:category"
                element={<WarehouseProducts />}
              />

              <Route
                path="warehouse-packages"
                element={<WarehousePackages />}
              />
              <Route
                path="warehouse-packages/:category"
                element={<WarehousePackages />}
              />

              <Route
                path="warehouse-package-products/:id"
                element={<WarehousePackageProducts />}
              />

              <Route path="warehouse-types" element={<WarehouseTypes />} />
              <Route
                path="warehouse-types/:category"
                element={<WarehouseTypes />}
              />

              <Route
                path="warehouse-product-lots/:id"
                element={<WarehouseProductLots />}
              />

              {hasPrivilege(
                privileges,
                ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD,
              ) ? (
                <>
                  <Route
                    path="warehouse-product-mutations/:id"
                    element={<WarehouseProductMutations />}
                  />
                  <Route
                    path="warehouse-product-mutations/:id/:lotId"
                    element={<WarehouseProductMutations />}
                  />
                </>
              ) : null}
            </>
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_PRICING_CRUD) ? (
            <>
            <Route
              path="warehouse-products/prices"
              element={<WarehouseProductPriceList />}
            />
            <Route
                path="warehouse-products/prices/category/:category"
                element={<WarehouseProductPriceList />}
              />
            <Route
              path="warehouse-products/prices/:id"
              element={<WarehouseProductPrices />}
            />
            </>
          ) : null}

              <Route
                path="order"
                element={<OrderMain />}
              />
          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ? (
            <>
              <Route
                path="create-request-order"
                element={<CreateRequestOrder />}
              />
              <Route
                path="order-package-item/:category/:id/:storageId"
                element={<OrderPackageItem />}
              />
              
            </>
          ) : null}

{hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
<>
<Route
                path="request-order/:id"
                element={<RequestOrder />}
              />
              </>
) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_HOSPITALS_CRUD) ? (
            <>
              <Route path="hospitals" element={<Hospitals />} />
              <Route path="hospitals/:storageId" element={<Hospitals />} />
            </>
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_DOCTORS_CRUD) ? (
            <>
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:status" element={<Doctors />} />
              <Route path="doctor/:id" element={<Doctor />} />
            </>
          ) : null}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  privileges: store.userState.privileges,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserPrivileges,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(Init);
