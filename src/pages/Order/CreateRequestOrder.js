import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getWarehousePackageData,
  getWarehouseStorageData,
} from "../../parse/warehouse";
import {
  deleteItemsFromRequestOrderPackage,
  overhaulReduxNewOrder,
} from "../../utils/order";
import RequestOrderTable from "../../components/tables/RequestOrderTable";
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";*/

const defaultModalData = {
  visible: false,
  loading: false,
  objectId: null,
  category: null,
  name: "",
  unitPackageGrouping: "",
};
const defaultModalErrors = {
  name: "",
  category: "",
  unitPackageGrouping: "",
};

const DefaultPackages = {
  implants: [],
  instruments: [],
  units: [],
};

function CreateRequestOrder(props) {
  const { currentUser, newOrder } = props;
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState(null);

  useEffect(() => {
    prepareData();
  }, []);

  useEffect(() => {
    console.log("redux newOrder", newOrder);
    if (newOrder !== null && loading) {
      setLoading(false);
    }
  }, [newOrder]);

  let prepareData = () => {
    if (newOrder === null) {
      fetchData();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const storages = await getWarehouseStorageData();
    console.log("Storages", storages);
    setStorages(storages);
    const result = await getWarehousePackageData(params?.category);
    let implants = [];
    let instruments = [];
    let units = [];
    for (let r of result) {
      if (r?.category === 1) {
        implants.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      } else if (r?.category === 2) {
        instruments.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      } else if (r?.category === 3) {
        units.push({
          objectId: r?.objectId,
          name: r?.name,
          notes: "",
          items: [],
        });
      }
    }
    props.overhaulReduxNewOrder({
      implants,
      instruments,
      units,
    });
  };

  const deleteItem = (category, objectId) => {
    let implants = newOrder?.implants;
    let instruments = newOrder?.instruments;
    let units = newOrder?.units;
    if (category === 1) {
      implants = deleteItemsFromRequestOrderPackage(implants, objectId);
    } else if (category == 2) {
      instruments = deleteItemsFromRequestOrderPackage(instruments, objectId);
    } else if (category === 3) {
      units = deleteItemsFromRequestOrderPackage(units, objectId);
    }
    props.overhaulReduxNewOrder({
      implants,
      instruments,
      units,
    });
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Buat Request Order Baru</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          onClick={() => console.log("createrequestorder")}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Submit
        </a>
      </div>

      <p>Nomor DO: 3183/ALV/III/2024</p>
      <p>Nama Dokter</p>
      <p>Prosedur</p>
      <p>Tanggal Prosedur</p>
      <p>Rumah Sakit</p>

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <select
          name="category"
          value={params?.category}
          onChange={(e) => setSelectedStorage(e.target.value)}
          className="form-control"
        >
          <option value="">----Pilih Region----</option>
          {storages.map((item, index) => (
            <option key={index} value={item?.objectId}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      {loading || newOrder === null ? (
        <FadeLoader
          color="#4e73df"
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          <RequestOrderTable
            title="Implant & Disposable"
            category={1}
            list={newOrder?.implants}
            deleteItem={(e) => deleteItem(1, e)}
          />
          <RequestOrderTable
            title="Instrument"
            category={2}
            list={newOrder?.instruments}
            deleteItem={(e) => deleteItem(2, e)}
          />
          <RequestOrderTable
            title="Unit"
            category={3}
            list={newOrder?.units}
            deleteItem={(e) => deleteItem(3, e)}
          />
        </>
      )}
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

export default connect(mapStateToProps, mapDispatchProps)(CreateRequestOrder);
