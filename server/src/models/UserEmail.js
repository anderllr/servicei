import mongoose from "mongoose";

const UserEmail = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, required: true },
        timestamp: { type: Date, default: Date.now },
        email: { type: String, required: true }
    },
    { collection: "useremail" }
);

export const UserEmail = mongoose.model("UserEmail", UserEmail);
