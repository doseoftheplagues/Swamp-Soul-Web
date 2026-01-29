/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('upcoming_shows', (table) => {
    table.increments('id')
    table.string('date')
    table.string('doors_time')
    table.string('price')
    table.string('performers')
    table.string('location_name')
    table.boolean('wheelchair_accessible')
    table.boolean('mobility_accessible')
    table.boolean('bathrooms_nearby')
    table.string('noise_level')
    table.string('user_id').references('users.authId')
    table.string('location_coords').nullable()
    table.string('set_times').nullable()
    table.string('tickets_link').nullable()
    table.string('description').nullable()
    table.integer('max_capacity').nullable()
    table.boolean('canceled').nullable()
    table.string('name').nullable()
    table.string('city').nullable()
    table.boolean('underage_allowed').nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('upcoming_shows')
}
