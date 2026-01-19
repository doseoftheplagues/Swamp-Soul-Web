/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('links', (table) => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.string('link').notNullable()
    table.string('user_id').references('authId').inTable('users').onDelete('CASCADE')
    table.integer('upcoming_show_id').references('id').inTable('upcoming_shows').onDelete('CASCADE').nullable()
    table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE').nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('links')
}