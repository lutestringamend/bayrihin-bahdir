import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../App.css";
import "../sb-admin-2.min.css";

import Login from "../pages/Auth/Login";
import Portal from "../pages/Portal/Portal";
import Home from "./Home/Home";
import Error from "./Error/Error";

import AccountDetails from "./Account/AccountDetails";
import UserManagement from "./User/UserManagement";
import AccountPrivilegeEdit from "./User/AccountPrivilegeEdit";

import WarehouseMain from "../pages/Warehouse/WarehouseMain";
import WarehouseProducts from "../pages/Warehouse/WarehouseProducts";
import WarehouseStorages from "../pages/Warehouse/WarehouseStorages";
import WarehousePackages from "./Warehouse/WarehousePackages";
import WarehouseTypes from "../pages/Warehouse/WarehouseTypes";
import WarehouseProductMutations from "../pages/Warehouse/WarehouseProductMutations";
import WarehouseProductLots from "../pages/Warehouse/WarehouseProductLots";
import WarehousePackageProducts from "./Warehouse/WarehousePackageProducts";
import WarehouseProductPriceList from "./Warehouse/WarehouseProductPriceList";
import WarehouseProductPrices from "./Warehouse/WarehouseProductPrices";
import WarehouseInstrumentTrays from "./Warehouse/WarehouseInstrumentTrays";

import RequestOrders from "./Order/RequestOrder/RequestOrders";
import CreateRequestOrder from "./Order/RequestOrder/CreateRequestOrder";
import RequestOrder from "./Order/RequestOrder/RequestOrder";
import OrderPackageItem from "./Order/OrderPackageItem";

import DeliveryOrders from "./Order/DeliveryOrder/DeliveryOrders";
import DeliveryOrder from "./Order/DeliveryOrder/DeliveryOrder";
import DeliveryOrderImplant from "./Order/DeliveryOrder/DeliveryOrderImplant";
import DeliveryOrderInstrument from "./Order/DeliveryOrder/DeliveryOrderInstrument";

import OrderMain from "./Order/OrderMain";
import Hospitals from "./Order/Hospitals";
import Doctors from "./Order/Doctors";
import Doctor from "./Order/Doctor";
import Documents from "./Document/Documents";

import TrackingOrderDeliveries from "./Tracking/Delivery/TrackingOrderDeliveries";
import TrackingOrderDelivery from "./Tracking/Delivery/TrackingOrderDelivery";
import TrackingOrderPickups from "./Tracking/Pickup/TrackingOrderPickups";
import TrackingOrderPickup from "./Tracking/Pickup/TrackingOrderPickup";
import TrackingEvents from "./Tracking/TrackingEvents";

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
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT,
  ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
  ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER,
  ACCOUNT_PRIVILEGE_VIEW_DELIVERY_ORDER,
  ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
} from "../constants/account";
import { hasPrivilege } from "../utils/account";
import { getAccountRoleEntry } from "../parse/account";
import { updateReduxUserPrivileges } from "../utils/user";
import { USER_ROLE_DEVELOPER, USER_ROLE_SUPERADMIN } from "../constants/user";

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
    //console.log("redux privileges", privileges);
  }, [privileges]);

  const fetchPrivileges = async () => {
    try {
      const result = await getAccountRoleEntry(
        currentUser?.accountRole?.objectId,
      );
      if (
        !(
          result === undefined ||
          result?.privileges === undefined ||
          result?.privileges?.length === undefined
        )
      ) {
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
  };

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
          <Route path="" element={<Home />} />
          <Route path="*" element={<Error />} />
          <Route path="account-details" element={<AccountDetails />} />
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
                path="warehouse-products"
                element={<WarehouseProducts />}
              />
              <Route
                path="warehouse-products/:category"
                element={<WarehouseProducts />}
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
                path="warehouse-storages"
                element={<WarehouseStorages />}
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
                    path="warehouse-product-mutations/:id"
                    element={<WarehouseProductMutations />}
                  />
                  <Route
                    path="warehouse-product-mutations/:id/:lotId"
                    element={<WarehouseProductMutations />}
                  />
                  <Route
                    path="warehouse-instrument-trays"
                    element={<WarehouseInstrumentTrays />}
                  />
                  <Route
                    path="documents"
                    element={<Documents />}
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

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ||
          hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
            <Route path="order" element={<OrderMain />} />
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_CREATE_ORDER) ? (
            <>
              <Route
                path="order/create-request-order"
                element={<CreateRequestOrder />}
              />
              <Route
                path="order-package-item/:category/:id/:storageId"
                element={<OrderPackageItem />}
              />
            </>
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_VIEW_REQUEST_ORDER) || hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
            <>
             <Route path="order/request-orders" element={<RequestOrders />} />
              <Route
                path="order/request-orders/:filter"
                element={<RequestOrders />}
              />
              <Route
                path="order/request-order/:id"
                element={<RequestOrder />}
              />
            </>
          ) : null}

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_VIEW_DELIVERY_ORDER) || hasPrivilege(privileges, ACCOUNT_PRIVILEGE_ORDER_APPROVAL) ? (
            <>
              <Route
                path="order/delivery-orders"
                element={<DeliveryOrders />}
              />
              <Route
                path="order/delivery-orders/:type"
                element={<DeliveryOrders />}
              />
              <Route
                path="order/delivery-orders/:type/:filter"
                element={<DeliveryOrders />}
              />
              <Route
                path="order/delivery-order/:id"
                element={<DeliveryOrder />}
              />
            </>
          ) : null}

          {hasPrivilege(
            privileges,
            ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT,
          ) ||
          hasPrivilege(
            privileges,
            ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
          ) ? (
            <Route
              path="order/delivery-order-implant/:id"
              element={<DeliveryOrderImplant />}
            />
          ) : null}

          {hasPrivilege(
            privileges,
            ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
          ) ||
          hasPrivilege(
            privileges,
            ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
          ) ? (
            <Route
              path="order/delivery-order-instrument/:id"
              element={<DeliveryOrderInstrument />}
            />
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

<Route path="tracking/events" element={<TrackingEvents />} />

          {hasPrivilege(privileges, ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS) ? (
            <>
              <Route path="tracking/order-deliveries" element={<TrackingOrderDeliveries />} />
              <Route path="tracking/order-delivery/:id" element={<TrackingOrderDelivery />} />
              <Route path="tracking/order-pickups" element={<TrackingOrderPickups />} />
              <Route path="tracking/order-pickup/:id" element={<TrackingOrderPickup />} />
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
