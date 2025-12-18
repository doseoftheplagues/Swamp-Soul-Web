import { beforeEach, expect } from 'vitest'
import { cleanup, render } from '@testing-library/react/pure'
import '@testing-library/jest-dom/vitest'

import routes from '../routes.tsx'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as matchers from '@testing-library/jest-dom/matchers'
import userEvent from '@testing-library/user-event'

beforeEach(cleanup)
expect.extend(matchers)

export function setupApp(route = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
  })

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  })

  const screen = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  const user = userEvent.setup()
  return { user, ...screen }
}
