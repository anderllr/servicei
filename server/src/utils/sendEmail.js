import nodemailer from "nodemailer";

import {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_FROM
} from "./utils";

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE, //true for 465 port, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

export const sendEmail = async (to, subject, link) => {
    const mailOptions = {
        from: EMAIL_FROM, // sender address
        to, // list of receivers
        subject, // Subject line
        html: `<b>Hello world?</b></br></br><a href="${link}">Clique aqui para validar</a>`
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log("Info: ", info);
            return true;
        }
    });
};
