import Parse from "parse/dist/parse.min.js";

const TrackingEvents = Parse.Object.extend("tracking_events");


export const getTrackingEvents = async (isActive) => {
  let results = [];
  try {
    const query = new Parse.Query(TrackingEvents);
    query.limit(99);
    query.ascending("createdAt");
    if (!(isActive === undefined || isActive === null)) {
        query.equalTo("isActive", isActive);
    }
    const res = await query.find();
    for (let r of res) {
        results.push(r.toJSON());
    }
  } catch (e) {
    console.error(e);
  }
  return results;
};