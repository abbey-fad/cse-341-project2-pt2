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

router.get('/logout', (req, res, next) => {
	try {
		req.logout((err) => {
			if (err) return next(err);
			req.session.destroy(() => {
				res.clearCookie('connect.sid');
				res.redirect('/');
			});
		});
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({ message: 'Error logging out' });
	}
});

module.exports = router;
