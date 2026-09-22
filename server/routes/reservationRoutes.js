const router = require('express').Router();
const c = require('../controllers/reservationController');
const { protect, adminOnly, customerOnly } = require('../middleware/auth');

router.post('/', protect, customerOnly, c.createReservation);
router.get('/my', protect, customerOnly, c.getMyReservations);
router.put('/my/:id/cancel', protect, customerOnly, c.cancelMyReservation);
router.get('/', protect, adminOnly, c.getAllReservations);
router.put('/:id', protect, adminOnly, c.updateReservationStatus);

module.exports = router;
