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

    router.get("/keys/:key/publicKey", async (req, res) => {
        const { key } = req.params;
        const keyType: KeyType = req.body.keyType;
        const publicKey = await context.cckey[keyType].getPublicKey({ key });

        res.json({
            success: true,
            result: publicKey
        });
    });

    router.get("/keys/:key/rawKey", async (req, res) => {
        try {
            const { key } = req.params;
            const { passphrase } = req.body;
            const keyType: KeyType = req.body.keyType;
            const rawKey = await context.cckey[keyType].exportRawKey({
                key,
                passphrase
            });

            res.json({
                success: true,
                result: rawKey
            });
        } catch (e) {
            res.json({
                success: false,
                error: e
            });
        }
    });

    router.post("/keys", async (req, res) => {
        const { passphrase } = req.body;
        const keyType: KeyType = req.body.keyType;
        const key = await context.cckey[keyType].createKey({
            passphrase
        });
        res.json({
            success: true,
            result: key
        });
    });

    router.delete("/keys/:key", async (req, res) => {
        const { key } = req.params;
        const keyType: KeyType = req.body.keyType;
        const result = await context.cckey[keyType].deleteKey({
            key
        });
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
            const result = await context.cckey[keyType].sign({
                key,
                passphrase,
                message
            });
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

    return router;
}
