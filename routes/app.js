const express = require("express");

const router = express.Router();

const jwtMiddleWare = require("../middlewares/jwtMiddleWare");
const sliderController = require("../controllers/slider");
const bannerController = require("../controllers/banner");
const CatController = require("../controllers/category");
const ProductController = require("../controllers/product");
const couponController = require("../controllers/coupon");
const cartItemController = require("../controllers/cartItemController");
const addressController = require("../controllers/AddressController");
const paymentsMethodsController = require("../controllers/paymentMethodsController");
const orderController = require("../controllers/orders");
const timeController = require("../controllers/timeController");
const validatePhoneRoutes = require("../routes/validatePhoneRoutes");
const userApiRoutes = require("./userApi");
const constantsController = require("../controllers/constantController");

router.get("/constants", constantsController.paginate);

/**
 * slider
 */
router.get("/slider", sliderController.fetchSlider);
router.get("/slider2", sliderController.fetchSlider2);
router.get("/banner", bannerController.fetchSlider);

/**
 * categories
 */
router.get("/category/get-parents", CatController.getParentCategories);
router.get("/category/get-children", CatController.getAllChildren);
router.get("/category/get-children/:_id", CatController.getChildren);
router.get("/category/paginate", CatController.paginateCategories);
router.get("/category", CatController.fetchAllCategories);

/**
 * products
 */
router.get("/product/latest", ProductController.getLatestProducts);
router.get("/product/search", ProductController.search);
router.get("/product/bar-code", ProductController.getByBarCode);
router.get("/product/best-seller", ProductController.getBestSeller);
router.get("/product-by-id/:id", ProductController.getById);
router.get("/product/paginate", ProductController.paginateProduct);
router.get("/product/category", ProductController.paginateProductOfCategory);
router.get("/product/random", ProductController.getRandom);
router.get(
  "/product/parent-category",
  ProductController.paginateProductOfChildrenCategory
);
/**
 * time
 */
router.get("/times", timeController.list);
/**
 * cartItem
 */
router.get("/cart", jwtMiddleWare, cartItemController.list);
router.post("/cart", jwtMiddleWare, cartItemController.create);
router.put("/cart", jwtMiddleWare, cartItemController.update);
router.put(
  "/cart/replace",
  jwtMiddleWare,
  cartItemController.changeReplacement
);
router.post("/coupon", jwtMiddleWare, couponController.handle);

/**
 * Addresses
 */
router.get("/address", jwtMiddleWare, addressController.list);
router.put("/address/:id", jwtMiddleWare, addressController.update);
router.post("/address", jwtMiddleWare, addressController.create);
router.get("/payment-methods", paymentsMethodsController.list);

/**
 * Orders
 */
router
  .route("/order")
  .post(jwtMiddleWare, orderController.create)
  .get(jwtMiddleWare, orderController.fetchUserOrders);

router.use("/verify", validatePhoneRoutes);

/**
 * user
 */
router.use("/user", userApiRoutes);
module.exports = router;
