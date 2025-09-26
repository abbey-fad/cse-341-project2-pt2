const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
	const validationRule = {
		firstName: 'required|string',
		lastName: 'required|string',
		email: 'required|email',
		favoriteColor: 'required|string',
		birthday: 'string'
	};

	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err
			});
		} else {
			next();
		}
	});
};

const saveProduct = (req, res, next) => {
	const validationRule = {
		name: 'required|string',
		price: 'required|numeric',
		description: 'string',
		category: 'required|string'
	};

	validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err
			});
		} else {
			next();
		}
	});
};

module.exports = {
	saveUser,
	saveProduct
};
