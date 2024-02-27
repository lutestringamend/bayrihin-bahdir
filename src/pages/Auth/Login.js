import React, { useState } from "react";

//import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { authLogin } from "../../parse/auth";
import { overhaulReduxUserCurrent } from "../../utils/user";

//<div className="col-lg-6 d-none d-lg-block bg-login-image"></div>

/*


                                         <a href="index.html" className="btn btn-google btn-user btn-block">
                                            <i className="fab fa-google fa-fw"></i> Login with Google
                                        </a>
                                        <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                        </a>

                                         <div className="text-center">
                                        <a className="small" href="register.html">Create an Account!</a>
                                    </div>
*/

const Login = (props) => {
  const { currentUser } = props;
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(true);

  const handleChange = () => {
    setRemember(!remember);
  };

  const attemptLogin = async () => {
    setError(null);
    try {
      let result = await authLogin(data?.username, data?.password);
      if (result?.result === undefined || result?.result === null) {
        setError(result?.error ? result?.error : "Tidak bisa login.");
      } else {
        alert(`Berhasil login sebagai ${result?.result?.username}!`);
        props.overhaulReduxUserCurrent(result?.result);
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    console.log("attemptLogin", data);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6 col-lg-6 col-md-9">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-12">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      ALLVACON Admin App
                    </h1>
                  </div>
                  <form className="user">
                    <div className="form-group">
                      <input
                        type="username"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Masukkan username"
                        value={data?.username}
                        onChange={(e) =>
                          setData({ ...data, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                        value={data?.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <div className="custom-control custom-checkbox small">
                        <input
                          checked={remember}
                          onChange={handleChange}
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck"
                        />
                        <label className="custom-control-label">
                          Ingat saya
                        </label>
                      </div>
                    </div>
                  </form>
                  <button
                    className="btn btn-primary btn-user btn-block"
                    onClick={() => attemptLogin()}
                  >
                    Login
                  </button>
                  <span style={{ color: "red" }}>{error}</span>
                  <hr />
                  <div className="text-center">
                    <a className="small" href="#">
                      Lupa Password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      overhaulReduxUserCurrent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(Login);
