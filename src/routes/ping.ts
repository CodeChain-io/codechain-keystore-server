import * as express from "express";

export function createRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.json({
            success: true
        });
    });

    return router;
}
