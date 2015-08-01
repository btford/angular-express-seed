var express = require('express');
var router = express.Router();
var Controller = require('./../controller');

router.get('/', Controller.retrieve);
router.get('/:id', Controller.get);

router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;