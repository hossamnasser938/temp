const Jimp = require("jimp");
const Product = require("../models/product");
const Category = require("../models/category");
const { paginate } = require("../config/helpers");

exports.fetchAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json({ products });
};

exports.getAllNames = async (req, res) => {
  const products = await Product.find({}).select({ title: 1 });
  res.json({ products });
};

exports.getRandom = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const count = total < 10 ? total : total - 10;
    const random = Math.floor(Math.random() * count);
    return res.status(200).json({
      data: await Product.find()
        .skip(random)
        .limit(10)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: await Product.find()
        .skip(5)
        .limit(10)
    });
  }
};
/**
 * paginate products
 */
exports.paginateProduct = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  res.json(
    await paginate(Product, {}, page, limit, { created_at: -1 }, [], {})
  );
};
exports.paginateProductForAdmin = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  res.json(
    await paginate(Product, {}, page, limit, { created_at: -1 }, [], {})
  );
};

/**
 * get products of specific children category
 */
exports.paginateProductOfCategory = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const _id = req.query.id || 1;
  const { sort } = req.query;
  try {
    let paginateSorting = { created_at: 1 };
    switch (sort) {
      case "latest":
        paginateSorting = { created_at: -1 };
        break;
      case "oldest":
        paginateSorting = { created_at: 1 };
        break;
      case "high":
        paginateSorting = { price: -1 };
        break;
      case "low":
        paginateSorting = { price: 1 };
        break;
      case "top":
        paginateSorting = { sold: -1 };
        break;
      default:
        paginateSorting = { created_at: -1 };
        break;
    }
    const filter = { categories: _id };
    return res.json(
      await paginate(Product, filter, page, limit, paginateSorting, [])
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
/**
 * get products of specific parent
 */
exports.paginateProductOfChildrenCategory = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const _id = req.query.id || 1;
  const { sort } = req.query;
  const childrenIds = await Category.find({ parentId: _id }).select({ _id: 1 });
  const ids = [];
  childrenIds.forEach(item => {
    ids.push(item._id);
  });
  // return res.json(ids);
  let paginateSorting = { created_at: 1 };
  switch (sort) {
    case "latest":
      paginateSorting = { created_at: -1 };
      break;
    case "oldest":
      paginateSorting = { created_at: 1 };
      break;
    case "high":
      paginateSorting = { price: -1 };
      break;
    case "low":
      paginateSorting = { price: 1 };
      break;
    case "top":
      paginateSorting = { sold: -1 };
      break;
    default:
      paginateSorting = { created_at: -1 };
      break;
  }
  const filter = { categories: { $in: ids } };
  res.json(await paginate(Product, filter, page, limit, paginateSorting, []));
};
/**
 * search for product
 */
exports.search = async (req, res) => {
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  let query = req.query.query || "";
  if (query.length > 0) {
    query = query.split(" ").join("|");
  }
  try {
    return res.json(
      await paginate(
        Product,
        { title: { $regex: query, $options: "i" } },
        page,
        limit,
        { created_at: -1 },
        [],
        {}
      )
    );
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};
exports.getByBarCode = async (req, res) => {
  const { barCode } = req.query;
  try {
    const product = await Product.find({ barCode });
    return res.json({ product });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};
/**
 * @create product
 * @api /admin/product/create
 */
exports.create = async (req, res) => {
  const newProduct = req.body.product;
  try {
    const createdProduct = await Product.create(newProduct);
    if (createdProduct) {
      return res
        .status(200)
        .json({ message: "created", product: createdProduct });
    }
    return res.status(200).json("ok");
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.edit = async (req, res) => {
  const newProduct = req.body.product;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      newProduct._id,
      newProduct
    );
    if (updatedProduct) {
      return res
        .status(200)
        .json({ message: "updated", product: updatedProduct });
    }
    return res.status(200).json("ok");
  } catch (err) {
    return res.status(411).json({ err });
  }
};

/**
 * @param req Request
 * @param res Response
 * @return response
 * @post /admin/product/upload-images
 */
exports.uploadImages = async (req, res) => {
  const productImages = req.files.images;
  // console.log(productImages)
  const images = [];
  if (productImages.length > 1) {
    await Promise.all(
      productImages.map(async (item, i) => {
        const productImageType = item.mimetype;
        const type = productImageType.split("/")[0];
        if (type != "image") {
          return res.json({ message: "type error" });
        }
        const name = Date.now() + item.name;
        const uploadPath = `${__dirname}/../public/uploads/products/${name}`;
        const uploaded = await item.mv(uploadPath);
        try {
          const img = await Jimp.read(uploadPath);
          const newResized = await img.resize(400, 400);
          newResized.write(
            `${__dirname}/../public/uploads/products/resized/${name}`
          );
          images.push(name);
        } catch (error) {
          console.log(error);
        }
        return item;
      })
    );
  } else {
    const productImageType = productImages.mimetype;
    const type = productImageType.split("/")[0];
    if (type != "image") {
      return res.json({ message: "type error" });
    }
    const name = Date.now() + productImages.name;
    const uploadPath = `${__dirname}/../public/uploads/products/${name}`;
    const uploaded = await productImages.mv(uploadPath);

    Jimp.read(uploadPath, (err, img) => {
      if (err) res.json(err);
      img
        .resize(400, 400)
        .write(`${__dirname}/../public/uploads/products/resized/${name}`);
    });
    images.push(name);
  }
  return res.json({ message: "done", images });
};

/**
 * @get /api/products/latest?limit
 * @param req
 * @param res
 * @return product Product
 */
exports.getLatestProducts = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  try {
    const products = await Product.find({})
      .sort({ created_at: -1 })
      .limit(limit);
    return res.status(200).json({ message: "done", products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getBestSeller = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  try {
    const products = await Product.find({})
      .sort({ sold: -1 })
      .limit(limit);
    return res.status(200).json({ message: "done", products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "not found" });
  }
};

exports.updateDev = async (req, res) => {
  await Product.deleteMany({});
  res.send("ok");
};

/**
 * @get admin/product/create
 * @param req Request
 * @param res Response
 * @return response
 */
exports.renderCreatePage = (req, res) => {
  const title = "انشاء منتج";
  res.render("admin/product/create", { title });
};
exports.renderAdminIndex = (req, res) => {
  const title = "كافة المنتجات";
  res.render("admin/product/index", { title });
};
exports.renderAdminEdit = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("categories");
  const { title } = product;
  res.render("admin/product/edit", { title, product: JSON.stringify(product) });
};
