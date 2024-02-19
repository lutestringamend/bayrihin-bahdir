import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";

import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { WarehouseMainStats } from "../../models/warehouse";
import { fetchWarehouseMainData } from "../../parse/warehouse";
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
          target="/portal/warehouse/mutations"
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
            target="/portal/warehouse-products"
          title="Products"
          value={stats?.products}
          color="primary"
        />
        <ButtonModuleMain
          target="/portal/warehouse-storages"
          title="Regions"
          value={stats?.storages}
          color="info"
        />
        <ButtonModuleMain
          target="/portal/warehouse-types"
          title="Types"
          value={stats?.types}
          color="info"
        />

        
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Product List</h6>
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
                    <th>Catalog No</th>
                    <th>Tipe</th>
                    <th>Nama</th>
                    <th>Terakhir Update</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                  <th>Catalog No</th>
                    <th>Tipe</th>
                    <th>Nama</th>
                    <th>Terakhir Update</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {productList.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{p.catalogNo}</td>
                        <td>
                          {p?.warehouseType
                            ? p?.warehouseType?.name
                              ? p?.warehouseType?.name
                              : ""
                            : ""}
                        </td>
                        <td>{p.name}</td>
                        <td>
                            <p>{new Date(p.updatedAt).toLocaleString("id-ID")}</p>
                        </td>
                        <th>
                          <p>
                          <Link
                              to={`/portal/warehouse-product-mutations/${p.objectId}`}
                              className="btn btn-primary btn-sm mr-1"
                            >
                              Mutasi
                            </Link>
                            <Link
                              to={`/portal/warehouse-product-lots/${p.objectId}`}
                              className="btn btn-info btn-sm mr-1"
                            >
                              Lot
                            </Link>
                          </p>
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
