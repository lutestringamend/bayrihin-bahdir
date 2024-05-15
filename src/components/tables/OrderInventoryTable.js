import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderInventoryTable = (props) => {
  const { title, category, list, warehouseStorageId } = props;
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

  const deleteItem = (objectId) => {
    if (!(props?.deleteItem === undefined || props?.deleteItem === null)) {
      props?.deleteItem(objectId);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header my-3 d-sm-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
        <button
                            className="btn btn-primary btn-sm mx-3"
                          >
                            Tambah Paket
                          </button>
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
                      <td>{p.name}</td>
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
                        onChange={(e) => console.log(e.target.value)}
                        type={"text"}
                        rows="3"
                        className="form-control"
                      />
                      </td>

                      <td>
                       
                        <p>
                        <button
                            className="btn btn-info btn-sm mr-1"
                          >
                            Tambah Item
                          </button>
                        </p>

                        <p>
                        <button
                            onClick={() => deleteItem(p?.objectId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button>
                        </p>

                        
                      </td>
                    </tr>
                    {p?.items?.length === undefined ||
                    p?.items?.length < 1  ? null : (
                      <tr key={p?.objectId}>
                        <td colSpan={5}>
                          <table
                            className="table table-bordered"
                            id="dataTable"
                            width="100%"
                            cellSpacing="0"
                          >
                            {p?.items.map((item, i) => (
                              <tr key={i}>
                                <td width="90%">
                                  {item?.name ? item?.name : item?.objectId}
                                </td>
                                <td>{item?.quantity}</td>
                                <td> <button
                            onClick={() => deleteItem(p?.objectId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button></td>
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

export default OrderInventoryTable;
