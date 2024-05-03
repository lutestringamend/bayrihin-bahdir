import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehousePackageProductData } from "../../parse/warehouse";
import {
  insertItemsToRequestOrderPackage,
  overhaulReduxNewOrder,
} from "../../utils/order";
import { getWarehouseProductStoragesData } from "../../parse/warehouse/product_storage";

function OrderPackageItem(props) {
  const { currentUser, newOrder } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    prepareData();
  }, []);

  /*useEffect(() => {
    console.log("redux newOrder", newOrder);
    if (newOrder !== null && loading) {
      setLoading(false);
    }
  }, [newOrder]);*/

  useEffect(() => {
    if (packageData === null) {
      return;
    }
    fetchData();
    setNotes(packageData?.notes ? packageData?.notes : "");
  }, [packageData]);

  useEffect(() => {
    console.log("availabilities", availabilities);
  }, [availabilities]);

  let prepareData = () => {
    if (newOrder === null) {
      return;
    }
    setLoading(true);
    let found = null;
    if (parseInt(params?.category) === 1) {
      found = newOrder?.implants.find(
        ({ objectId }) => objectId === params?.id,
      );
    } else if (parseInt(params?.category) === 2) {
      found = newOrder?.instruments.find(
        ({ objectId }) => objectId === params?.id,
      );
    } else if (parseInt(params?.category) === 3) {
      found = newOrder?.units.find(({ objectId }) => objectId === params?.id);
    }
    if (found === undefined || found === null) {
      return;
    }
    setPackageData(found);
  };

  let fetchData = async () => {
    setAvailabilities([]);
    const result = await getWarehousePackageProductData(
      params?.id,
      params?.category,
    );
    let newList = [];
    let newQuantities = [];
    let newErrors = [];
    let newAvailabilites = [];

    for (let r of result) {
      let quantity = r?.quantity;
      if (
        !(
          packageData === null ||
          packageData?.items?.length === undefined ||
          packageData?.item?.length < 1
        )
      ) {
        let found = packageData?.items.find(
          ({ objectId }) => objectId === r?.objectId,
        );
        if (!(found === undefined || found?.quantity === undefined)) {
          quantity = parseInt(found?.quantity);
        }
      }
      newList.push({
        objectId: r?.objectId,
        name: r?.warehouseProduct
          ? r?.warehouseProduct?.name
            ? r?.warehouseProduct?.name
            : r?.objectId
          : r?.objectId,
      });
      newQuantities.push({
        objectId: r?.objectId,
        quantity,
      });
      newErrors.push({
        objectId: r?.objectId,
        error: "",
      });
      newAvailabilites.push({
        objectId: r?.objectId,
        productId: r?.warehouseProduct ? r?.warehouseProduct?.objectId : null,
        availability: null,
      });
    }
    setProductList(newList);
    setQuantities(newQuantities);
    setErrors(newErrors);
    fetchAvailabilites(newAvailabilites);
    setLoading(false);
  };

  const fetchAvailabilites = async (avail) => {
    let newAvailabilites = [];
    try {
      for (let a of avail) {
        let availability = null;
        let availabilityOnDelivery = null;
        const result = await getWarehouseProductStoragesData(
          a?.productId,
          params?.storageId,
          null,
          null,
          null,
          null,
        );
        console.log(
          "getWarehouseProductStoragesData",
          a?.productId,
          params?.storageId,
          result,
        );
        if (result === undefined) {
          availability = null;
        } else if (result?.length === undefined || result?.length < 1) {
          availability = 0;
        } else {
          for (let i of result) {
            availability += i?.balanceStock ? i?.balanceStock : 0;
            availabilityOnDelivery += i?.balanceOnDelivery
              ? i?.balanceOnDelivery
              : 0;
          }
        }
        newAvailabilites.push({
          objectId: a?.objectId,
          availability,
          availabilityOnDelivery,
        });
      }
    } catch (e) {
      console.error(e);
    }
    setAvailabilities(newAvailabilites);
  };

  const setQuantity = (p, quantity) => {
    let newQuantities = [];
    let newErrors = [];

    for (let q of quantities) {
      if (q?.objectId === p?.objectId) {
        newQuantities.push({
          ...q,
          quantity,
        });
      } else {
        newQuantities.push(q);
      }
    }
    for (let e of errors) {
      if (e?.objectId === p?.objectId) {
        newErrors.push({
          ...e,
          error:
            parseInt(quantity) > parseInt(p?.availability)
              ? "Jumlah melebihi ketersediaan stok"
              : "",
        });
      } else {
        newErrors.push(e);
      }
    }
    setErrors(newErrors);
    setQuantities(newQuantities);
  };

  const saveData = () => {
    let items = [];
    for (let l of productList) {
      items.push({
        objectId: l?.objectId,
        name: l?.name,
        quantity: parseInt(
          quantities.find(({ objectId }) => objectId === l?.objectId)?.quantity,
        ),
      });
    }

    let implants = newOrder?.implants;
    let instruments = newOrder?.instruments;
    let units = newOrder?.units;

    if (parseInt(params?.category) === 1) {
      implants = insertItemsToRequestOrderPackage(
        implants,
        params?.id,
        items,
        notes,
      );
    } else if (parseInt(params?.category) === 2) {
      instruments = insertItemsToRequestOrderPackage(
        instruments,
        params?.id,
        items,
        notes,
      );
    } else if (parseInt(params?.category) === 3) {
      units = insertItemsToRequestOrderPackage(units, params?.id, items, notes);
    }
    props.overhaulReduxNewOrder({
      implants,
      instruments,
      units,
    });
    navigate("/create-request-order");
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          {packageData?.name
            ? `Paket ${packageData?.name}`
            : "Detil Paket Request"}
        </h1>
        <button
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => saveData()}
        >
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Tambahkan Paket
        </button>
      </div>

      <div className="d-sm-flex flex-column mb-4">
        <label>
          <b>Notes</b>
        </label>
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          type={"text"}
          rows="3"
          className="form-control"
        />
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {loading ? "Loading paket..." : "Daftar item dan ketersediaan"}
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
                    <th>No</th>
                    <th width="60%">Nama</th>
                    <th>Jumlah Dibutuhkan</th>
                    <th>Ketersediaan</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>No</th>
                    <th width="60%">Nama</th>
                    <th>Jumlah Dibutuhkan</th>
                    <th>Ketersediaan</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p?.name ? p?.name : ""}</td>
                        <td>
                          <input
                            name="quantity"
                            disabled
                            value={
                              quantities.find(
                                ({ objectId }) => objectId === p?.objectId,
                              )?.quantity
                            }
                            onChange={(e) => setQuantity(p, e.target.value)}
                            type={"number"}
                            className={`form-control ${
                              errors.find(
                                ({ objectId }) => objectId === p?.objectId,
                              )?.error
                                ? "is-invalid"
                                : ""
                            } `}
                          />
                          <span style={{ color: "red" }}>
                            {
                              errors.find(
                                ({ objectId }) => objectId === p?.objectId,
                              )?.error
                            }
                          </span>
                        </td>
                        <td>
                          {availabilities?.length < 1 ||
                          availabilities.find(
                            ({ objectId }) => objectId === p?.objectId,
                          ) === undefined ||
                          availabilities.find(
                            ({ objectId }) => objectId === p?.objectId,
                          ) === null ||
                          availabilities.find(
                            ({ objectId }) => objectId === p?.objectId,
                          )?.availability === undefined ||
                          availabilities.find(
                            ({ objectId }) => objectId === p?.objectId,
                          )?.availability === null ? (
                            <FadeLoader
                              color="#4e73df"
                              loading={true}
                              size={12}
                            />
                          ) : (
                            <div
                              className={
                                availabilities.find(
                                  ({ objectId }) => objectId === p?.objectId,
                                )?.availability <
                                quantities.find(
                                  ({ objectId }) => objectId === p?.objectId,
                                )?.quantity
                                  ? "text-danger"
                                  : "text-primary"
                              }
                            >
                              {
                                availabilities.find(
                                  ({ objectId }) => objectId === p?.objectId,
                                )?.availability
                              }
                              {availabilities.find(
                                ({ objectId }) => objectId === p?.objectId,
                              )?.availabilityOnDelivery ? (
                                <p>{`On-Delivery: ${
                                  availabilities.find(
                                    ({ objectId }) => objectId === p?.objectId,
                                  )?.availabilityOnDelivery
                                }`}</p>
                              ) : null}
                            </div>
                          )}
                          {}
                        </td>
                       
                      </tr>
                    );
                  })}
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
  currentUser: store.userState.currentUser,
  newOrder: store.orderState.newOrder,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxNewOrder,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(OrderPackageItem);
