/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      authId: 'seedUser1',
      username: 'seed user 1',
      bio: 'i love swamp soul',
      status: 'noise',
      profile_picture: '/assets/default.jpeg',
    },
    {
      authId: 'seedUser2',
      username: 'seed user 2',
      bio: 'i love swamp soul even more',
      status: 'pop',
      profile_picture: '/assets/default.jpeg',
    },
    {
      authId: 'seedUser3',
      username: 'seed user 3',
      bio: 'i love swamp soul even more than anyone ever even more than myselffe',
      status: 'love',
      profile_picture: '/assets/default.jpeg',
    },
  ])
}
