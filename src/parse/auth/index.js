import Parse from "parse/dist/parse.min.js";

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