import { useAuth0 } from '@auth0/auth0-react'

export default function LogoutButton() {
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return (
    <button className="cursor-pointer" onClick={handleLogout}>
      Log Out
    </button>
  )
}
