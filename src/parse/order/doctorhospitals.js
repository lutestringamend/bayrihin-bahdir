import Parse from "parse/dist/parse.min.js";

export const createUpdateDoctorHospitalEntry = async (objectId, doctorId, hospitalId, isActive) => {
    let item = new Parse.Object("doctor_hospitals");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("doctor", {
        __type: "Pointer",
        className: "doctors",
        objectId: doctorId,
      });
      if (hospitalId) {
        item.set("hospital", {
            __type: "Pointer",
            className: "hospitals",
            objectId: hospitalId,
          });
      }
    if (!(isActive === undefined || isActive === null)) {
      item.set("isActive", isActive);
    }

    try {
      await item.save();
      alert(objectId ? "Status Rumah sakit berhasil diganti" : "Rumah Sakit berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

export const getDoctorHospitals = async (doctorId, hospitalId) => {
    let result = [];
    try {
      const query = new Parse.Query("doctor_hospitals");
      query.limit(99999);
      query.ascending("createdAt");
      query.equalTo("doctor", {
        __type: "Pointer",
        className: "doctors",
        objectId: doctorId,
      });
      if (hospitalId) {
        query.equalTo("hospital", {
            __type: "Pointer",
            className: "hospitals",
            objectId: hospitalId,
          });
      } 
      query.include("hospital");
    
      const res = await query.find();
      for (let r of res) {
        result.push(r.toJSON());
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  };