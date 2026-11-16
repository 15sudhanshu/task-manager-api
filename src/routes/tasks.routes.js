const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/tasks.controller');

router.use(auth); // every task route requires a valid JWT

router.get('/', c.list);
router.post('/', c.create);
router.get('/:id', c.getOne);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
