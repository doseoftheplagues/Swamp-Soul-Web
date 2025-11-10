export function up(knex) {
  return knex.schema.createTable('shows_posters', (table) => {
    table.increments('id')
    table.integer('poster_id').references('posters.id').onDelete('CASCADE')
    table.integer('show_id').references('shows.id').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('shows_posters')
}
