import Parse from "parse/dist/parse.min.js";

const Documents = Parse.Object.extend("documents");

export const createUpdateDocumentEntry = async (objectId, name, description, photo) => {
    let item = new Parse.Object("documents");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("name", name ? name : "");
    item.set("description", description ? description : "");
    if (photo) {
        item.set("photo", photo);
    }
    try {
      await item.save();
      alert(objectId ? "Entry Dokumen berhasil diedit" : "Dokumen baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  export const deleteDocumentEntry = async (objectId) => {
    let item = new Parse.Object("documents");
    item.set("objectId", objectId);
    try {
      await item.destroy();
      alert("Dokumen telah berhasil dihapus");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

export const getDocumentsData = async (
    limit,
    sortDescendingBy,
    sortAscendingBy,
  ) => {
    let result = [];
    try {
      const query = new Parse.Query("documents");
      query.limit(limit ? limit : 999999);
      if (sortAscendingBy) {
        query.ascending(sortAscendingBy);
      } else {
        query.descending(sortDescendingBy ? sortDescendingBy : "createdAt");
      }
      const resProducts = await query.find();
      for (let r of resProducts) {
        result.push(r.toJSON());
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  };

  export const getDocumentsByName = async (name) => {
    let result = [];
    try {
      const query = new Parse.Query("documents");
      query.limit(999999);
      query.descending("createdAt");
      const res = await query.find();
      for (let r of res) {
        let obj = r.toJSON();
        if (
            obj?.name?.toLowerCase().includes(name) ||
            obj?.description?.toLowerCase().includes(name) ||
          obj?.name?.toLowerCase().includes(name?.toLowerCase()) ||
          obj?.description?.toLowerCase().includes(name?.toLowerCase()) ||
          obj?.name?.toLowerCase().includes(name?.toUpperCase()) ||
          obj?.description?.toLowerCase().includes(name?.toUpperCase())
        ) {
          result.push(obj);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  };