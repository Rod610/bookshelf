/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
import * as auth from 'auth-provider'
import {FullPageSpinner} from './components/lib'
import * as colors from './styles/colors'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function App() {
  // 🐨 useState for the user
  //const [user, setUser] = React.useState(null)

  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  // 🐨 create a login function that calls auth.login then sets the user
  // 💰 const login = form => auth.login(form).then(u => setUser(u))

  // React.useEffect(() => {
  //   getUser().then(u => setUser(u))
  // }, [])
  React.useEffect(() => {
    run(getUser())
  }, [run])

  // const login = form => auth.login(form).then(u => setUser(u))
  const login = form => auth.login(form).then(u => setData(u))

  // 🐨 create a registration function that does the same as login except for register

  // const register = form => auth.register(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setData(u))
  // 🐨 create a logout function that calls auth.logout() and sets the user to null
  const logout = () => {
    auth.logout()
    //setUser(null)
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  // 🐨 if there's a user, then render the AuthenticatedApp with the user and logout

  // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register

  if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
