import jwt from 'jsonwebtoken';

import { db } from '../models';
import { JWT_SECRET } from './utils';

export const tokenMiddleware = (req, res, next) => {
	let authorization = req.get('authorization');
	//The token is passed starting with name bearer so we don't need this
	//That's why I do the split
	let token = authorization ? authorization.split(' ')[1] : undefined;

	req['context'] = {};
	req['context']['authorization'] = authorization;

	if (!token) {
		return next();
	}

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return next();
		}
		db.User.findById(decoded.sub).then(user => {
			if (user) {
				req['context']['authUser'] = {
					id: user._id,
					email: user.email,
				};
			}

			return next();
		});
	});
};
