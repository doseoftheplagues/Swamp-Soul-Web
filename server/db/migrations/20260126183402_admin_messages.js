1 /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('admin_messages', (table) => {
    table.increments('id').primary()
    table.string('admin_id')
    table.string('user_id')
    table.string('content_deleted')
    table.string('reason_deleted')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('admin_messages')
}
