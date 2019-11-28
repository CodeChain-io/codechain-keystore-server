import * as config from "config";
import * as express from "express";
import * as createError from "http-errors";
import * as knex from "knex";
import * as logger from "morgan";
import { Model } from "objection";
const morganBody = require("morgan-body");

import { createRouter as createApiRouter } from "./routes/api";
import { createRouter as createPingRouter } from "./routes/ping";

export async function createApp(): Promise<express.Application> {
    Model.knex(knex(config.get("knex")));
    const app = express();

    app.use(logger("dev"));
    app.use(express.json());
    morganBody(app);

    app.use("/api", createApiRouter());
    app.use("/ping", createPingRouter());

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    });

    // error handler
    app.use((err: any, req: express.Request, res: express.Response) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
        console.error(err);

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });
    return app;
}
