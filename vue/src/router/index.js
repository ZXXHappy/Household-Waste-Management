import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    { path: '/', redirect: '/login' },
    {
      path: '/front',
      component: () => import('@/views/Front.vue'),
      children: [
        { path: 'home', component: () => import('@/views/front/Home.vue'),  },
        { path: 'person', component: () => import('@/views/front/Person.vue'),  },
        { path: 'popularizeDetail', component: () => import('@/views/front/PopularizeDetail.vue'),  },
        { path: 'community', component: () => import('@/views/front/Community.vue'),  },
        { path: 'recoverySite', component: () => import('@/views/front/RecoverySite.vue'),  },
        { path: 'recoverySiteDetail', component: () => import('@/views/front/RecoverySiteDetail.vue'),  },
        { path: 'myGarbageLaunch', component: () => import('@/views/front/MyGarbageLaunch.vue'),  },
        { path: 'notice', component: () => import('@/views/front/Notice.vue'),  },
        { path: 'scoreGoods', component: () => import('@/views/front/ScoreGoods.vue'),  },
        { path: 'password', component: () => import('@/views/front/Password.vue'),  },
        { path: 'myScoreExchange', component: () => import('@/views/front/MyScoreExchange.vue'),  },
        { path: 'myRecoveryRecords', component: () => import('@/views/front/MyRecoveryRecords.vue'),  },
        { path: 'feedback', component: () => import('@/views/front/Feedback.vue'),  },
        { path: 'myFeedback', component: () => import('@/views/front/MyFeedback.vue'),  },
      ]
    },
    { path: '/login', component: () => import('@/views/Login.vue') },
    { path: '/register', component: () => import('@/views/Register.vue') },
    { path: '/404', component: () => import('@/views/404.vue') },
    { path: '/:pathMatch(.*)', redirect: '/404' }
  ]
})

export default router