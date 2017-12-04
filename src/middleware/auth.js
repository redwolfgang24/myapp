import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ejwt from 'express-jwt';
import { Router } from 'express';
import { Strategy } from 'passport-local';

import { UnauthorizedError, InternalServerError } from '../lib/errors';

/* eslint no-unused-vars: 0 */
export default ({ config, app }) => {
	const routes = Router();

	// Authenticate using email, password fields in POST body
	passport.use(new Strategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
		session: false,
	},
	async (req, email, password, cb) => {
		const user = await app.models.user.findOne({ email });

		if (!user) {
			return cb(new UnauthorizedError('User not found.'));
		}

		const passwordIsCorrect = await bcrypt.compare(password, user.password);

		if (!passwordIsCorrect) {
			return cb(new UnauthorizedError('Incorrect password.'));
		}

		return cb(null, user);
	}));

	routes.use(passport.initialize());
	routes.use(ejwt({ secret: config.jwt.secret, userProperty: 'tokenPayload' })
		.unless({ path: config.excludedRoutes }));

	// Authenticate endpoint using email and password
	routes.post('/authenticate', (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return next(new InternalServerError(err));
			}

			if (!user) {
				return res.status(401).json({ status: 'error', code: 'unauthorized' });
			}

			const token = jwt.sign({ id: user.id }, config.jwt.secret);

			return res.json({ token, user });
		})(req, res, next);
	});

	// Auth middleware error handler
	routes.use((err, req, res, next) => {
		if (err.name === 'UnauthorizedError') {
			return res.status(err.status).json({
				message: err.message,
			});
		} else if (err.name === 'InternalServerError') {
			return res.status(err.status).json({
				message: err.message,
			});
		}

		return res.status(400).json({
			message: `Something went wrong. ${err.message}`,
		});
	});

	return routes;
};
