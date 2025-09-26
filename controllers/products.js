const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
	//#swagger.tags=['Products']
	try {
		const products = await mongodb
			.getDatabase()
			.collection('products')
			.find()
			.toArray();

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(products);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getSingle = async (req, res) => {
	//#swagger.tags=['Products']
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid product id to find a product.');
	}

	try {
		const productId = new ObjectId(req.params.id);
		const product = await mongodb
			.getDatabase()
			.collection('products')
			.findOne({ _id: productId });

		if (!product) {
			return res.status(404).json({ message: 'Product not found.' });
		}

		res.setHeader('Content-Type', 'application/json');
		res.status(200).json(product);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const createProduct = async (req, res) => {
	//#swagger.tags=['Products']
	const product = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		stock: req.body.stock,
		sku: req.body.sku,
		manufacturer: req.body.manufacturer
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('products')
			.insertOne(product);

		if (response.acknowledged) {
			res.status(201).json(response);
		} else {
			res.status(500).json(response.error || 'Some error occurred while creating the product.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updateProduct = async (req, res) => {
	//#swagger.tags=['Products']
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid product id to update a product.');
	}

	const productId = new ObjectId(req.params.id);
	const product = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		stock: req.body.stock,
		sku: req.body.sku,
		manufacturer: req.body.manufacturer
	};

	try {
		const response = await mongodb
			.getDatabase()
			.collection('products')
			.replaceOne({ _id: productId }, product);

		if (response.modifiedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while updating the product.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const deleteProduct = async (req, res) => {
	//#swagger.tags=['Products']
	if (!ObjectId.isValid(req.params.id)) {
		return res.status(400).json('Must use a valid product id to delete a product.');
	}

	const productId = new ObjectId(req.params.id);

	try {
		const response = await mongodb
			.getDatabase()
			.collection('products')
			.deleteOne({ _id: productId });

		if (response.deletedCount > 0) {
			res.status(204).send();
		} else {
			res.status(500).json(response.error || 'Some error occurred while deleting the product.');
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getAll, getSingle, createProduct, updateProduct, deleteProduct };
