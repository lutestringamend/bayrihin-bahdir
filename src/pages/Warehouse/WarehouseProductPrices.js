import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getWarehouseProductById } from "../../parse/warehouse/product";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";
import { overhaulReduxOrderHospitals } from "../../utils/order";
import { getHospitalsData } from "../../parse/order";
import { postWarehouseProductPrices } from "../../parse/warehouse/product_prices";
import { formatPrice } from "../../utils";

const defaultPricesData = {
  priceHET: "",
  priceCOGS: "",
}

const defaultModalData = {
  visible: false,
  loading: false,
  hospitalId: null,
  price: "",
};

const defaultModalErrors = {
  hospitalId: "",
  price: "",
};

function WarehouseProductPrices(props) {
  const { currentUser, hospitals } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [priceData, setPriceData] = useState(defaultPricesData);
  const [errors, setErrors] = useState(defaultPricesData);
  const [customPrice, setCustomPrice] = useState([]);
  

  const [modalData, setModalData] = useState(defaultModalData);
  const [modalErrors, setModalErrors] = useState(defaultModalErrors);

  useEffect(() => {
    if (params?.id === undefined || params?.id === null) {
      setProductData(null);
      setCustomPrice([]);
      return;
    }
    fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (hospitals?.length === undefined || hospitals?.length < 1) {
      fetchHospitals();
    }
  }, [hospitals]);

  const fetchHospitals = async () => {
    const result = await getHospitalsData();
    if (!(result === undefined || result?.length === undefined)) {
      props.overhaulReduxOrderHospitals(result);
    }
  };


  let fetchData = async () => {
    setLoading(true);
    let productData = null;
    let customPrice = [];
    try {
      productData = await getWarehouseProductById(params?.id);
      console.log("productData", productData);
      setPriceData({
        priceHET: productData?.priceHET ? productData?.priceHET : "",
        priceCOGS: productData?.priceCOGS ? productData?.priceCOGS : "",
      });
      setErrors(defaultPricesData);
      if (productData?.customPriceMetadata) {
        customPrice = JSON.parse(productData?.customPriceMetadata);
      }
    } catch (e) {
      console.error(e);
    }
    setProductData(productData);
    setCustomPrice(customPrice);
    setLoading(false);
  };

 

  const handleDelete = async (hospitalId) => {
    try {
      const confirmDelete = window.confirm(
        "Yakin mau menghapus harga custom untuk hospital ini? Penghapusan bersifat permanen.",
      );
      if (confirmDelete) {
        
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const openNewPriceModal = () => {
    setModalData({
      visible: true,
      hospitalId: null,
      price: "",
    });
    setModalErrors(defaultModalErrors);
  }

  const setPriceModal = (p) => {
    setModalData({
      visible: true,
      hospitalId: p?.hospitalId,
      price: p?.price,
    });
    setModalErrors(defaultModalErrors);
  };

  const saveModalData = async () => {
    let newErrors = defaultModalErrors;
    let isComplete = true;

    if (modalData?.hospitalId === null || modalData?.hospitalId === "") {
      isComplete = false;
      newErrors = { ...newErrors, hospitalId: "Pilih hospital" };
    }
    if (modalData?.price === "" || isNaN(parseInt(modalData?.price))) {
      isComplete = false;
      newErrors = { ...newErrors, price: "Isikan harga yang benar" };
    }

    setModalErrors(newErrors);

    if (isComplete) {
      setModalData({ ...modalData, loading: true });

      let newMetadata = [];
      let isFound = false;
      for (let i of customPrice) {
        if (i?.hospitalId === modalData?.hospitalId) {
          isFound = true;
          newMetadata.push({
            hospitalId: modalData?.hospitalId,
            price: parseInt(modalData?.price),
          })
        } else {
          newMetadata.push(i);
        }
      }
      if (!isFound) {
        newMetadata.push({
          hospitalId: modalData?.hospitalId,
          price: parseInt(modalData?.price),
        })
      }

      let result = await postWarehouseProductPrices(params?.id, null, null, JSON.stringify(newMetadata));
      if (result) {
        fetchData();
        setModalData(defaultModalData);
        setModalErrors(defaultModalErrors);
      } else {
        setModalData({ ...modalData, loading: false });
      }
    }
  };

  const submit = async () => {
    let newErrors = defaultPricesData;
    let isComplete = true;

    if (priceData?.priceHET === "" || isNaN(parseInt(priceData?.priceHET))) {
      isComplete = false;
      newErrors = { ...newErrors, priceHET: "Isikan HET yang benar" };
    }
    if (priceData?.priceCOGS === "" || isNaN(parseInt(priceData?.priceCOGS))) {
      isComplete = false;
      newErrors = { ...newErrors, priceCOGS: "Isikan COGS yang benar" };
    }

    setErrors(newErrors);

    if (isComplete) {
      try {
        let result = await postWarehouseProductPrices(params?.id, priceData?.priceHET, priceData?.priceCOGS, null);
        if (result) {
          fetchData();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }



  const closeModal = () => {
    if (!modalData?.loading) {
      setModalErrors(defaultModalErrors);
      setModalData(defaultModalData);
    }
  };


  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Price List Produk</h1>
        <div className="d-sm-flex flex-1 mb-0 align-items-center justify-content-between">
          <button
            className="d-none d-sm-inline-block btn btn-sm btn-secondary shadow-sm mx-1"
            onClick={() => openNewPriceModal()}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ marginRight: "0.25rem", color: "white" }}
            />
            Tambah Harga Custom
          </button>
          <button
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => submit()}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Submit
        </button>
        </div>
      </div>

      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Harga Eceran Tertinggi (HET)</b>
        </label>
        <input
          name="priceHET"
          value={priceData?.priceHET}
          onChange={(e) =>
            setPriceData({
              ...priceData,
              priceHET: e.target.value,
            })
          }
          type={"number"}
          className={`form-control ${
            errors?.priceHET ? "is-invalid" : ""
          } `}
        />
        <span style={{ color: "red" }}>{errors?.priceHET}</span>
      </div>
      <div className="d-sm justify-content-between mb-4">
        <label>
          <b>Cost of Goods Sold (COGS)</b>
        </label>
        <input
          name="priceCOGS"
          value={priceData?.priceCOGS}
          onChange={(e) =>
            setPriceData({
              ...priceData,
              priceCOGS: e.target.value,
            })
          }
          type={"number"}
          className={`form-control ${
            errors?.priceCOGS ? "is-invalid" : ""
          } `}
        />
        <span style={{ color: "red" }}>{errors?.priceCOGS}</span>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {`${
              productData
                ? `${
                    productData?.category
                      ? WarehouseTypeCategories[parseInt(productData?.category)]
                      : ""
                  } -- ${productData?.name}`
                : "Loading..."
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
                    <th>Nama Hospital</th>
                    <th>Harga Custom</th>
                    <th width="15%">Aksi</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nama Hospital</th>
                    <th>Harga Custom</th>
                    <th width="15%">Aksi</th>
                  </tr>
                </tfoot>
                <tbody>
                  {customPrice.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td>{p?.hospitalId && hospitals ? hospitals.find(({ objectId }) => objectId === p?.hospitalId)?.name : ""}</td>
                        <td>{formatPrice(p?.price)}</td>
                        <td>
                          <button
                            onClick={() => setPriceModal(p)}
                            className="btn btn-info btn-sm mr-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p?.hospitalId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button>
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

      <Modal show={modalData?.visible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData?.hospitalId ? "Edit Harga Custom" : "Tambah Harga Custom"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalData?.hospitalId
              ? `Edit Harga Custom produk berikut ini`
              : "Tambahkan Harga Custom produk sesuai dengan hospital"}
          </p>
          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Hospital</b>
              </label>
              <select
                name="hospital"
                value={
                  modalData?.hospitalId
                    ? modalData?.hospitalId
                    : ""
                }
                onChange={(e) =>
                  setModalData({
                    ...modalData,
                    hospitalId: e.target.value,
                  })
                }
                className={`form-control ${
                  modalErrors.hospitalId ? "is-invalid" : ""
                } `}
              >
                <option value="">----Pilih Hospital----</option>
                {hospitals?.length === undefined || hospitals?.length < 1
                  ? null
                  : hospitals.map((item, index) => (
                      <option key={index} value={item?.objectId}>
                        {item?.name}
                      </option>
                    ))}
              </select>
              <span style={{ color: "red" }}>
                {modalErrors?.warehouseStorage}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10">
              <label>
                <b>Harga Custom</b>
               </label>
              <input
                name="price"
                placeholder="Isi dengan angka dalam Rupiah"
                value={modalData?.price}
                onChange={(e) =>
                  setModalData({ ...modalData, price: e.target.value })
                }
                type={"number"}
                className={`form-control ${
                  modalErrors?.price ? "is-invalid" : ""
                } `}
              />
              <span style={{ color: "red" }}>{modalErrors?.price}</span>
            </div>
          </div>
        </Modal.Body>
        {modalData?.loading ? (
          <Modal.Footer>
            <FadeLoader
              color="#4e73df"
              loading={modalData?.loading}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeModal()}>
              Tutup
            </Button>
            <Button
              disabled={modalData?.price === ""}
              variant="primary"
              onClick={() => saveModalData()}
            >
              Simpan
            </Button>
          </Modal.Footer>
        )}
      </Modal>

    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  hospitals: store.orderState.hospitals,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxOrderHospitals,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(WarehouseProductPrices);
