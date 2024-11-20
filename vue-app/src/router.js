// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import GenerateTicket from './components/GenerateTicket.vue'
import TransferTicket from './components/TransferTicket.vue'

const routes = [
    { path: '/', component: GenerateTicket },
    { path: '/generate-ticket', component: GenerateTicket },
    { path: '/transfer-ticket', component: TransferTicket },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
