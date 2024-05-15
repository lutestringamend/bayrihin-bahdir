import Parse from "parse/dist/parse.min.js";

const TrackingEvents = Parse.Object.extend("tracking_events");

export const createUpdateTrackingUpdateEntry = async (objectId, name, isActive) => {
    let item = new Parse.Object("tracking_events");
    if (objectId) {
        item.set("objectId", objectId);
    }
    if (name) {
        item.set("name", name);
    }
    if (isActive === undefined || isActive === null) {
        item.set("isActive", true);
    } else {
        item.set("isActive", isActive);
    }
    try {
      await item.save();
      alert(objectId ? "Entry Tracking Event berhasil diedit" : "Tracking Event baru berhasil ditambahkan");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };