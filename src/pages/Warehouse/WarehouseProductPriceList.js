import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseProductData } from "../../parse/warehouse";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import { formatPrice } from "../../utils";
import { getWarehouseProductByName } from "../../parse/warehouse/product";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

function WarehouseProductPriceList() {
  const params = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [params?.category]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (searchText === null || searchText === "") {
      setSearchList([]);
      return;
    }
    timeoutRef.current = setTimeout(searchProductByName, 500);
  }, [searchText]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getWarehouseProductData(
      params?.category ? null : 20,
      "updatedAt",
      params?.category,
    );
    //console.log("getWarehouseProductData result", result);

    setProductList(result);
    setLoading(false);
  };

  let searchProductByName = async () => {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    const result = await getWarehouseProductByName(
      searchText,
      params?.category,
    );
    setSearchList(result);
    setLoading(false);
  };

  const ProductPriceTableRow = ({ p }) => {
    return (
      <tr>
        <td>
          <p>{p?.category ? WarehouseTypeCategories[p?.category] : ""}</p>
          {p?.subCategory ? <p>{p?.subCategory}</p> : null}
        </td>
        <td>{p?.brand}</td>
        <td>{p?.catalogNo}</td>

        <td>{p?.name}</td>
        <td>
          <p>{p?.priceHET ? formatPrice(p?.priceHET) : "-"}</p>
        </td>
        <td>
          <p>{p?.priceCOGS ? formatPrice(p?.priceCOGS) : "-"}</p>
        </td>
        <th>
          <p>
            <Link
              to={`/warehouse-products/prices/${p?.objectId}`}
              className="btn btn-primary btn-sm mr-1"
            >
              Edit Harga
            </Link>
          </p>
        </th>
      </tr>
    );
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Daftar Harga Produk</h1>
      </div>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params.category}
          onChange={(e) =>
            navigate(
              e.target.value === undefined ||
                e.target.value === null ||
                e.target.value === "" ||
                parseInt(e.target.value) < 1
                ? "/warehouse-products/prices"
                : `/warehouse-products/prices/category/${e.target.value}`,
            )
          }
          className="form-control"
        >
          {WarehouseTypeCategories.map((item, index) => (
            <option key={index} value={index}>
              {index === 0 ? "----Semua Kategori----" : item}
            </option>
          ))}
        </select>
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
              : `Daftar Produk, berdasarkan update terbaru${
                  params?.category === undefined ||
                  isNaN(params?.category) ||
                  parseInt(params?.category) < 1
                    ? ""
                    : ` --- ${WarehouseTypeCategories[params?.category]}`
                }`}
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
                    <th>Kategori</th>
                    <th>Brand</th>
                    <th>Cat No</th>
                    <th width="40%">Product Desc</th>
                    <th>HET</th>
                    <th>COGS</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Kategori</th>
                    <th>Brand</th>
                    <th>Cat No</th>
                    <th width="40%">Product Desc</th>
                    <th>HET</th>
                    <th>COGS</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {searchText
                    ? searchList.map((p, index) => (
                        <ProductPriceTableRow key={index} p={p} />
                      ))
                    : productList.map((p, index) => (
                        <ProductPriceTableRow key={index} p={p} />
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WarehouseProductPriceList;
