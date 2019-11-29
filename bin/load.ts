import * as config from "config";
import * as knex from "knex";
import { Model, transaction } from "objection";
import * as path from "path";

import KeyModel from "../src/models/key";

Model.knex(knex(config.get("knex")));

const USAGE = "Usage: ts-node load.ts DB_PATH";

async function main() {
    const tx = await transaction.start(Model.knex());
    try {
        const args = process.argv.slice(2);
        if (args.length !== 1) {
            console.log("Database path is not provided!");
            console.log(USAGE);
            process.exit(1);
        }

        const dbPath = path.join(__dirname, "..", args[0]);
        const keystore = require(dbPath);

        for (const addr of keystore.platform) {
            const row = await KeyModel.query().findById([
                "platform",
                addr.address
            ]);
            if (row != null) {
                throw new Error(`Platform key ${addr.address} already exists!`);
            }
            await KeyModel.query(tx).insert({
                type: "platform",
                address: addr.address,
                version: addr.version,

                kdf: addr.crypto.kdf,
                kdfparams: addr.crypto.kdfparams,
                mac: addr.crypto.mac,

                cipher: addr.crypto.cipher,
                cipherparams: addr.crypto.cipherparams,
                ciphertext: addr.crypto.ciphertext,

                meta: addr.meta
            });
        }

        for (const addr of keystore.asset) {
            const row = await KeyModel.query().findById([
                "asset",
                addr.address
            ]);
            if (row != null) {
                throw new Error(`Asset key ${addr.address} already exists!`);
            }
            await KeyModel.query(tx).insert({
                type: "asset",
                address: addr.address,
                version: addr.version,

                kdf: addr.crypto.kdf,
                kdfparams: addr.crypto.kdfparams,
                mac: addr.crypto.mac,

                cipher: addr.crypto.cipher,
                cipherparams: addr.crypto.cipherparams,
                ciphertext: addr.crypto.ciphertext,

                meta: addr.meta
            });
        }
        await tx.commit();
    } catch (e) {
        console.error(`Unexpected error found!: ${e}`);
        await tx.rollback();
    }
    process.exit(0);
}

main().catch(console.error);
