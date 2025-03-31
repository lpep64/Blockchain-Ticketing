// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

import home from './components/Index.vue'
import Events from './components/Events.vue'
import Wallet from './components/Wallet.vue'
import Verify from './components/Verify.vue'

const routes = [
    { path: '/', component: home},
    { path: '/events', component: Events },
    { path: '/wallet', component: Wallet },
    { path: '/verify', component: Verify },
    { path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('./components/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Always scroll to the top of the page on route change
        return { top: 0, behavior: 'auto' }
    }
})

export default router
