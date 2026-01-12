/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('posters').del()
  await knex('posters').insert([
    {
      image: '/posters/plastic-double-1.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: '/posters/plastic-double-2.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: '/posters/plastic-double-3.jpg',
      designer: 'Sofia Mary Wednesday Tarn',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: '/posters/plastic-double-4.png',
      designer: 'Cassie Tenebaum',
      archive_show_id: 1,
      upcoming_show_id: 1,
    },
    {
      image: '/posters/lezfest.png',
      designer: 'Cassie Tenebaum, Sofia Mary Wednesday Tarn',
      archive_show_id: 1,
      upcoming_show_id: 2,
    },
    {
      image: '/posters/valhallaJuly10th.jpg',
      designer: 'Sofia Mary Wednesday Tarn',
      archive_show_id: 1,
      upcoming_show_id: 3,
    },
    {
      image: '/posters/airplaneposter.jpg',
      designer: 'Frankass',
      archive_show_id: 1,
      upcoming_show_id: 3,
    },
  ])
}
