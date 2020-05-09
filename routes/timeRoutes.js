var express = require("express");
var router = express.Router();
var timeController = require("../controllers/timeController.js");

router.get("/", timeController.renderAdminIndex);
router.get("/create", timeController.renderCreatePage);

router.get("/edit/:id", timeController.renderAdminEdit);

/*
 * GET
 */
router.get("/paginate", timeController.paginate);

/*
 * GET
 */
router.get("/:id", timeController.show);

/*
 * POST
 */
router.post("/", timeController.create);

/*
 * PUT
 */
router.put("/:id", timeController.edit);

/*
 * DELETE
 */
router.delete("/:id", timeController.remove);

module.exports = router;
