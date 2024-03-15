import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RequestOrderTable = (props) => {
  const { title, category, list } = props;
  const [expand, setExpand] = useState(false);
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
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
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
                        <p>{p?.notes}</p>
                      </td>

                      <td>
                        {p?.items?.length === undefined ||
                        p?.items?.length < 1 ? (
                          <Link
                            to={`/order-package-item/${category}/${p.objectId}`}
                            className="btn btn-primary btn-sm mr-1"
                          >
                            Tambah
                          </Link>
                        ) : (
                          <button
                            onClick={() => deleteItem(p?.objectId)}
                            className="btn btn-danger btn-sm mr-1"
                          >
                            Hapus
                          </button>
                        )}

                        {p?.items?.length === undefined ||
                        p?.items?.length < 1 ? null : (
                          <button
                            onClick={() => setExpand((expand) => !expand)}
                            className="btn btn-info btn-sm mr-1"
                          >
                            {expand ? "Ringkas" : "Lihat Detil"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {p?.items?.length === undefined ||
                    p?.items?.length < 1 ||
                    !expand ? null : (
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

export default RequestOrderTable;
