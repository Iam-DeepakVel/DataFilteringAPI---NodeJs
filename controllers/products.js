const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  try {
    const { name, featured, company, sort, fields, numericFilters } = req.query;
    const productObject = {};
    if (name) {
      productObject.name = { $regex: name, $options: "i" };
    }
    if (featured) {
      productObject.featured = featured === "true" ? true : false;
    }
    if (company) {
      productObject.company = company;
    }
    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["price", "rating"];
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          productObject[field] = { [operator]: Number(value) };
        }
      });
    }

    let result = Product.find(productObject);

    if (sort) {
      const splitedItem = sort.split(",").join(" ");
      result = result.sort(splitedItem);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      const splitFields = fields.split(",").join(" ");
      result = result.select(splitFields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, hits: products.length });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = getAllProducts;
