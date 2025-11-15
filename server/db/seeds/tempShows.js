/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('shows_posters').del()
  await knex('shows').del()
  await knex('posters').del()

  // Data from the original seed file
  const showData = {
    date: 'October 19th 2024',
    location: 'Secret Location',
    performers:
      'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Jed Hayes, Scramble204, Angel Food',
  }

  const postersData = [
    { image: 'plastic-double-1.png', designer: 'Cassie Tenebaum' },
    { image: 'plastic-double-2.png', designer: 'Cassie Tenebaum' },
    {
      image: 'plastic-double-3.jpg',
      designer: 'Sofia Mary Wednesday Tarn',
    },
    { image: 'plastic-double-4.png', designer: 'Cassie Tenebaum' },
  ]

  // 1. Insert the show and get its ID
  const [showIdObj] = await knex('shows').insert(showData).returning('id')
  const showId = showIdObj.id

  // 2. Loop through posters, insert them, and link to the show
  for (const poster of postersData) {
    const [posterIdObj] = await knex('posters').insert(poster).returning('id')
    const posterId = posterIdObj.id

    await knex('shows_posters').insert({
      show_id: showId,
      poster_id: posterId,
    })
  }
}