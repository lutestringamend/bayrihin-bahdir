import React, { useEffect, useState } from "react";
import { WarehouseTypeCategories } from "../../constants/warehouse_types";

const DeliveryOrderInventoryTable = (props) => {
  const { category, list, disabled } = props;
  const [sum, setSum] = useState([]);

  useEffect(() => {
    let newSum = [];
    try {
      for (let l of list) {
        let quantity = 0;
        if (
          !(
            l?.items === undefined ||
            l?.items?.length === undefined ||
            l?.items?.length < 1
          )
        ) {
          for (let i of l?.items) {
            quantity += parseInt(i?.quantity);
          }
        }
        newSum.push({
          objectId: l?.objectId,
          quantity: quantity ? quantity.toString() : "-",
        });
      }
    } catch (e) {
      console.error(e);
    }
    setSum(newSum);
  }, [list]);

  const editInventoryPackage = (
    objectId,
    isDelete,
    notes,
    newItem,
    productId,
    quantity,
    deleteItem,
  ) => {
    if (
      !(
        props?.editInventoryPackage === undefined ||
        props?.editInventoryPackage === null
      )
    ) {
      props?.editInventoryPackage(
        objectId,
        isDelete,
        notes,
        newItem,
        productId,
        quantity,
        deleteItem,
      );
    }
  };

  const deletePackage = (name, objectId) => {
    const confirm = window.confirm(
      `Apakah yakin ingin menghapus paket ${name}?`,
    );
    if (confirm) {
      editInventoryPackage(objectId, true, null, null);
    }
  };

  const deleteItem = (name, objectId, itemId) => {
    const confirm = window.confirm(
      `Apakah yakin ingin menghapus item ${name}?`,
    );
    if (confirm) {
      editInventoryPackage(objectId, false, null, null, itemId, 0, true);
    }
  };

  const openModalItem = (objectId, name) => {
    if (
      !(props?.openModalItem === undefined || props?.openModalItem === null)
    ) {
      props?.openModalItem(objectId, name);
    }
  };

  const openModalPackage = () => {
    if (
      !(
        props?.openModalPackage === undefined ||
        props?.openModalPackage === null
      )
    ) {
      props?.openModalPackage();
    }
  };

  const openModalProductStorage = (objectId, name, quantity, packageId, productStorageId) => {
    if (
      !(
        props?.openModalProductStorage === undefined ||
        props?.openModalProductStorage === null
      )
    ) {
      props?.openModalProductStorage(objectId, name, quantity, packageId, productStorageId);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">
          {WarehouseTypeCategories[category]}
        </h6>
        {disabled ? null : (
          <button
            onClick={() => openModalPackage()}
            className="btn btn-info btn-sm mx-3"
          >
            Tambah Paket
          </button>
        )}
      </div>
      <div className="card-body">
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
                <th width="50%">Nama</th>
                <th>Qty</th>
                <th width="25%">Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{p?.name}</td>
                      <td>
                        {sum?.length > 0
                          ? sum.find(({ objectId }) => objectId === p?.objectId)
                              ?.quantity
                          : ""}
                      </td>
                      <td>
                        <textarea
                          name="notes"
                          value={p?.notes}
                          disabled={disabled}
                          onChange={(e) =>
                            editInventoryPackage(
                              p?.objectId,
                              false,
                              e.target.value,
                              null,
                            )
                          }
                          type={"text"}
                          rows="3"
                          className="form-control"
                        />
                      </td>

                      <td>
                        {disabled ? null : (
                          <>
                            <p>
                              <button
                                onClick={() =>
                                  openModalItem(p?.objectId, p?.name)
                                }
                                className="btn btn-info btn-sm mr-1"
                              >
                                Tambah Item
                              </button>
                            </p>

                            <p>
                              <button
                                onClick={() =>
                                  deletePackage(p?.name, p?.objectId)
                                }
                                className="btn btn-danger btn-sm mr-1"
                              >
                                Hapus
                              </button>
                            </p>
                          </>
                        )}
                      </td>
                    </tr>
                    {p?.items?.length === undefined ||
                    p?.items?.length < 1 ? null : (
                      <tr key={p?.objectId}>
                        <td colSpan={5}>
                          <table
                            className="table table-bordered"
                            id="dataTable"
                            width="100%"
                            cellSpacing="0"
                          >
                            <thead>
                              <td width="45%">Nama</td>
                              <td width="7%">Qty</td>
                              <td>Lot Dipilih</td>
                              <td width="7%">Tersedia</td>
                              <td width="15%">Aksi</td>
                            </thead>
                            {p?.items.map((item, i) => (
                              <tr key={i}>
                                <td width="45%">
                                  {item?.name ? item?.name : item?.objectId}
                                </td>
                                <td>
                                  <input
                                    name="quantity"
                                    value={parseInt(item?.quantity)}
                                    disabled={disabled}
                                    onChange={(e) =>
                                      editInventoryPackage(
                                        p?.objectId,
                                        false,
                                        p?.notes,
                                        null,
                                        item?.objectId,
                                        e.target.value,
                                        false,
                                      )
                                    }
                                    type="number"
                                    className="form-control"
                                  />
                                </td>
                                <td>
                                  <div
                                    className={
                                      item?.warehouseProductStorage
                                        ? item?.warehouseProductStorage
                                            ?.warehouseProductLot
                                          ? item?.warehouseProductStorage
                                              ?.warehouseProductLot?.objectId
                                            ? "text-info-highlight"
                                            : "text-danger-highlight"
                                          : "text-danger-highlight"
                                        : "text-danger-highlight"
                                    }
                                  >
                                    {item?.warehouseProductStorage
                                      ? item?.warehouseProductStorage
                                          ?.warehouseProductLot
                                        ? item?.warehouseProductStorage
                                            ?.warehouseProductLot?.name
                                        : "Belum ditunjuk"
                                      : "Belum ditunjuk"}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={
                                      item?.warehouseProductStorage
                                        ? item?.warehouseProductStorage
                                            ?.balanceStock
                                          ? item?.warehouseProductStorage
                                              ?.balanceStock
                                            ? "text-yellow-highlight"
                                            : "text-danger-highlight"
                                          : "text-danger-highlight"
                                        : "text-danger-highlight"
                                    }
                                  >
                                    {item?.warehouseProductStorage
                                      ? item?.warehouseProductStorage
                                          ?.balanceStock
                                        ? item?.warehouseProductStorage
                                            ?.balanceStock
                                        : "0"
                                      : "0"}
                                  </div>
                                </td>
                                <td width="15%">
                                  {disabled ? null : (
                                    <>
                                      <p>
                                        <button
                                          onClick={() =>
                                            openModalProductStorage(
                                              item?.objectId,
                                              item?.name,
                                              item?.quantity,
                                              p?.objectId,
                                              item?.warehouseProductStorage ? item?.warehouseProductStorage?.objectId : null,
                                            )
                                          }
                                          className="btn btn-primary btn-sm mr-1"
                                        >
                                          Pilih Lot
                                        </button>
                                      </p>
                                      <p>
                                        <button
                                          onClick={() =>
                                            deleteItem(
                                              item?.name,
                                              p?.objectId,
                                              item?.objectId,
                                            )
                                          }
                                          className="btn btn-danger btn-sm mr-1"
                                        >
                                          Hapus
                                        </button>
                                      </p>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderInventoryTable;
