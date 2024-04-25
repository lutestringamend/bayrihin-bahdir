import Parse from "parse/dist/parse.min.js";

export const postWarehouseProductPrices = async (
    productId,
    priceHET,
    priceCOGS,
    customPriceMetadata,
  ) => {
    if (productId === undefined || productId === null) {
        return false;
    }
    try {
        const query = new Parse.Query("warehouse_products");
        query.limit(999999);
        query.equalTo("objectId", productId.toString());
        const item = await query.first();
        if (item === undefined || item === null) {
          alert("Produk tidak ditemukan");
          return false;
        }
     
        if (priceHET) {
            item.set("priceHET", parseInt(priceHET));
        }
        if (priceCOGS) {
            item.set("priceCOGS", parseInt(priceCOGS));
        }
        if (customPriceMetadata) {
            item.set("customPriceMetadata", customPriceMetadata.toString());
        }
      await item.save();
  
      alert("Price List produk berhasil diedit");
  
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };