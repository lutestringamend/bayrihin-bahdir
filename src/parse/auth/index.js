import Parse from "parse/dist/parse.min.js";

export const authLogout = async () => {
    let result = null;
    try {
        result = await Parse.User.logOut();
        if (result) {
            alert("Logout berhasil!");
        }
    } catch (error) {
        alert(`Error! ${error.message}`);
    }
    return result;
}

export const authLogin = async (username, password) => {
    let error = null;
    let result = null;
    const loggedInUser = await Parse.User.logIn(username, password).catch((e) => error = e.toString());
    if (loggedInUser) {
        const currentUser = await Parse.User.current();
        result = currentUser.toJSON();
    }
    return {
        result,
        error
    };
}