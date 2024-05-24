export const localisationID = "id-ID";
export const localisationShort = "id";
export const defaultcurrency = "IDR";
export const countrycode = "+62";
export const DEFAULT_COUNTRY = "Indonesia";

export const phone_regex = RegExp(/^[\s()+-]*([0-9][\s()+-]*){6,20}$/);
export const password_regex = RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/);
export const email_regex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
export const username_regex = RegExp(/^\S+$/);

export const LOCAL_SESSION_DURATION_IN_MILLISECONDS = 3600000