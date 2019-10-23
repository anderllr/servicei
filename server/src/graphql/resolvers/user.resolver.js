import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { JWT_SECRET, ADMIN_USER } from "../../utils/utils";
import { authenticated, masterUserId } from "./auth.resolver";
import { sendEmail } from "../../utils/sendEmail";
import { encrypt, decrypt } from "../../utils/crypt";

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
        users: authenticated(
            async (parent, args, { db: { User }, authUser }) => {
                const masterId = masterUserId(authUser);
                console.log("MasterUserId: ", masterId);
                //Find users excluding admin
                const users = await User.find({
                    userName: { $nin: [ADMIN_USER] },
                    $or: [
                        { _id: mongoose.Types.ObjectId(masterId) },
                        { masterUserId: masterId }
                    ]
                });
                //            const users = await User.find({});
                return users.map(user => {
                    user._id = user._id.toString();
                    return user;
                });
            }
        ),
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

            if (user) {
                if (user.method != "email") {
                    throw new Error(
                        `Usuário já cadastrado pelo método: ${user.method}`
                    );
                }

                const useremail = await UserEmail.findOne({ userId: user._id });

                if (!useremail) {
                    throw new Error("unverified-email");
                }
            }

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
            };
        },
        //Rotina de login para quando o usuário fizer a validação pelo e-mail
        loginvalidemail: async (
            parent,
            { hash },
            { db: { User, UserEmail } }
        ) => {
            const hashdec = decrypt(hash);

            let hashParts = hashdec.split("|");
            let id = hashParts.shift().replace("id:", "");
            let email = hashParts.join("|").replace("email:", "");

            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("invalid-link");
            }
            if (user._id != id) {
                throw new Error("invalid-id");
            }

            const useremail = await UserEmail.findOne({ userId: user._id });

            if (useremail) {
                throw new Error("verified-email");
            }

            const input = { userId: user._id, email };

            await new UserEmail(input).save();

            return { result: "success" };
        },
        loginauth: async (
            parent,
            { email, name, accessToken, providerId, signInMethod },
            { db: { AccessLog, User } }
        ) => {
            let user = await User.findOne({ email });

            if (!user) {
                const inputUser = {
                    name,
                    userName: email,
                    email,
                    method: signInMethod,
                    password: "Sign2019@@",
                    masterUserId: "same",
                    stUser: "ATIVO"
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

            const { id, userName, masterUserId, stUser, method } = user;

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
                masterUserId,
                stUser,
                token: jwt.sign(payload, JWT_SECRET)
            };
        },
        createUser: authenticated(
            async (parent, { input }, { db: { User }, authUser }) => {
                let user = await User.findOne({ email: input.email });

                if (user) {
                    throw new Error(
                        `Usuário já cadastrado pelo método: ${user.method}`
                    );
                }

                if (!input.masterUserId) {
                    input.masterUserId =
                        authUser.masterUserId &&
                        authUser.masterUserId !== "same"
                            ? authUser.masterUserId
                            : authUser.id;
                }
                input.stUser = "ATIVO";

                user = await new User(input).save();

                return user;
            }
        ),
        updateUser: authenticated(
            async (parent, { id, input }, { db: { User }, authUser }) => {
                const user = await User.findById(id);

                if (!user.masterUserId) {
                    input.masterUserId =
                        authUser.masterUserId &&
                        authUser.masterUserId !== "same"
                            ? authUser.masterUserId
                            : authUser.id;
                }

                if (!user.stUser) {
                    input.stUser = "ATIVO";
                }

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
        }),
        //Rotina de login para quando o usuário fizer a validação pelo e-mail
        sendEmailValidate: async (
            parent,
            { email, rootUrl },
            { db: { User, UserEmail, AccessLog } }
        ) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("E-mail não encontrado");
            }

            if (user.method != "email") {
                throw new Error(
                    `E-mail já validado via autenticação: ${user.method}`
                );
            }
            const useremail = await UserEmail.findOne({ userId: user._id });

            if (useremail) {
                throw new Error("E-mail já verificado anteriormente!");
            }

            const v = encrypt(`id:${user._id}|email:${email}`);

            const result = await sendEmail(
                email,
                "Bem vindo ao Servicei",
                `${rootUrl}/verify/email?v=${v}`
            );

            return { result: "success" };
        }
    }
};
