import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { GEN_SALT_NUMBER } from "../utils/utils";

/*
    I used regex to require correct e-mail and a strong password
*/

const UserSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a email format"
        ]
    },
    method: { type: String, required: true, trim: true },
    password: {
        type: String,
        required: false,
        trim: true
    }
});

UserSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(Number(GEN_SALT_NUMBER), (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.post("save", function(error, doc, next) {
    if (error.name === "BulkWriteError" && error.code === 11000)
        next(new Error("Este item já existe por favor tente novamente"));
    else next(error);
});

export const User = mongoose.model("User", UserSchema);
