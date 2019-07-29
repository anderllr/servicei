import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_SECRET, ADMIN_USER } from "../../utils/utils";
import { authenticated } from "./auth.resolver";

export default {
	Query: {
		users: authenticated(async (parent, args, { db: { User } }) => {
			//Find users excluding admin
			const users = await User.find({ userName: { $nin: [ADMIN_USER] } });
			return users.map(user => {
				user._id = user._id.toString();
				return user;
			});
		}),
		user: authenticated(async (parent, args, { db: { User } }) => {
			const user = await User.findById(args.id);
			return user;
		}),
		authUser: async (parent, args, { authUser, db }) => {
			//TODO: Verify Token
			return authUser;
		},

		login: async (parent, { userName, password }, { db: { User } }) => {
			const user = await User.findOne({ userName });

			let errorMsg = "Não autorizado, usuário ou senha inválido(s)!";
			if (!user || !bcrypt.compareSync(password, user.password) ) {
				throw new Error(errorMsg);
			}

			const payload = { sub: user._id };

			return {
				token: jwt.sign(payload, JWT_SECRET)
			};
		}
	},
	Mutation: {
		createUser: authenticated(async (parent, { input }, { db: { User } }) => {
			const user = await new User(input).save();
			return user;
		}),
		updateUser: authenticated(
			async (parent, { id, input }, { db: { User } }) => {
				const user = await User.findById(id);

				user.set(input);
				await user.save();
				if (!user) {
					return false;
				}
				return user;
			}
		),
		updateUserPassword: authenticated(
			async (parent, { lastPassword, input }, { authUser, db: { User } }) => {
				const { id } = authUser;
				const user = await User.findById(id);

				let errorMsg = "Senha anterior não confere!";
				if (
					!user ||
					!bcrypt.compareSync(lastPassword, user.password)
				) {
					throw new Error(errorMsg);
				}

				user.set(input);
				await user.save();
				if (!user) {
					return false;
				}
				return true;
			}
		),
		deleteUser: authenticated(async (parent, { id }, { db: { User } }) => {
			const userRemoved = await User.findByIdAndRemove(id);

			if (!userRemoved) {
				throw new Error("Error removing user");
			}

			return userRemoved;
		})
	}
};
