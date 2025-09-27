const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.use('/users', require('./users'));

router.use('/products', require('./products'));

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
	passport.authenticate('github', { failureRedirect: '/' }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);

module.exports = router;
