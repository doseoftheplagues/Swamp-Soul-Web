// @vitest-environment jsdom/vitest
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, it, expect, vi } from 'vitest'
import nock from 'nock'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserExists } from '../hooks/useUserExists'
import { useNavigate, MemoryRouter } from 'react-router' // Import MemoryRouter
import App from '../components/App' // Import App component
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Import QueryClient and QueryClientProvider

vi.mock('@auth0/auth0-react')
vi.mock('../hooks/useUserExists')
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock useNavigate
  }
})

beforeAll(() => {
  nock.disableNetConnect()
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

describe('App component', () => {
  it('redirects to /register if authenticated but no user profile exists', async () => {
    // Mock the useNavigate hook
    const navigateMock = vi.fn()
    ;(useNavigate as vi.Mock).mockReturnValue(navigateMock)

    // Mock the useAuth0 hook
    const useAuth0Mock = useAuth0 as vi.Mock
    useAuth0Mock.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|12345' },
      getAccessTokenSilently: vi.fn().mockResolvedValue('fake-token'),
    })

    // Mock the useUserExists hook to immediately return the desired state
    const useUserExistsMock = useUserExists as vi.Mock
    useUserExistsMock.mockReturnValue({
      exists: false,
      isLoading: false,
    })

    // Render the App component within a MemoryRouter and QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    // Assert that the redirect happens
    expect(navigateMock).toHaveBeenCalledWith('/register')
  })
})
