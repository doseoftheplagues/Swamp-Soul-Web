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
      date: '2025-12-14',
      doors_time: '7:00 PM',
      performers: 'The Velvet Swamps, Crooked Halo',
      location_name: 'Whammy Bar',
      wheelchair_accessible: true,
      mobility_accessible: true,
      bathrooms_nearby: true,
      noise_level: 'high',
      location_coords: null,
      set_times: null,
      tickets_link: null,
      poster_id: null,
      description: null,
      max_capacity: null,
      canceled: null,
    },
    {
      id: 2,
      date: '2026-01-20',
      doors_time: '8:30 PM',
      performers: 'Moth Temple, The Hounds of Dawn',
      location_name: 'Neck of the Woods',
      wheelchair_accessible: false,
      mobility_accessible: false,
      bathrooms_nearby: true,
      noise_level: 'medium',
      location_coords: null,
      set_times: null,
      tickets_link: null,
      poster_id: null,
      description: null,
      max_capacity: null,
      canceled: null,
    },
    {
      id: 3,
      date: '2026-02-15',
      doors_time: '6:30 PM',
      performers: 'Glass Mirage, Echo Valley',
      location_name: 'The Wine Cellar',
      wheelchair_accessible: true,
      mobility_accessible: true,
      bathrooms_nearby: true,
      noise_level: 'low',
      location_coords: '-36.8575,174.7621',
      set_times: '7:00 PM - Glass Mirage, 8:30 PM - Echo Valley',
      tickets_link: 'https://tickets.glassmirage.com/event/feb15',
      poster_id: null,
      description:
        'An intimate evening of ambient dream pop and experimental folk in the heart of Karangahape Road.',
      max_capacity: 80,
      canceled: false,
    },
  ])
}
