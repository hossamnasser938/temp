var AddressModel = require("../models/AddressModel.js");
var User = require("../models/user");

/**
 * AddressController.js
 *
 * @description :: Server-side logic for managing Addresss.
 */
module.exports = {
  /**
   * AddressController.list()
   */
  list: async (req, res) => {
    const adds = await AddressModel.find({ user: req.user._id });
    return res.json({ adds });
  },

  /**
   * AddressController.create()
   */
  create: async (req, res) => {
    if (!req.body) {
      return res.status(422).json({ message: "no data found" });
    }

    const { name, phone, city, area, street, building } = req.body;

    const params = [
      { key: "name", val: name },
      { key: "phone", val: phone },
      { key: "city", val: city },
      { key: "area", val: area },
      { key: "street", val: street },
      { key: "building", val: building }
    ];

    const missingParams = params.reduce((acc, val) => {
      if (!val.val) {
        return acc.concat(val.key);
      }

      return acc;
    }, []);

    if (missingParams.length) {
      return res
        .status(422)
        .json({ message: "Required Fields: " + missingParams.join(", ") });
    }

    try {
      const Address = await AddressModel.create({
        name: req.body.name,
        phone: req.body.phone,
        city: req.body.city,
        area: req.body.area,
        street: req.body.street,
        building: req.body.building,
        user: req.user._id
      });
      const user = await User.findById(req.user._id);
      user.addresses.push(Address._id);
      user.save();
      console.log(user);
      return res.status(201).json(Address);
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * AddressController.update()
   */
  update: function(req, res) {
    var id = req.params.id;
    AddressModel.findOne({ _id: id }, function(err, Address) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Address",
          error: err
        });
      }
      if (!Address) {
        return res.status(404).json({
          message: "No such Address"
        });
      }

      Address.name = req.body.name ? req.body.name : Address.name;
      Address.phone = req.body.phone ? req.body.phone : Address.phone;
      Address.city = req.body.city ? req.body.city : Address.city;
      Address.area = req.body.area ? req.body.area : Address.area;
      Address.street = req.body.street ? req.body.street : Address.street;
      Address.building = req.body.building
        ? req.body.building
        : Address.building;

      Address.save(function(err, Address) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating Address.",
            error: err
          });
        }

        return res.json(Address);
      });
    });
  },

  /**
   * AddressController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    AddressModel.findByIdAndRemove(id, function(err, Address) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the Address.",
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
