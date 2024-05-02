import React from "react";

const RolePrivilegesTable = (props) => {
  const { section, privileges } = props;

  const checkHandler = (e) => {
    if (!(props?.setChecked === undefined || props?.setChecked === null)) {
      props?.setChecked(e);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">{section}</h6>
      </div>
      {privileges?.length === undefined || privileges?.length < 1 ? null : (
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing="0"
            >
              <tbody>
                {privileges.map((p, index) => {
                  return (
                    <tr key={p?.name}>
                      <td>
                        <div>
                          <input
                            type="checkbox"
                            id={p?.name}
                            onChange={() => checkHandler(p?.name)}
                            checked={p?.checked}
                            defaultChecked={false}
                          />
                          <label className="px-3" htmlFor={p?.name}>
                            {p?.caption}
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePrivilegesTable;
