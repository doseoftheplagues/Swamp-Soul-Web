/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('upcoming_shows').del()
  await knex('upcoming_shows').insert([
    {
      id: 1,
      date: '2026-10-19',
      doors_time: '6:00 PM',
      price: '$10',
      performers:
        'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Scramble204, Jed Hayes, Angel Food',
      location_name: 'Secret Location',
      wheelchair_accessible: false,
      mobility_accessible: true,
      bathrooms_nearby: true,
      noise_level: 'high',
      location_coords: '-36.8575,174.7621',
      set_times:
        '6:30 - Scramble204, 7:15 - Jed Hayes, 8:00 - Angel Food, 8:45 - Cook ie Cutt er, 9:45 - Elizabeth Sanctuary (welding school for Girls)',
      tickets_link: 'fakeLink.bleh',
      description:
        'Location will be updated on the day of the event. Sick shit really awesome. Long description of awesome bands.',
      name: 'Plastic Double Album Release Show',
      max_capacity: 70,
      canceled: false,
      city: null,
    },
    {
      id: 2,
      date: '2026-5-10',
      doors_time: '7:00 PM',
      price: 'Free',
      performers: 'True Mets, Cotar, Carries Fish, Cook ie Cutt er',
      location_name: '16 Stoke Street',
      wheelchair_accessible: false,
      mobility_accessible: true,
      bathrooms_nearby: true,
      noise_level: 'loud',
      location_coords: '-36.8575,174.7621',
      set_times:
        '7:30 - Cotar, 8:15 - Carries Fish, 9:00 - Cook ie Cutt er, 10:00 - True Mets',
      tickets_link: null,
      description: 'Birthday gig with 500 people who nobody knows and who suck',
      max_capacity: null,
      canceled: false,
      name: 'LezFest',
      city: null,
    },
    {
      id: 3,
      date: '2026-07-10',
      doors_time: '6:00 PM',
      price: '15$',
      performers:
        'Silicon Tongue, Spiral, Wallflower, ESWSG, Ag. Studio, Cleo Mace',
      location_name: 'Valhalla',
      wheelchair_accessible: true,
      mobility_accessible: true,
      bathrooms_nearby: true,
      noise_level: 'loud',
      location_coords: null,
      set_times: 'Its a suprise',
      tickets_link: 'https://tickets.bluhhh.com/event/july10',
      description:
        'Ten million bands nois popfest etc seed data seed data seed data seed data seed data seed data seed data seed data seed data seed data seed data',
      max_capacity: 120,
      canceled: false,
      city: null,
    },
  ])
}
