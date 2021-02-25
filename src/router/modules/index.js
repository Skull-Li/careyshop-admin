import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: [
    // 首页 必须 name:index
    {
      path: 'index',
      name: 'index',
      meta: { title: '首页', cache: true, auth: true },
      component: () => import('@/views/index/index')
    },
    {
      path: '401',
      name: 'page401',
      meta: { title: '权限不足', auth: true },
      component: () => import('@/views/public/401')
    },
    {
      path: '50*',
      name: 'page500',
      meta: { title: '异常错误' },
      component: () => import('@/views/public/50x')
    },
    {
      path: 'report/:is_load',
      name: 'report',
      props: true,
      meta: { title: '构建分析' },
      component: () => import('@/views/public/report')
    },
    // 系统 前端日志
    {
      path: 'log',
      name: 'log',
      meta: { ...meta, cache: true, title: '调试日志' },
      component: () => import('@/views/public/log')
    },
    // 刷新页面 必须保留
    {
      path: 'refresh',
      name: 'refresh',
      hidden: true,
      component: {
        beforeRouteEnter(to, from, next) {
          from.meta[`__stamp-${from.path}`] = Date.now()
          next(instance => instance.$router.replace({ path: from.fullPath, meta: from.meta }))
        },
        render: h => h()
      }
    },
    // 页面重定向 必须保留
    {
      path: 'redirect/:route*',
      name: 'redirect',
      hidden: true,
      component: {
        beforeRouteEnter(to, from, next) {
          next(instance => instance.$router.replace(JSON.parse(from.params.route)))
        },
        render: h => h()
      }
    }
  ]
}
