/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('comments').del()
  await knex('comments').insert([
    {
      upcoming_show_id: 1,
      content: 'meow!! this is gonna be great',
    },
    {
      upcoming_show_id: 1,
    },
  ])
}

// table.increments('id')
// table.string('user_id').references('users.authId')
// table.integer('upcoming_show_id').references('upcoming_shows.id').nullable()
// table.integer('archive_show_id').references('shows.id').nullable()
