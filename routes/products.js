const router = require('express').Router();

const productsController = require('../controllers/products');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', productsController.getAll);

router.get('/:id', productsController.getSingle);

router.post('/', isAuthenticated, productsController.createProduct);

router.put('/:id', isAuthenticated, productsController.updateProduct);

router.delete('/:id', isAuthenticated, productsController.deleteProduct);

module.exports = router;
