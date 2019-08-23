import mongoose from "mongoose";

const UserEmailSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, required: true },
        dtverified: { type: Date, default: Date.now },
        email: { type: String, required: true }
    },
    { collection: "useremail" }
);

export const UserEmail = mongoose.model("UserEmail", UserEmailSchema);
