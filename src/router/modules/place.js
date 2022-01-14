import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/place',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '渠道首页' },
      component: () => import('@/views/place/index')
    }
  ])('place-')
}
