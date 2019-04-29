const table = "keys";

exports.up = async (knex) => {
    const hasTable = await knex.schema.hasTable(table);
    if (!hasTable) {
        return knex.schema.createTable(table, (t) => {
            t.string("type").notNullable();
            t.string("address").notNullable();
            t.integer("version").notNullable();
            t.string("kdf").notNullable();
            t.json("kdfparams");
            t.string("mac").notNullable();
            t.string("cipher").notNullable();
            t.json("cipherparams");
            t.string("ciphertext").notNullable();
            t.json("meta");

            t.primary(["type", "address"]);
        });
    }
    else {
        // TODO: Add detailed error message
        throw Error();
    }
};

exports.down = async (knex) => {
    const hasTable = await knex.schema.hasTable(table);
    if (hasTable) {
        return knex.schema.dropTable(table);
    }
    else {
        // TODO: Add detailed error message
        throw Error();
    }
};
