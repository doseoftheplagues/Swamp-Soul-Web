/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('comments').del()
  await knex('comments').insert([
    {
      id: 3,
      upcoming_show_id: 1,
      content: 'meow!! this is gonna be great',
      user_id: 'seedUser1',
    },
    {
      id: 2,
      upcoming_show_id: 1,
      content: 'woeee',
      user_id: 'seedUser3',
    },
    {
      id: 4,
      upcoming_show_id: 1,
      content: 'love',
      user_id: 'seedUser2',
    },
  ])
  await knex('comments').insert([
    {
      id: 5,
      parent: 4,
      upcoming_show_id: 1,
      content: 'me too seed user 2',
      user_id: 'seedUser1',
    },
    {
      id: 6,
      parent: 5,
      upcoming_show_id: 1,
      content: 'im replying to both of you in the chain wow',
      user_id: 'seedUser3',
    },
  ])
}
