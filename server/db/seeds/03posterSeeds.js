/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('posters').del()
  await knex('posters').insert([
    {
      image: 'plastic-double-1.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: 'plastic-double-2.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: 'plastic-double-3.jpg',
      designer: 'Sofia Mary Wednesday Tarn',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: 'plastic-double-4.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
  ])
}
