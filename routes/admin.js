/* eslint-disable spaced-comment */
const express = require("express");

const router = express.Router();
const sliderRouter = require("./slider");
const bannerRouter = require("./banner");
const categoryRouter = require("./category");
const productRouter = require("./product");
const cartItemRouter = require("../routes/cartItemRoutes");
const paymentRoutes = require("../routes/paymentMethodsRoutes");
const couponRoutes = require("./coupon");
const orderRouter = require("./orders");
const timeRouter = require("./timeRoutes");
const testRouter = require("./testRoutes");
const constantRoutes = require("../routes/constantRoutes");

//{requireNewController}

router.get("/", (req, res) => {
  res.render("admin/index", { title: "لوحة التحكم" });
});
router.use("/category", categoryRouter);
router.use("/slider", sliderRouter);
router.use("/banner", bannerRouter);
router.use("/product", productRouter);
router.use("/cartItem", cartItemRouter);
router.use("/payment", paymentRoutes);
router.use("/coupon", couponRoutes);
router.use("/order", orderRouter);
router.use("/time", timeRouter);
router.use("/test", testRouter);
router.use("/constant", constantRoutes);

//{registerNewRoutes}

module.exports = router;
