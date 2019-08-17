import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_SECRET, ADMIN_USER } from "../../utils/utils";
import { authenticated } from "./auth.resolver";

const inputLog = (userId, method, accessToken, providerId, signInMethod) => {
    const input = {
        userId,
        method
    };

    if (method != "email") {
        input.accessToken = accessToken;
        input.providerId = providerId;
        input.signInMethod = signInMethod;
    }

    return input;
};

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
        }
    },
    Mutation: {
        login: async (parent, { userName, password }, { db: { User } }) => {
            const user = await User.findOne({ userName });

            let errorMsg = "Não autorizado, usuário ou senha inválido(s)!";
            if (!user || !bcrypt.compareSync(password, user.password)) {
                throw new Error(errorMsg);
            }

            const payload = { sub: user._id };

            const { id, name, email, method } = user;

            //Agora grava o log de acesso
            await new AccessLog(inputLog(id, "userName")).save();

            return {
                id,
                name,
                email,
                method,
                userName,
                token: jwt.sign(payload, JWT_SECRET)
            };
        },
        loginemail: async (
            parent,
            { email, password },
            { db: { User, UserEmail, AccessLog } }
        ) => {
            const user = await User.findOne({ email });

            let errorMsg = "Não autorizado, email ou senha inválido(s)!";
            if (!user || !bcrypt.compareSync(password, user.password)) {
                throw new Error(errorMsg);
            }

            const useremail = await UserEmail.findOne({ userId: user._id });

            if (!useremail) {
                throw new Error("unverified-email");
            }

            const payload = { sub: user._id };

            const { id, userName, name, method } = user;

            //Agora grava o log de acesso
            await new AccessLog(inputLog(id, "email")).save();

            return {
                id,
                name,
                email,
                method,
                userName,
                token: jwt.sign(payload, JWT_SECRET)
            };
        },
        //Rotina de login para quando o usuário fizer a validação pelo e-mail
        loginvalidemail: async (
            parent,
            { hash },
            { db: { User, UserEmail, AccessLog } }
        ) => {
            //TODO: Rotina de validação do e-mail
            /* const user = await User.findOne({ email });

            let errorMsg = "Não autorizado, email ou senha inválido(s)!";
            if (!user || !bcrypt.compareSync(password, user.password)) {
                throw new Error(errorMsg);
            }

            const payload = { sub: user._id };

            const { id, userName, name, method } = user;

            //Agora grava o log de acesso
            await new AccessLog(inputLog(id, "email")).save();

            return {
                id,
                name,
                email,
                method,
                userName,
                token: jwt.sign(payload, JWT_SECRET)
            }; */
        },
        loginauth: async (
            parent,
            { email, name, accessToken, providerId, signInMethod },
            { db: { AccessLog, User, UserEmail } }
        ) => {
            let user = await User.findOne({ email });

            if (!user) {
                const inputUser = {
                    name,
                    userName: email,
                    email,
                    method: signInMethod,
                    password: "Sign2019@@"
                };
                //Cadastra o usuário, pois o acesso dele já foi confirmado
                user = await new User(inputUser).save();

                let errorMsg =
                    "Não autorizado, problemas no cadastro do usuário!";
                if (!user) {
                    throw new Error(errorMsg);
                }
            }

            const payload = { sub: user._id };

            const { id, userName, method } = user;

            //Agora grava o log de acesso
            await new AccessLog(
                inputLog(id, "auth", accessToken, providerId, signInMethod)
            ).save();

            return {
                id,
                name,
                email,
                method,
                userName,
                token: jwt.sign(payload, JWT_SECRET)
            };
        },
        createUser: authenticated(
            async (parent, { input }, { db: { User } }) => {
                const user = await new User(input).save();
                return user;
            }
        ),
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
            async (
                parent,
                { lastPassword, input },
                { authUser, db: { User } }
            ) => {
                const { id } = authUser;
                const user = await User.findById(id);

                let errorMsg = "Senha anterior não confere!";
                if (!user || !bcrypt.compareSync(lastPassword, user.password)) {
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
            const userRemoved = await User.deleteOne({ _id: id });

            if (userRemoved.deletedCount == 0) {
                throw new Error("Erro ao remover usuário");
            }

            return userRemoved.deletedCount > 0;
        })
    }
};
