import Parse from "parse/dist/parse.min.js";

export const createUpdateDoctorEntry = async (objectId, name, gender, birthdate) => {
    let item = new Parse.Object("doctors");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("name", name);
    if (gender) {
      item.set("gender", gender);
    }
    if (birthdate) {
      item.set("birthdate", birthdate);
    }
    try {
      await item.save();
      alert(objectId ? "Entry Dokter berhasil diedit" : "Dokter baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  export const switchDoctorStatus = async (objectId, isActive) => {
    let item = new Parse.Object("doctors");
    item.set("objectId", objectId);
    item.set("isActive", isActive ? !isActive : true);
    
    try {
      await item.save();
      alert("Status Dokter berhasil diganti!");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

export const deleteDoctorEntry = async (objectId) => {
    let item = new Parse.Object("doctors");
    item.set("objectId", objectId);
    try {
      await item.destroy();
      alert("Data Dokter telah dihapus");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };