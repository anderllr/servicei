import express from "express";
import bodyParser from "body-parser";
import graphqlHTTP from "express-graphql";
import mongoose from "mongoose";
import cors from "cors";
import { apolloUploadExpress } from "apollo-upload-server";
const env = require("dotenv").config();
var path = require("path");

import schema from "./src/graphql/schema";
import { db } from "./src/models";
import { tokenMiddleware } from "./src/utils/tokenMiddleware";
import { verifyAdmin } from "./src/utils/firstData";

import { MONGODB_URI, MONGO_PASSWORD, MONGO_USER } from "./src/utils/utils";

const APP_NAME = "serviceiapp";

const MONGO_LOCAL = `mongodb://127.0.0.1:27017/${APP_NAME}`;

const MONGO_URI = MONGODB_URI ? MONGODB_URI : MONGO_LOCAL;

let options = {
    useNewUrlParser: true,
    useCreateIndex: true
};

/* Já estava comentado
if (MONGO_USER && MONGO_PASSWORD) {
	options.user = MONGO_USER;
	options.pass = MONGO_PASSWORD;
}
console.log("Mongo Link: ", MONGO_URI);
console.log("Options: ", options);
*/

mongoose.connect(MONGO_URI, options);

const PORT = process.env.port || 3002;
//const HOST = process.env.host || "192.168.1.109";

const app = express();

//Middleware to put db in request and later in context
const dbRequest = (req, res, next) => {
    req["context"]["db"] = db;
    next();
};

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"));
    //	console.log("DirName: ", __dirname);
    // Return the main index.html, so react-router render the route in the client

    app.get(
        [
            "/",
            "/admin",
            "/admin/users",
            "/admin/clientes",
            "/admin/itens",
            "/admin/frota",
            "/admin/caminhao",
            "/admin/consultafrete"
        ],
        (req, res) => {
            res.sendFile(path.resolve("../client/build", "index.html"));
        }
    );
}

verifyAdmin();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept-Enconding"],
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

app.use(
    "/serviceiql",
    apolloUploadExpress({ maxFileSize: 100000000, maxFiles: 100 }),
    tokenMiddleware,
    dbRequest,
    bodyParser.json({ limit: "50mb" }),
    bodyParser.urlencoded({ limit: "50mb", extended: true }),
    graphqlHTTP(req => ({
        schema: schema,
        graphiql: process.env.NODE_ENV !== "production",
        context: req["context"]
    }))
);

app.use("/imgs/", express.static("./imgs"));

app.listen(PORT, () => console.log(`Server connected at port: ${PORT}`));
