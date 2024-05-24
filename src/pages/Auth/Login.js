import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FadeLoader } from "react-spinners";

import { authLogin } from "../../parse/auth";
import { overhaulReduxUserCurrent } from "../../utils/user";
import { AuthDataModel } from "../../models/auth";
import { requestPasswordReset } from "../../parse/account";
import { email_regex } from "../../constants";

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
*/

const Login = (props) => {
  const { currentUser } = props;
  const navigate = useNavigate();

  const [data, setData] = useState(AuthDataModel);
  const [errors, setErrors] = useState(AuthDataModel);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  /*const [remember, setRemember] = useState(true);

  const handleChange = () => {
    setRemember(!remember);
  };*/

  const resetPassword = async () => {
    const email = window.prompt("Masukkan alamat email akun Anda");
    if (email_regex.test(email)) {
      const confirm = window.confirm(
        `Yakin ingin mengirim email permintaan reset password ke ${email}?`,
      );
      if (confirm) {
        const result = await requestPasswordReset(email);
        if (!result) {
          window.alert("Tidak bisa mengirimkan email permintaan reset password");
        }
      }
    } else {
      window.alert("Alamat email tidak valid");
    }
    
  }

  const attemptLogin = async () => {
    if (data?.username === null || data?.username === "") {
      setErrors({...AuthDataModel, username: "Username wajib diisi"});
      return;
    }
    if (data?.password === null || data?.password === "") {
      setErrors({...AuthDataModel, password: "Password wajib diisi"});
      return;
    }

    setError(null);
    setErrors(AuthDataModel);
    setLoading(true);
    try {
      let result = await authLogin(data?.username, data?.password);
      if (result?.result === undefined || result?.result === null) {
        setError(result?.error ? result?.error : "Tidak bisa login.");
      } else {
        alert(`Berhasil login sebagai ${result?.result?.username}!`);
        props.overhaulReduxUserCurrent(result?.result);
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      setError("Akun tidak ada atau password salah");
    }
    setLoading(false);
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
                        className={`form-control form-control-user ${
                          errors.username ? "is-invalid" : ""
                        } `}
                        aria-describedby="emailHelp"
                        placeholder="Masukkan username"
                        value={data?.username}
                        onChange={(e) =>
                          setData({ ...data, username: e.target.value })
                        }
                      />
                      <span style={{ color: "red" }}>{errors?.username}</span>
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className={`form-control form-control-user ${
                          errors.password ? "is-invalid" : ""
                        } `}
                        placeholder="Password"
                        value={data?.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                      <span style={{ color: "red" }}>{errors?.password}</span>
                    </div>
                    
                  </form>
                  {loading ? (
                    <FadeLoader
                    color="#4e73df"
                    loading
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  ) : (
                    <>
                    <button
                    className="btn btn-primary btn-user btn-block"
                    onClick={() => attemptLogin()}
                  >
                    Login
                  </button>
                  <span style={{ color: "red" }}>{error}</span>
                  <hr />
                  <div className="text-center">
                    <a href="#" className="small" onClick={() => resetPassword()}>
                      Lupa Password?
                    </a>
                  </div>
                    </>
                  )}
                  
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
