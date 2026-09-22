const router = require('express').Router();
const c = require('../controllers/tableController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', c.getTables);
router.get('/:id', c.getTable);
router.post('/', protect, adminOnly, c.createTable);
router.put('/:id', protect, adminOnly, c.updateTable);
router.delete('/:id', protect, adminOnly, c.deleteTable);

module.exports = router;
