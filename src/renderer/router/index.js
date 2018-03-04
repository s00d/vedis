import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/db',
      name: 'db-page',
      component: require('@/components/IndexPage').default
    },
    {
      path: '/connection1',
      name: 'connection-page',
      component: require('@/components/ConnectionPage').default
    },
    {
      path: '*',
      redirect: '/db'
    }
  ]
})
