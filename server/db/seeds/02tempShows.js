/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('shows').del()
  await knex('shows').insert({
    id: 1,
    date: 'October 19th 2024',
    location: 'Secret Location',
    performers:
      'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Jed Hayes, Scramble204, Angel Food',
  })
}
