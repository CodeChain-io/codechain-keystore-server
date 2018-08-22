import * as express from "express";
import { Context } from "../context";

type KeyType = "asset" | "platform";

export function createRouter(context: Context) {
    const router = express.Router();

    router.get("/keys", async (req, res) => {
        const keyType: KeyType = req.body.keyType;
        const keys = await context.cckey[keyType].getKeys();

        res.json({
            success: true,
            result: keys
        });
    });

    router.post("/keys", async (req, res) => {
        const { passphrase } = req.body;
        const keyType: KeyType = req.body.keyType;
        const publicKey = await context.cckey[keyType].createKey({ passphrase });
        res.json({
            success: true,
            result: publicKey
        });
    });

    router.post("/keys/:key/remove", async (req, res) => {
        const { key } = req.params;
        const { passphrase = "" } = req.body;
        const keyType: KeyType = req.body.keyType;
        const result = await context.cckey[keyType].deleteKey({ publicKey: key, passphrase });
        res.json({
            success: true,
            result
        });
    });

    router.post("/keys/:key/sign", async (req, res) => {
        try {
            const { key } = req.params;
            const { message, passphrase = "" } = req.body;
            const keyType: KeyType = req.body.keyType;
            const result = await context.cckey[keyType].sign({ publicKey: key, passphrase, message });
            res.json({
                success: true,
                result
            });
        } catch (e) {
            res.json({
                success: false,
                error: e
            });
        }
    });

    router.post("/pkhs", async (req, res) => {
        const { publicKey } = req.body;
        const hash = await context.cckey.pkh.insertPKH({ publicKey });
        res.json({
            success: true,
            result: hash
        });
    });

    router.get("/pkhs/:hash", async (req, res) => {
        const { hash } = req.params;
        const publicKey = await context.cckey.pkh.getPKH({ hash });
        res.json({
            success: true,
            result: publicKey
        });
    });

    return router;
}
