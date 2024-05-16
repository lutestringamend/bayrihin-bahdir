import Parse from "parse/dist/parse.min.js";

const WarehouseInstrumentTrays = Parse.Object.extend("warehouse_instrument_trays");

export const createUpdateWarehouseInstrumentTrayEntry = async (objectId, name, colorHex) => {
    let item = new Parse.Object("warehouse_instrument_trays");
    if (objectId) {
        item.set("objectId", objectId);
    }
    item.set("name", name);
    if (colorHex) {
        item.set("colorHex", colorHex);
    }
    
    try {
      await item.save();
      alert(objectId ? "Instrument Tray berhasil diedit" : "Instrument Tray baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  export const getWarehouseInstrumentTrays = async () => {
    let results = [];
    try {
      const query = new Parse.Query(WarehouseInstrumentTrays);
      query.limit(99);
      query.ascending("createdAt");
      const res = await query.find();
      for (let r of res) {
          results.push(r.toJSON());
      }
    } catch (e) {
      console.error(e);
    }
    return results;
  };