import Parse from "parse/dist/parse.min.js";

//const User = Parse.Object.extend(Parse.User);

export const registerNewUser = async (
  username,
  password,
  email,
  fullName,
  gender,
  birthdate,
  phoneNumber,
  accountRoleId,
) => {
  if (
    username === undefined ||
    username === null ||
    password === undefined ||
    password === null
  ) {
    return false;
  }
  try {
    const createdUser = await Parse.User.signUp(username, password);
    if (!createdUser) {
      alert("Gagal menambahkan user baru");
      return false;
    }

    if (createdUser?.id) {
      const params = {
        objectId: createdUser?.id ? createdUser?.id : null,
        email: email ? email : null,
        fullName: fullName ? fullName : null,
        gender: gender ? gender : null,
        birthdate: birthdate ? birthdate : null,
        phoneNumber: phoneNumber ? phoneNumber : null,
        accountRoleId: accountRoleId ? accountRoleId : null,
        isActive: true,
      };
      const result = await Parse.Cloud.run("updateUserData", params);
      if (result) {
        alert(
          `User baru dengan username ${createdUser.getUsername()} berhasil dibuat`,
        );
        return true;
      }
    }
    
    alert(
      `User baru dengan username ${createdUser.getUsername()} dibuat`,
    );

    return true;
  } catch (error) {
    alert(`Error! ${error?.message}`);
  }
  return false;
};


export const getUserById = async (objectId) => {
  let result = null;
  try {
    result = await Parse.Cloud.run("getUserById", {
      objectId,
      isActive: true,
    });
    if (result) {
      return result.toJSON();
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const getUserData = async (accountRoleName) => {
  let result = [];
  try {
    const results = await Parse.Cloud.run("fetchUserData");
    if (!(results?.length === undefined || results?.length < 1)) {
      for (let r of results) {
        let user = r.toJSON();
        if (accountRoleName) {
          if (user?.accountRole?.name === accountRoleName && user?.objectId && user?.isActive) {
            result.push({
              objectId: user?.objectId,
              name: user?.fullName ? user?.fullName : user?.username,
            });
          }
        } else {
          result.push(user);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  ////console.log("getUserData", result);
  return result;
};

export const updateUserStatus = async (objectId, isActive) => {
  if (
    objectId === undefined ||
    objectId === null ||
    isActive === undefined ||
    isActive === null
  ) {
    return false;
  }
  try {
    const params = {
      objectId,
      isActive,
    };
    const result = await Parse.Cloud.run("updateUserData", params);
    if (result) {
      alert(isActive ? "User kembali diaktifkan" : "User berhasil dimatikan");
      return true;
    }
  } catch (error) {
    alert(`Error! ${error?.message}`);
  }
  return false;
};

export const updateUserEntry = async (
  objectId,
  username,
  email,
  fullName,
  gender,
  birthdate,
  phoneNumber,
  accountRoleId,
) => {
  if (objectId === undefined || objectId === null) {
    return false;
  }
  try {
    const params = {
      objectId,
      username: username ? username : null,
      email: email ? email : null,
      fullName: fullName ? fullName : null,
      gender: gender ? gender : null,
      birthdate: birthdate ? birthdate : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
      accountRoleId: accountRoleId ? accountRoleId : null,
    };
    const result = await Parse.Cloud.run("updateUserData", params);
    if (result) {
      alert("Data User berhasil diedit");
      return true;
    }
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
  }
  return false;
};
