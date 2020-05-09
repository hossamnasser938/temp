const TestModel = require('../models/testModel.js');
const paginate = require("../config/helpers").paginate;

/**
 * paginate throw TestModel
 */
exports.paginate = async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    res.json(
        await paginate(
            TestModel,
            {}, //filter
            page,
            limit,
            { created_at: -1 }, //sort
            [], // populate
            {} // select fields
        )
    );
};
/**
 * create TestModel
 */
exports.create = async (req, res) => {
    let newModel = req.body.newModel;
    try {
        const createdModel = await TestModel.create(newModel);
        if (createdModel) {
            return res
                .status(200)
                .json({ message: "created", model: createdModel });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * update TestModel
 */

exports.edit = async (req, res) => {
    let newModel = req.body.newModel;
    try {
        const updatedModel = await TestModel.findByIdAndUpdate(
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
 * find TestModel by id
 */

exports.show = async (req, res) => {
    const { id } = req.params;
    try {
        const model = await TestModel.findById(id);
        return res.json({ model });
    } catch (error) {
        return res.status(500).json({ message: "not found" });
    }
};
/**
 * delete TestModel by id
 */

exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        const model = await TestModel.findOneAndDelete(id);
        return res.status(200).json({message:"deleted"});
    } catch (error) {
        return res.status(500).json({ message: "not found" });
    }
};

exports.renderCreatePage = (req, res) => {
    const title = "انشاء ";
    res.render("admin/test/create", { title });
  };
  exports.renderAdminIndex = (req, res) => {
    const title = "الكل";
    res.render("admin/test/index", { title });
  };
  exports.renderAdminEdit = async (req, res) => {
    const id = req.params.id;
    const oldModel = await TestModel.findById(id);
    const title = "تعديل";
    res.render("admin/test/edit", { title, oldModel: JSON.stringify(oldModel) });
  };
  