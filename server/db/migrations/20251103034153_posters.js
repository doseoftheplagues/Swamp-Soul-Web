/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('posters', (table) => {
    table.increments('id')
    table.integer('archive_show_id').references('shows.id').nullable
    table.integer('upcoming_show_id').references('upcoming_shows.id').nullable
    table.string('image')
    table.string('designer')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('posters')
}
