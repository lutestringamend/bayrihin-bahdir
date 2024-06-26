import { LOCAL_SESSION_DURATION_IN_MILLISECONDS } from "../constants";
import { DEFAULT_PASSWORD_LENGTH } from "../constants/user";

export const getLocalSessionExpiredAt = () => {
    try {
        let date = new Date();
        date.setTime(date.getTime() + LOCAL_SESSION_DURATION_IN_MILLISECONDS);
        return date.toISOString();
    } catch (e) {
        console.error(e);
    }
    return "";
}

export const hasPrivilege = (privileges, name) => {
    if (privileges === undefined || privileges?.length === undefined || privileges?.length < 1 || name === undefined || name === null) {
        return false;
    }
    try {
        if (!(privileges.find((e) => e === name) === undefined || privileges.find((e) => e === name) === null)) {
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

export const generatePassword = () => {
    let charset = "";
    let newPassword = "";
    charset += "!@#$%^&*()";
    charset += "0123456789";
    charset += "abcdefghijklmnopqrstuvwxyz";
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < DEFAULT_PASSWORD_LENGTH; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return newPassword;
};