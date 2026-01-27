// @vitest-environment jsdom/vitest
import { setupApp } from './setup.tsx'
import { beforeAll, describe, it, expect } from 'vitest'
import nock from 'nock'

beforeAll(() => {
  nock.disableNetConnect()
})

describe('Upcoming shows page', () => {
  it('Displays the shows ', async () => {
    const scope = nock('http://localhost')
      .get('/api/v1/upcomingshows')
      .reply(200, {
        upcomingShows: [
          {
            id: 1,
            date: '2028-12-14',
            doors_time: '7:00 PM',
            price: 'koha',
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
            date: '2028-01-20',
            doors_time: '8:30 PM',
            price: '10$',
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
        ],
      })
    const screen = setupApp('/upcomingshows')
    const showOne = await screen.findByText('The Velvet Swamps, Crooked Halo')
    const showTwo = await screen.findByText('Moth Temple, The Hounds of Dawn')
    expect(showOne).toBeVisible()
    expect(showTwo).toBeVisible()
    expect(scope.isDone()).toBe(true)
  })

  it('displays a cancelled banner if a shows data indicates it is canceled', async () => {
    const scope = nock('http://localhost')
      .get('/api/v1/upcomingshows')
      .reply(200, {
        upcomingShows: [
          {
            id: 1,
            date: '2025-12-14',
            doors_time: '7:00 PM',
            price: 'koha',
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
            canceled: true,
          },
        ],
      })
    const screen = setupApp('/upcomingshows')
    const cancelledShow = await screen.findByText(
      'This show has been cancelled',
    )
    expect(cancelledShow).toBeVisible()
    expect(scope.isDone()).toBe(true)
  })
})
