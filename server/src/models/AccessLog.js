import mongoose from "mongoose";

const AccessLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, required: true },
        timestamp: { type: Date, default: Date.now },
        method: { type: String, required: true },
        accessToken: { type: String, required: false },
        providerId: { type: String, required: false },
        signInMethod: { type: String, required: false }
    },
    { collection: "accesslog" }
);

export const AccessLog = mongoose.model("AccessLog", AccessLogSchema);
