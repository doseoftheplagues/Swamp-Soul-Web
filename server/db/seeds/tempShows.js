import { addShowWithMultiplePosters } from '../shows.ts'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('shows_posters').del()
  await knex('shows').del()
  await addShowWithMultiplePosters(
    {
      date: 'October 19th 2024',
      location: 'Secret Location',
      performers:
        'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Jed Hayes, Scramble204, Angel Food',
    },
    [
      { image: 'plastic-double-1.png', designer: 'Cassie Tenebaum' },
      { image: 'plastic-double-2.png', designer: 'Cassie Tenebaum' },
      {
        image: 'plastic-double-3.jpg',
        designer: 'Sofia Mary Wednesday Tarn',
      },
      { image: 'plastic-double-4.png', designer: 'Cassie Tenebaum' },
    ],
  )
}
