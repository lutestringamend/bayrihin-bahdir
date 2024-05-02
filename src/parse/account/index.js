import Parse from "parse/dist/parse.min.js";

export const getAccountRoles = async () => {
  let result = [];
  try {
    const query = new Parse.Query("account_roles");
    query.limit(99);
    const resProducts = await query.find();
    for (let r of resProducts) {
      result.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getAccountRoleEntry = async (objectId) => {
  let result = null;
  try {
    const query = new Parse.Query("account_roles");
    query.equalTo("objectId", objectId);
    query.limit(99);
    const res = await query.first();
    result = res.toJSON();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const updateAccountRoleEntry = async (objectId, privileges) => {
  if (objectId === undefined || objectId === null || privileges === undefined || privileges === null) {
    return false;
}
try {
    const query = new Parse.Query("account_roles");
    query.limit(99);
    query.equalTo("objectId", objectId.toString());
    const item = await query.first();
    if (item === undefined || item === null) {
      alert("Role tidak ditemukan");
      return false;
    }
    item.set("privileges", privileges);
  await item.save();

  alert("Role berhasil diedit");

  return true;
} catch (error) {
  alert(`Error! ${error.message}`);
  return false;
}
};


