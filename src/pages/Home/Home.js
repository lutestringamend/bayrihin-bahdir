import React from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { USER_ROLES } from '../../constants/user';


function Home(props) {
    const { currentUser } = props;
    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">{`Selamat Datang, ${currentUser?.fullName ? currentUser?.fullName : currentUser?.username}`}</h1>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                    {`Role Akun Anda: ${currentUser?.accountRole ? currentUser?.accountRole?.name ? USER_ROLES.find(({ name }) => name === currentUser?.accountRole?.name)?.caption : "" : ""}`}
                </h6>
                </div>
            </div>
           
        </>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
  });
  
  /*const mapDispatchProps = (dispatch) =>
    bindActionCreators(
      {
      },
      dispatch,
    );*/
  
  export default connect(mapStateToProps, null)(Home);

