// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import GenerateTicket from './components/GenerateTicket.vue'
import TransferTicket from './components/TransferTicket.vue'

const routes = [
    { path: '/', component: GenerateTicket },
    { path: '/transfer-ticket', component: TransferTicket },
    { path: '/generate-ticket', component: GenerateTicket },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
