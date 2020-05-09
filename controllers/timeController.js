const TimeModel = require("../models/timeModel.js");
const paginate = require("../config/helpers").paginate;

/**
 * paginate throw TimeModel
 */
exports.paginate = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  res.json(
    await paginate(
      TimeModel,
      {}, //filter
      page,
      limit,
      { created_at: -1 }, //sort
      [], // populate
      {} // select fields
    )
  );
};
exports.list = async (req, res) => {
  res.json(await TimeModel.find({}));
};
/**
 * create TimeModel
 */
exports.create = async (req, res) => {
  let newModel = req.body.newModel;
  try {
    const createdModel = await TimeModel.create(newModel);
    if (createdModel) {
      return res.status(200).json({ message: "created", model: createdModel });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * update TimeModel
 */

exports.edit = async (req, res) => {
  let newModel = req.body.newModel;
  try {
    const updatedModel = await TimeModel.findByIdAndUpdate(
      newModel._id,
      newModel
    );
    if (updatedModel) {
      return res
        .status(200)
        .json({ message: "updated", newModel: updatedModel });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

/**
 * find TimeModel by id
 */

exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await TimeModel.findById(id);
    return res.json({ model });
  } catch (error) {
    return res.status(500).json({ message: "not found" });
  }
};
/**
 * delete TimeModel by id
 */

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await TimeModel.findOneAndDelete(id);
    return res.json({ message: "deleted" });
  } catch (error) {
    return res.status(500).json({ message: "not found" });
  }
};

exports.renderCreatePage = (req, res) => {
  const title = "انشاء ";
  res.render("admin/time/create", { title });
};
exports.renderAdminIndex = (req, res) => {
  const title = "الكل";
  res.render("admin/time/index", { title });
};
exports.renderAdminEdit = async (req, res) => {
  const id = req.params.id;
  const oldModel = await TimeModel.findById(id);
  const title = "تعديل";
  res.render("admin/time/edit", { title, oldModel: JSON.stringify(oldModel) });
};
