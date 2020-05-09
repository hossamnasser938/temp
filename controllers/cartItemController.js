const cartItemModel = require("../models/cartItemModel.js");
/**
 * cartItemController.js
 *
 * @description :: Server-side logic for managing cartItems.
 */
module.exports = {
  /**
   * cartItemController.list()
   */
  list: async (req, res) => {
    const { user } = req;
    try {
      const items = await cartItemModel
        .find({ user: user._id, inCart: true })
        .populate("product")
        .populate("replacement");
      return res.status(200).json({ items });
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting cartItem.",
        error: err
      });
    }
  },

  /**
   * cartItemController.show()
   */
  show: function(req, res) {
    var id = req.params.id;
    cartItemModel.findOne({ _id: id }, function(err, cartItem) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting cartItem.",
          error: err
        });
      }
      if (!cartItem) {
        return res.status(404).json({
          message: "No such cartItem"
        });
      }
      return res.json(cartItem);
    });
  },

  /**
   * cartItemController.create()
   */
  create: async (req, res) => {
    const { user } = req;
    try {
      const oldItem = await cartItemModel.findOne({
        user: user._id,
        product: req.body.product,
        inCart: true
      });
      if (oldItem != null) {
        oldItem.count += req.body.count;
        oldItem.save();
        return res.status(200).json(oldItem);
      }
    } catch (err) {
      return res.status(500).json({
        message: "Error when find item in cart",
        error: err
      });
    }

    try {
      const cartItem = await cartItemModel.create({
        product: req.body.product, // required
        count: req.body.count,
        cost: req.body.cost, // required
        user: user._id,
        inCart: true
      });
      return res.status(200).json(cartItem);
    } catch (err) {
      return res.status(500).json({
        message: "Error when find item in cart",
        error: err
      });
    }
  },

  /**
   * cartItemController.update()
   */
  update: async (req, res) => {
    const { id } = req.body;
    console.log(id);

    const { action } = req.body;
    try {
      const item = await cartItemModel.findById(id);
      const { count } = item;
      if (action == "increase") {
        item.count += req.body.count;
        item.save();
        return res.status(200).json({ message: "success" });
      }
      if (action == "decrease") {
        if (count === req.body.count) {
          item.delete();
          return res.status(200).json({ message: "success" });
        }
        item.count -= req.body.count;
        item.save();
        return res.status(200).json({ message: "success" });
      }
      if (action == "delete") {
        item.delete();
        return res.status(200).json({ message: "success" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "failed" });
    }
  },
  /**
   * cartItemController.remove()
   */
  remove: function(req, res) {
    const { id } = req.params;
    cartItemModel.findByIdAndRemove(id, function(err, cartItem) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the cartItem.",
          error: err
        });
      }
      return res.status(204).json();
    });
  },
  changeReplacement: async (req, res) => {
    const { id, replacementId } = req.body;
    try {
      const cartItem = await cartItemModel.findById(id);
      cartItem.replacement = replacementId;
      cartItem.save();
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
};
