import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_SECRET, ADMIN_USER } from "../../utils/utils";
import { authenticated } from "./auth.resolver";
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
            console.log("URL: ", hash);

            const id = "5d57e5e299ec554540512583";
            const email = "anderllr@gmail.com";

            const v = `id:${id}|email:${email}`;
            console.log("V: ", v);
            const en = encrypt(v);
            console.log("Encrypt: ", en);

            const d = decrypt(en);
            console.log("Decrypt: ", d);

            let textParts = d.split("|");

            const idR = textParts.shift().replace("id:", "");
            const emailR = textParts.join("|").replace("email:", "");

            const obj = { idR, emailR };
            console.log("Obj: ", obj);

            return { result: "success" };
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
            { db: { AccessLog, User } }
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

                //se deu tudo certo no cadastro do usuário vai mandar o link de boas vindas
                if (user) {
                    //Envia e-mail de boas vindas para autenticação

                    const res = sendEmail(
                        "anderllr@gmail.com",
                        "E-mail de boas vindas"
                    );
                    return { result: res ? "sucess" : "error" };
                }

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
                `${rootUrl}/v=${v}`
            );

            console.log("result: ", result);
            return { result: "success" };
        }
    }
};
