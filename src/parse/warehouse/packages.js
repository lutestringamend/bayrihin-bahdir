import Parse from "parse/dist/parse.min.js";

export const createWarehousePackageEntry = async (
  category,
  name,
  unitPackageGrouping,
) => {
  let item = new Parse.Object("warehouse_packages");
  item.set("category", parseInt(category));
  item.set("name", name);
  item.set(
    "isPartOfUnitFullSetPackage",
    parseInt(category) === 3 &&
      (parseInt(unitPackageGrouping) === 1 ||
        parseInt(unitPackageGrouping) === 3),
  );
  item.set(
    "isPartOfUnitPartialSetPackage",
    parseInt(category) === 3 &&
      (parseInt(unitPackageGrouping) === 2 ||
        parseInt(unitPackageGrouping) === 3),
  );
  try {
    await item.save();
    alert("Paket baru berhasil dibuat");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const updateWarehousePackageEntry = async (
  objectId,
  category,
  name,
  unitPackageGrouping,
) => {
  let item = new Parse.Object("warehouse_packages");
  item.set("objectId", objectId);
  item.set("category", parseInt(category));
  item.set("name", name);
  item.set(
    "isPartOfUnitFullSetPackage",
    parseInt(category) === 3 &&
      (parseInt(unitPackageGrouping) === 1 ||
        parseInt(unitPackageGrouping) === 3),
  );
  item.set(
    "isPartOfUnitPartialSetPackage",
    parseInt(category) === 3 &&
      (parseInt(unitPackageGrouping) === 2 ||
        parseInt(unitPackageGrouping) === 3),
  );
  try {
    await item.save();
    alert("Paket berhasil diedit");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};

export const deleteWarehousePackageEntry = async (objectId) => {
  let item = new Parse.Object("warehouse_packages");
  item.set("objectId", objectId);
  try {
    await item.destroy();
    alert("Paket telah dihapus");
    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
