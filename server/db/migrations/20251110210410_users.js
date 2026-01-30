/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('authId').primary()
    table.string('username').unique()
    table.string('bio')
    table.string('status')
    table.string('email')
    table.boolean('admin').nullable()
    table.string('profile_picture').nullable()
    table.integer('blebs_found').defaultTo(0)
    table.string('profile_color_one').defaultTo('#d9d7c0d6')
    table.string('profile_color_two').defaultTo('#e9e6d6ac')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('users')
}
