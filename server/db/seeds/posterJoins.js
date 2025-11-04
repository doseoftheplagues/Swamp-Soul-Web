/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('postersJoin').del()

  const show = await await knex('postersJoin').insert([])
}
