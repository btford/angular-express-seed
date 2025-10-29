var express = require('express');
var router = express.Router();
var Controller = require('./../controller');

router.get('/', Controller.renderList);
router.get('/create', Controller.renderCreate);
router.get('/:id', Controller.renderGet);
router.get('/:id/edit', Controller.renderEdit);

module.exports = router;