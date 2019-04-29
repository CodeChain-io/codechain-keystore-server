import * as storage from "codechain-keystore/lib/logic/storage";
import { KeyType as KeyTypeId } from "codechain-keystore/lib/model/keytypes";
import {
    generatePrivateKey,
    getAccountIdFromPublic,
    getPublicFromPrivate,
    signEcdsa
} from "codechain-primitives";
import * as express from "express";
import KeyModel from "../models/key";

type KeyType = "asset" | "platform";

function findKey(
    type: KeyType,
    address: string
): Promise<KeyModel | undefined> {
    return KeyModel.query().findById([type, address]) as any;
}

export function createRouter() {
    const router = express.Router();

    router.get("/keys", async (req, res) => {
        const keyType: KeyType = req.body.keyType;
        res.json({
            success: true,
            result: await KeyModel.query().where({ type: keyType })
        });
    });

    router.get("/keys/:key/publicKey", async (req, res) => {
        const { key } = req.params;
        const keyType: KeyType = req.body.keyType;

        const row = await findKey(keyType, key);
        if (row == null) {
            res.json({
                success: false,
                error: "Not found"
            });
        } else {
            const priv = await storage.decode(row.toJSON(), "");
            const pub = getPublicFromPrivate(priv);
            res.json({
                success: true,
                result: pub
            });
        }
    });

    router.get("/keys/:key/rawKey", async (req, res) => {
        const { key } = req.params;
        const { passphrase } = req.body;
        const keyType: KeyType = req.body.keyType;

        const row = await findKey(keyType, key);
        if (row == null) {
            res.json({
                success: false,
                error: "Not found"
            });
        } else {
            try {
                const priv = await storage.decode(row.toJSON(), passphrase);
                res.json({
                    success: true,
                    result: priv
                });
            } catch (e) {
                res.json({
                    success: false,
                    error: "Invalid passphrase"
                });
            }
        }
    });

    router.post("/keys", async (req, res) => {
        const { passphrase } = req.body;
        const keyType: KeyType = req.body.keyType;

        while (true) {
            const priv = generatePrivateKey();
            const pub = getPublicFromPrivate(priv);
            const address = getAccountIdFromPublic(pub);

            // Check duplication
            if ((await findKey(keyType, address)) != null) {
                continue;
            }

            let typeId: KeyTypeId | undefined;
            switch (keyType) {
                case "asset": {
                    typeId = KeyTypeId.Asset;
                    break;
                }
                case "platform": {
                    typeId = KeyTypeId.Platform;
                    break;
                }
            }

            const secret = await storage.encode(
                priv,
                typeId!,
                passphrase,
                JSON.stringify({})
            );
            await KeyModel.query().insert({
                type: keyType,
                address: secret.address,
                version: secret.version,

                kdf: secret.crypto.kdf,
                kdfparams: secret.crypto.kdfparams,
                mac: secret.crypto.mac,

                cipher: secret.crypto.cipher,
                cipherparams: secret.crypto.cipherparams,
                ciphertext: secret.crypto.ciphertext,

                meta: secret.meta
            });

            res.json({
                success: true,
                result: secret.address
            });
            return;
        }
    });

    router.delete("/keys/:key", async (req, res) => {
        const { key } = req.params;
        const keyType: KeyType = req.body.keyType;

        const row = await findKey(keyType, key);

        if (row == null) {
            res.json({
                success: false,
                error: "Not found"
            });
        } else {
            try {
                // Check if the passphrase is correct
                await storage.decode(row.toJSON(), "");
                await KeyModel.query()
                    .del()
                    .findById([keyType, key]);
                res.json({
                    success: true,
                    result: true
                });
            } catch (e) {
                res.json({
                    success: true,
                    result: false
                });
            }
        }
    });

    router.post("/keys/:key/sign", async (req, res) => {
        const { key } = req.params;
        const { message, passphrase = "" } = req.body;
        const keyType: KeyType = req.body.keyType;

        const row = await findKey(keyType, key);

        if (row == null) {
            res.json({
                success: false,
                error: "Not found"
            });
        } else {
            try {
                const priv = await storage.decode(row.toJSON(), passphrase);
                res.json({
                    success: true,
                    result: signEcdsa(message, priv)
                });
            } catch (e) {
                res.json({
                    success: false,
                    error: e
                });
            }
        }
    });

    return router;
}
