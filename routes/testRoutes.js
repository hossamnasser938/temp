const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController.js');

/**
 * admin routes
 */
router.get("/", testController.renderAdminIndex);
router.get("/create", testController.renderCreatePage);

router.get("/edit/:id", testController.renderAdminEdit);


/*
 * GET
 */
router.get('/paginate', testController.paginate);

/*
 * GET
 */
router.get('/:id', testController.show);

/*
 * POST
 */
router.post('/', testController.create);

/*
 * PUT
 */
router.put('/:id', testController.edit);

/*
 * DELETE
 */
router.delete('/:id', testController.remove);

module.exports = router;
