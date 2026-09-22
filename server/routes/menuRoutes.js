const router = require('express').Router();
const c = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', c.getMenu);
router.get('/:id', c.getMenuItem);
router.post('/', protect, adminOnly, c.createMenuItem);
router.put('/:id', protect, adminOnly, c.updateMenuItem);
router.delete('/:id', protect, adminOnly, c.deleteMenuItem);

module.exports = router;
