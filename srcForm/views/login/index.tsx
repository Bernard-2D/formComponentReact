import { login } from '@/api/user'
import useSystemStore from '@/store/system'
import useTokenStore from '@/store/token'
import { useLocation, useNavigate } from '@tanstack/react-router'
import LoginPage, { Props } from './page'

function Login() {
  const navigate = useNavigate()
  const { systemInfo } = useSystemStore()
  const { setToken } = useTokenStore()
  const { search } = useLocation()

  const onLogin: Props['onLogin'] = values => {
    const { password, username } = values

    login(username, password).then(d => {
      setToken(d.data as string)
      navigate({
        to: '/',
        search
      })
    })
  }

  return <LoginPage systemInfo={systemInfo} onLogin={onLogin} />
}

export default Login
