/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('table_name').del()
  await knex('table_name').insert([
    { image: 'plastic-double-1.png', designer: 'Cassie Tenebaum' },
    { image: 'plastic-double-2.png', designer: 'Cassie Tenebaum' },
    {
      image: 'plastic-double-3.jpg',
      designer: 'Sofia Mary Wednesday Tarn',
    },
    { image: 'plastic-double-4.png', designer: 'Cassie Tenebaum' },
  ])
}
