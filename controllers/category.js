const Category = require("../models/category");
const Jimp = require("jimp");
const paginateCategory = require("../config/helpers").paginateCategory;
// import {paginateCategories} from '../config/helpers'

exports.fetchAllCategories = (req, res) => {
  Category.find()
    .sort({ parentId: 1 })
    .then(cats => {
      res.json({ categories: cats });
    });
};
exports.getParentCategories = async (req, res) => {
  cats = await Category.find({ parentId: null });
  res.json({ cats: cats });
};
exports.getAllChildren = async (req, res) => {
  cats = await Category.find({ parentId: { $ne: null } });
  res.json({ cats: cats });
};
exports.uploadImage = async (req, res) => {
  let catImage = req.files.thumb;
  let catImageType = catImage.mimetype;
  let type = catImageType.split("/")[0];
  if (type != "image") {
    return res.json({ message: "type error" });
  }
  name = Date.now() + catImage.name;
  let uploadPath = __dirname + "/../public/uploads/cat-thumbs/" + name;
  const uploaded = await catImage.mv(uploadPath);
  Jimp.read(uploadPath, (err, img) => {
    if (err) res.json(err);
    img
      .resize(500, 500)
      .write(__dirname + "/../public/uploads/cat-thumbs/resized/" + name);
    res.json({ message: "done", image: name });
  });
};
exports.createCategory = async (req, res) => {
  if (!req.body.name) {
    return res.json({ message: "الاسم مطلوب" });
  }
  const requestedName = await Category.findOne({ name: req.body.name });
  if (requestedName) {
    return res.json({ message: "الاسم موجود بالفعل" });
  }
  const newCategory = {
    name: req.body.name,
    parentId: null,
    image: req.body.image
  };
  if (req.body.parentId) {
    const parent = await Category.findById(req.body.parentId);
    if (parent) {
      newCategory.parentId = parent._id;
      const createdCategory = await Category.create(newCategory);
      if (createdCategory) {
        return res.json({ message: "success", createdCategory });
      }
    } else {
      return res.json({ message: "parent not found", error: err });
    }
  } else {
    const createdCategory = await Category.create(newCategory);
    if (createdCategory) {
      return res.json({ message: "success", category: createdCategory });
    }
  }
};

/**
 * Update category
 */
exports.updateCategory = (req, res) => {
  name = req.body.name;
  if (!name) {
    return res.json({ error: "name required" });
  }
  Category.findById(req.body.id)
    .then(cat => {
      if (!cat) {
        return res.json({ error: "wrong category" });
      }
      cat.name = req.body.name;
      cat.image = req.body.image;
      cat.parentId = req.body.parentId;
      cat.save().then(newCat => {
        res.json({ message: "success", category: newCat });
      });
    })
    .catch(err => {
      return res.json({ message: "cant find category", error: err });
    });
};

exports.deleteCategory = async (req, res) => {
  const categoryToDelete = await Category.findById(req.body.id);
  if (!categoryToDelete) {
    return res.json({ message: "category not found" });
  }
  const childrenToDelete = await Category.deleteMany({ parentId: req.body.id });

  categoryToDelete.delete();
  return res.json({ message: "deleted" });
};
/**
 *Paginate category
 */
exports.paginateCategories = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  res.json(
    await paginateCategory(Category, page, limit, { parentId: 1 }, ["parentId"])
  );
};

/**
 * @api for admin
 * this accessed from /router/adminCategory
 * @adminCategory
 */

exports.renderAddPage = (req, res) => {
  const title = "اضافة قسم ";
  res.render("admin/categories/add", { title });
};
/**
 * show index of dashboard for categories
 * @get admin/category
 */
exports.dashboardIndex = (req, res) => {
  const title = "كافة الاقسام";
  res.render("admin/categories/index", { title });
};

exports.showEditPage = async (req, res) => {
  const _id = req.params._id;
  try {
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).send(`The link: ${req.url} Not found. `);
    }
    const title = "تعديل القسم";
    const stringCategory = JSON.stringify(category);
    res.render("admin/categories/edit", { title, category: stringCategory });
  } catch (err) {
    res.json({ message: "category not found" });
  }
  // res.render("admin/categories/edit", { title });
};

/**
 * get children
 */
exports.getChildren = async (req, res) => {
  const _id = req.params._id;
  try {
    const children = await Category.find({ parentId: _id });
    res.json({ children });
  } catch (err) {
    res.json({ err });
  }
};
