const Home = () => import('@/views/Home')
const Receive = () => import('@/views/Receive')
const Connect = () => import('@/views/Connect')

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/receive',
    name: 'Receive',
    component: Receive
  },
  {
    path: '/connect',
    name: 'Connect',
    component: Connect
  }
]
