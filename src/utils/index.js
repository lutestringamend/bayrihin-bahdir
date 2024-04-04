import { DAY_NAMES, MONTH_NAMES } from "../constants/strings";

export const capitalizeFirstLetterOfEachWord = (text) => {
    try {
        const items = text.split(" ");
        let result = "";
        for (let i = 0; i < items?.length; i++) {
            result = result + ` ${items[i].substring(0,1).toUpperCase()}${items[i].substring(1, items[i]?.length)}`;
        }
        return result;
    } catch (e) {
        console.error(e);
    }
    return text;
}

export const convertDateISOStringtoDisplayDateTime = (dateISO, withDay, withTime) => {
    try {
        let date = new Date(dateISO);
        return `${withDay ? `${DAY_NAMES[date.getDay()]}, ` : ""}${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}${withTime ? ` pukul ${addZero(date.getHours())}:${addZero(date.getMinutes())} WIB` : ""}`
    } catch (e) {
        console.error(e);
    }
    return dateISO;
}

export const getMonthInRomanNumeral = (monthNumber) => {
    try {
        let month = monthNumber ? parseInt(monthNumber) : new Date().getMonth() + 1;
        switch (month) {
            case 1:
                return "I";
            case 2:
                return "II";
            case 3:
                return "III";
            case 4:
                return "IV";
            case 5:
                return "V";
            case 6:
                return "VI";
            case 7:
                return "VII";
            case 8:
                return "VIII";
            case 9:
                return "IX";
            case 10:
                return "X";
            case 11:
                return "XI";
            case 12:
                return "XII";
            default:
                return "";
        }
    } catch (e) {
        console.error(e);
    }
    return "";
}

export const addZero = (i) => {
    try {
        if (parseInt(i) < 10) {
            return `0${i.toString()}`;
        }
    } catch (e) {
        console.error(e);
    }
    return i.toString();
}