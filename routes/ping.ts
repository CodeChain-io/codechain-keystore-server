import * as express from "express";
import { Context } from "../context";

export function createRouter(context: Context) {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            await context.cckey.getKeys();
            res.json({
                success: true,
            });
        } catch (err) {
            res.json({
                success: false,
                error: err
            });
        }
    });

    return router;
}
