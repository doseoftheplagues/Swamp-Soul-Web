/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id')
    table.string('user_id').references('users.authId')
    table.integer('upcoming_show_id').references('upcoming_shows.id').nullable()
    table.integer('archive_show_id').references('shows.id').nullable()
    table.timestamp('date_added').notNullable().defaultTo(knex.fn.now())
    table.string('content')
    table
      .integer('parent')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('comments')
}
