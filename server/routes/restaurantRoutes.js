const router = require('express').Router();
const c = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', c.getRestaurants);
router.get('/:id', c.getRestaurant);
router.post('/', protect, adminOnly, c.createRestaurant);
router.put('/:id', protect, adminOnly, c.updateRestaurant);
router.delete('/:id', protect, adminOnly, c.deleteRestaurant);

module.exports = router;
