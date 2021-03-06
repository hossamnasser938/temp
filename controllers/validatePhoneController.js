const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Axios = require("axios");
const ValidatePhoneModel = require("../models/validatePhoneModel.js");
const User = require("../models/user");
const { secret } = require("../config/constants");

const uniCoded = `%D8%A7%D9%84%D9%83%D9%88%D8%AF%20%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%20%D8%A8%D9%83%20%D9%87%D9%88%20`;

/**
 * create ValidatePhoneModel
 */
exports.create = async (req, res) => {
  const { phone } = req.body;
  const sendCode = async (code, number) => {
    const resApi = await Axios.get(
      `https://www.hisms.ws/api.php?send_sms&username=966591917472&password=123456zxcvbn&numbers=+966${number}&sender=Family Way&message=${uniCoded}${code}`
    );
    console.log(resApi.data);
  };
  if (!phone) {
    return res.status(500).json({ message: "phone required" });
  }

  try {
    // check if exist
    const oldValidator = await ValidatePhoneModel.findOne({ phone });
    if (oldValidator !== null) {
      const newCode = Math.ceil(Math.random() * (10000 - 1000) + 1000);
      oldValidator.code = newCode;
      await oldValidator.save();
      console.log(newCode);
      await sendCode(newCode, phone);
      return res.status(200).json({ message: "updated", code: newCode });
      // send verification code
    }
    const newCode = Math.ceil(Math.random() * (10000 - 1000) + 1000);
    await ValidatePhoneModel.create({
      phone,
      code: newCode
    });
    // send verification code
    console.log(newCode);
    await sendCode(newCode, phone);

    return res.status(200).json({ message: "created", code: newCode });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

/**
 * Validate ValidatePhoneModel
 */
exports.validate = async (req, res) => {
  const { code, phone } = req.body;
  try {
    const validator = await ValidatePhoneModel.findOne({ phone }).populate(
      "addresses"
    );
    if (validator == null) {
      return res.status(404).json({ message: "not found" });
    }
    if (code != validator.code) {
      return res.status(401).json({ message: "wrong code" });
    }

    // check if user exist
    const existedUser = await User.findOne({ phone }).populate("addresses");
    if (existedUser != null) {
      const token = jwt.sign(existedUser.toJSON(), secret);
      return res.status(200).json({ token, userData: existedUser });
    }
    const newUser = await User.create({
      phone
    });
    const token = jwt.sign(newUser.toJSON(), secret);
    return res.status(200).json({ token, userData: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
