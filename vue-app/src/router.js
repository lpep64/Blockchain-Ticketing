// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import home from './components/Index.vue'

//Old HTMLS
import GenerateTicket from './components/GenerateTicket.vue'
import TransferTicket from './components/TransferTicket.vue'

//Additions
import WalletPage from '@/components/WalletPage.vue';
import EventsPage from '@/components/EventsPage.vue';

const routes = [
    { path: '/', component: home},
    { path: '/generate-ticket', component: GenerateTicket },
    { path: '/transfer-ticket', component: TransferTicket },

    //Additions
    { path: '/wallet', component: WalletPage },
    { path: '/events', component: EventsPage },

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
