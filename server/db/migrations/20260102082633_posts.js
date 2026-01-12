/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id')
    table.string('user_id').references('users.authId')
    table.string('content')
    table.string('title').nullable()
    table.string('image').nullable()
    table.timestamp('date_added').notNullable().defaultTo(knex.fn.now())
    table.string('title_font').nullable()
    table.string('title_size').nullable()
    table.string('content_font').nullable()
    table.string('content_size').nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('posts')
}
