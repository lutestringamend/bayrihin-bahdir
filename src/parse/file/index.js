import Parse from "parse/dist/parse.min.js";

export const createAndSaveParseFile = async (name, base64) => {
    let result = null;
    try {
        const parseFile = new Parse.File(name, { base64 });
        result = await parseFile.save();
    } catch (e) {
        console.error(e);
    }
    return result;
}