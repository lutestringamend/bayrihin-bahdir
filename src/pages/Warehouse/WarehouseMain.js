import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import ButtonModuleMain from "../../components/buttons/ButtonModuleMain";
import { WarehouseMainStats } from "../../models/warehouse";
import { fetchWarehouseMainData } from "../../parse/warehouse";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import { WarehouseMainTabs } from "../../constants/warehouse";
import { getWarehouseProductByName } from "../../parse/warehouse/product";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function WarehouseMain() {
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(WarehouseMainStats);
  const [productList, setProductList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetchData();
    console.log("params category", params.category);
  }, [params?.category]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (searchText === null || searchText === "") {
      setSearchList([]);
      return;
    }
    timeoutRef.current = setTimeout(searchProductByName, 1000);
  }, [searchText]);

  useEffect(() => {
    console.log("searchList", searchList);
  }, [searchList]);

  let fetchData = async () => {
    setLoading(true);
    const result = await fetchWarehouseMainData(params?.category);
    console.log(result);
    setProductList(result?.productList);
    setStats(result?.stats);
    setLoading(false);
  };

  let searchProductByName = async () => {
    setLoading(true);
    const result = await getWarehouseProductByName(
      searchText,
      params?.category,
    );
    setSearchList(result);
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
        <h1 className="h3 mb-0 text-gray-800">{`Warehouse Management - ${
          params?.category
            ? WarehouseMainTabs.find(
                ({ category }) => category === params?.category,
              ).title
            : WarehouseMainTabs[0].title
        }`}</h1>
      </div>
      <div className="d-sm-flex align-items-center mb-4">
        {WarehouseMainTabs.map((item, index) => (
          <Link
            key={index}
            to={`/warehouse/${item.category}`}
            className={`btn ${
              params?.category === item.category ||
              (index === 0 &&
                (params.category === undefined ||
                  params.category === null ||
                  params.category === ""))
                ? "btn-primary"
                : "btn-info"
            } btn-md mr-1`}
          >
            {item.title}
          </Link>
        ))}
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
          target="/warehouse-packages"
          title="Paket"
          value={stats?.packages}
          color="info"
        />
      </div>
      <div className="d-sm-flex mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-white"
            placeholder="Cari nama produk, brand atau catalog no"
            aria-label="Search"
            aria-describedby="basic-addon2"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {searchText
              ? `Hasil pencarian "${searchText}"`
              : "Daftar produk, diurutkan berdasarkan update mutasi terakhir"}
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
                {searchText ? (
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Brand</th>
                      <th>Cat No</th>
                      <th width="50%">Product Desc</th>
                      <th>Updated</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                ) : (
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
                )}

                {searchText ? (
                  <tfoot>
                    <tr>
                      <th>Kategori</th>
                      <th>Brand</th>
                      <th>Cat No</th>
                      <th width="50%">Product Desc</th>
                      <th>Updated</th>
                      <th>Aksi</th>
                    </tr>
                  </tfoot>
                ) : (
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
                )}

                <tbody>
                  {searchText
                    ? searchList.map((p, index) => (
                        <tr key={index}>
                          <td>
                            <p>
                              {" "}
                              {p?.category
                                ? WarehouseTypeCategories[p?.category]
                                : ""}
                            </p>
                            {p?.subCategory ? <p>{p?.subCategory}</p> : null}
                          </td>
                          <td>{p?.brand}</td>
                          <td>{p?.catalogNo}</td>

                          <td>{p?.name}</td>
                          <td>
                            <p>
                              {p?.updatedAt
                                ? new Date(p?.updatedAt).toLocaleString("id-ID")
                                : ""}
                            </p>
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
                      ))
                    : productList.map((p, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {p?.warehouseProduct
                                ? p?.warehouseProduct?.brand
                                : "-"}
                            </td>
                            <td>
                              {p?.warehouseProduct
                                ? p?.warehouseProduct?.catalogNo
                                : "-"}
                            </td>

                            <td>
                              {p?.warehouseProduct
                                ? p?.warehouseProduct?.name
                                : "-"}
                            </td>
                            <td>
                              {p?.warehouseProductLot
                                ? p?.warehouseProductLot?.name
                                : "-"}
                            </td>
                            <td>{p?.balanceStock}</td>
                            <td>{p?.balanceOnDelivery}</td>
                            <th>
                              {p?.warehouseProduct ? (
                                p?.warehouseProduct?.objectId ? (
                                  <p>
                                    <Link
                                      to={`/warehouse-product-mutations/${p?.warehouseProduct?.objectId}`}
                                      className="btn btn-primary btn-sm mr-1"
                                    >
                                      Mutasi
                                    </Link>
                                  </p>
                                ) : null
                              ) : null}

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
