const Slider = require("../models/banners");
const Test = require("../models/order");

const Jimp = require("jimp");
// const client = require('../config/redis')

/**
 * render edit page
 */
exports.editSlider = async (req, res) => {
  res.render("admin/banners/index", { title: "البنرات" });
};

/**
 * fetching slider json
 */
exports.fetchSlider = async (req, res) => {
  const slider = await Slider.find({});
  return res.json({ slider });
};

/**
 * upload and resize slider image
 */
exports.uploadImage = async (req, res) => {
  let sliderImage = req.files.thumb;
  let sliderImageType = sliderImage.mimetype;
  let type = sliderImageType.split("/")[0];
  if (type != "image") {
    return res.json({ message: "type error" });
  }
  name = Date.now() + sliderImage.name;
  let uploadPath = __dirname + "/../public/uploads/slider/" + name;
  const uploaded = await sliderImage.mv(uploadPath);
  Jimp.read(uploadPath, (err, img) => {
    if (err) res.json(err);
    img
      .resize(800, 300)
      .write(__dirname + "/../public/uploads/slider/resized/" + name);
    return res.json({ message: "success", image: name });
  });
};

/**
 * updating slider
 */

exports.update = async (req, res) => {
  const newSlider = req.body.slider;
  const oldSlider = await Slider.findOne({ _id: newSlider._id });
  if (!oldSlider) {
    return res.json({ message: "slider not found" });
  }
  oldSlider.image = newSlider.image;
  oldSlider.refType = newSlider.refType;
  oldSlider.refId = newSlider.refId;

  const updatedSlider = await oldSlider.save();
  if (updatedSlider) {
    return res.json({ message: "success" });
  }
};
// const transporter = require("../config/mailer");
// const ejs = require("ejs");
// const path = require("path");

exports.dev = async (req, res) => {
  // try {
  //   const data = await ejs.renderFile(
  //     path.join(__dirname, "../views/emails/new_order.ejs")
  //   );
  //   let info = await transporter.sendMail({
  //     from: '"new order" <orders@webaystore.com>', // sender address
  //     to: "pcissp@yahoo.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: data // html body
  //   });

  //   res.send("ok");
  // } catch (err) {
  //   res.json(err);
  // }
  // for(let i= 0; i < 6; i++) {
  //   await Slider.create({
  //     image: 'placeholder.png',

  //   });
  // }
  res.send('ok')
};
