/* eslint-disable spaced-comment */
const express = require("express");

const router = express.Router();
const ProductController = require("../controllers/product");
//fetching all products /app/products/all

/**
 * create new product
 */
router.get("/", ProductController.renderAdminIndex);
router.get("/create", ProductController.renderCreatePage);
router.get("/paginate", ProductController.paginateProductForAdmin);
router.get("/edit/:id", ProductController.renderAdminEdit);
router.get("/fetch-all", ProductController.fetchAllProducts);
router.get("/random", ProductController.getRandom);
router.post("/create", ProductController.create);
router.put("/edit", ProductController.edit);
router.post("/upload-images", ProductController.uploadImages);
router.get("/dev", ProductController.updateDev);
router.get("/all-names", ProductController.getAllNames);

module.exports = router;
