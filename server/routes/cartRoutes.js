const router = require('express').Router();
const c = require('../controllers/cartController');
const { protect, customerOnly } = require('../middleware/auth');

router.use(protect, customerOnly);

router.get('/', c.getCart);
router.post('/', c.addToCart);
router.delete('/', c.clearCart);
router.put('/:itemId', c.updateCartItem);
router.delete('/:itemId', c.removeCartItem);

module.exports = router;
