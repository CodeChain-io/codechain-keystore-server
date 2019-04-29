const table = "keys";

exports.seed = async (knex) => {
    await knex(table).del();
    return knex(table).insert([]);
};
