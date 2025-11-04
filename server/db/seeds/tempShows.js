/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('shows').del()
  await knex('shows').insert([
    {
      date: 'October 19th 2024',
      location: 'Secret Location',
      performers:
        'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Jed Hayes, Scramble204, Angel Food',
      posterId: '1',
    },
    {
      date: 'June 1st 2025',
      location: "Someone's flat",
      performers: 'Co-tar, Carries Fish, Cook ie Cutt er, True Mets',
      posterId: '2',
    },
    {
      date: 'July 10th 2025',
      location: 'Valhalla',
      performers:
        'Silicon Tongue, Wallflower, Spiral, A.G Studio, Cleo Mace, Elizabeth Sanctuary (welding school for Girls)',
      posterId: '3',
    },
  ])
}
