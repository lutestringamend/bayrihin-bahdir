import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";

import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { WarehouseMainStats } from "../../models/warehouse";
import { fetchWarehouseMainData } from "../../parse/warehouse";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function WarehouseMain() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(WarehouseMainStats);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  let fetchData = async () => {
    setLoading(true);
    const result = await fetchWarehouseMainData();
    console.log(result);
    setProductList(result?.productList);
    setStats(result?.stats);
    setLoading(false);
  };

  /*
<ButtonModuleMain
          target="/warehouse/mutations"
          title="Check Mutation"
          color="primary"
        />
  */

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Warehouse Management</h1>
      </div>
      <div className="row">
        <ButtonModuleMain
          target="/warehouse-products"
          title="Products"
          value={stats?.products}
          color="primary"
        />
        <ButtonModuleMain
          target="/warehouse-storages"
          title="Regions"
          value={stats?.storages}
          color="info"
        />
        <ButtonModuleMain
          target="/warehouse-types"
          title="Types"
          value={stats?.types}
          color="info"
        />
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Product List, diurutkan berdasarkan update terakhir
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
                    <th>Brand</th>
                    <th>Cat No</th>
                    <th width="40%">Product Desc</th>
                    <th width="15%">Lot</th>
                    <th width="7%">Stock</th>
                    <th width="7%">On-Deliv</th>
                    <th width="7%">Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Brand</th>
                    <th>Cat No</th>
                    <th width="40%">Product Desc</th>
                    <th width="15%">Lot</th>
                    <th width="7%">Stock</th>
                    <th width="7%">On-Deliv</th>
                    <th width="7%">Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {p?.brand}
                        </td>
                        <td>{p?.catalogNo}</td>

                        <td>
                          {p?.name}
                        </td>
                        <td></td>
                        <td>
                         {p?.balanceStock}
                        </td>
                        <td>
                          {p?.balanceOnDelivery}
                        </td>
                        <th>
                          <p>
                            <Link
                              to={`/warehouse-product-mutations/${p.objectId}`}
                              className="btn btn-primary btn-sm mr-1"
                            >
                              Mutasi
                            </Link>
                          </p>
                          {p?.category === 1 ? null : (
                            <p>
                              <Link
                                to={`/warehouse-product-lots/${p.objectId}`}
                                className="btn btn-info btn-sm mr-1"
                              >
                                Lot
                              </Link>
                            </p>
                          )}
                        </th>
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

/*
<a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: "0.25rem", color: "white" }} />
                    Generate Report
                </a>
*/

export default WarehouseMain;
