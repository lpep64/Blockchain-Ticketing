// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

import home from './components/Index.vue'
import Events from './components/Events.vue'
import Wallet from './components/Wallet.vue'

const routes = [
    { path: '/', component: home},
    { path: '/transfer-events', component: Events },
    { path: '/transfer-wallet', component: Wallet },

    { path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('./components/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
