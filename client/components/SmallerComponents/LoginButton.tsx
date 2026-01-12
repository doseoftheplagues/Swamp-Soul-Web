import { useAuth0 } from '@auth0/auth0-react'

interface loginButtonProps {
  classes: string
}

function LoginButton({ classes }: loginButtonProps) {
  const { loginWithRedirect } = useAuth0()
  const handleSignIn = () => {
    const redirectUri = `${window.location.origin}/register`
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: redirectUri,
        prompt: 'login',
      },
    })
  }
  return (
    <button onClick={handleSignIn} className={`${classes} cursor-pointer`}>
      Log In
    </button>
  )
}

export default LoginButton
