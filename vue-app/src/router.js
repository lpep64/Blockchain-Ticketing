// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import GenerateTicket from './components/GenerateTicket.vue'
import TransferTicket from './components/TransferTicket.vue'

const routes = [
    { path: '/', component: GenerateTicket },
    { path: '/generate-ticket', component: GenerateTicket },
    { path: '/transfer-ticket', component: TransferTicket },
=======

import home from './components/Index.vue'
import Events from './components/Events.vue'
import Wallet from './components/Wallet.vue'

const routes = [
    { path: '/', component: home},
    { path: '/events', component: Events },
    { path: '/wallet', component: Wallet },

>>>>>>> frontend-2.0
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
