const Coupon = require("../models/coupon");
const cartItemModel = require("../models/cartItemModel.js");
const { paginate } = require("../config/helpers");

function findCommonElement(array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i].toString() == array2[j].toString()) {
        return true;
      }
    }
  }
  return false;
}

exports.create = async (req, res) => {
  const { newCoupon } = req.body;
  try {
    await Coupon.create(newCoupon);
    return res.status(201).json({
      message: "success"
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.paginate = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  res.json(
    await paginate(
      Coupon,
      {},
      page,
      limit,
      {
        created_at: -1
      },
      []
    )
  );
};
exports.update = async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, req.body.model);
    return res.status(201).json({ message: "done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
exports.delete = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    await coupon.delete();
    return res.status(204).json({ message: "done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
/**
 * handle coupon
 */
exports.handle = async (req, res) => {
  const user = req.user._id;
  const { code } = req.body;
  try {
    const items = await cartItemModel
      .find({ user: user, inCart: true })
      .populate("product");
    let total = 0;
    const productsIds = [];
    const categoriesIds = [];
    items.forEach(item => {
      total += item.cost * item.count;
      productsIds.push(item.product._id);
      item.product.categories.forEach(cat => {
        categoriesIds.push(cat._id);
      });
    });
    const coupon = await Coupon.findOne({
      code: {
        $regex: code,
        $options: "i"
      }
    })
      .populate("category")
      .populate("product");
    // check the minimum total
    if (total < coupon.min) {
      return res.status(410).json({
        message: "total"
      });
    }
    // check if user already used
    if (coupon.users) {
      if (coupon.users.includes(user)) {
        return res.status(411).json({
          message: "already used"
        });
      }
    }
    // check if exist category or product
    const arrayOfProductIds = [];
    const arrayOfCategoriesIds = [];
    if (coupon.product.length > 0) {
      coupon.product.forEach(p => {
        arrayOfProductIds.push(p._id.toString());
      });
    }
    if (coupon.category.length > 0) {
      coupon.category.forEach(p => {
        arrayOfCategoriesIds.push(p._id.toString());
      });
    }
    const intersectionProducts = findCommonElement(
      productsIds,
      arrayOfProductIds
    );
    const intersectionCategories = findCommonElement(
      categoriesIds,
      arrayOfCategoriesIds
    );
    console.log("ids", intersectionProducts, intersectionCategories);
    if (!intersectionCategories && !intersectionProducts) {
      return res.status(412).json({
        message: "not include valid"
      });
    }
    if (coupon.isPercent) {
      let totalOfProductsInCoupon = 0;
      let totalOfCategoriesInCoupon = 0;
      items.forEach(item => {
        console.log(
          item.product._id,
          arrayOfProductIds.indexOf(item.product._id.toString()) > -1
        );
        if (arrayOfProductIds.includes(item.product._id.toString())) {
          totalOfProductsInCoupon += item.cost * item.count;
        }
        const checkIfContainCategory = findCommonElement(
          item.product.categories,
          arrayOfCategoriesIds
        );
        if (checkIfContainCategory) {
          totalOfCategoriesInCoupon += item.cost * item.count;
        }
      });
      const productDiscount = (totalOfProductsInCoupon * coupon.discount) / 100;
      const categoryDiscount =
        (totalOfCategoriesInCoupon * coupon.discount) / 100;
      console.log("total", total - (productDiscount + categoryDiscount));
      return res
        .status(200)
        .json({ total: total - (productDiscount + categoryDiscount) });
    }
    console.log("total", total - coupon.discount);
    return res.status(200).json({ total: total - coupon.discount });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

// renders
exports.renderAdminCreate = (req, res) => {
  const title = "انشاء كوبون";
  res.render("admin/coupons/create", {
    title
  });
};
exports.renderAdminIndex = (req, res) => {
  const title = "كافة الكوبونات";
  res.render("admin/coupons/index", {
    title
  });
};
exports.renderEditAdmin = async (req, res) => {
  const title = "تعديل كوبون";
  const coupon = await Coupon.findById(req.params.id)
    .populate("category")
    .populate("product");
  res.render("admin/coupons/edit", {
    title,
    coupon: JSON.stringify(coupon)
  });
};
