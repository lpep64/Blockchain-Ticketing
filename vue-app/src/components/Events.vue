<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

const sports = ref(['Basketball', 'Football', 'Hockey', 'Soccer'])
const selectedSport = ref('all')
const events = ref([
    { id: 1, title: "UConn vs. Villanova", date: "Feb 20, 2025", time: "7:00 PM", location: "Gampel Pavilion", sport: "Basketball", ticketLink: "/buy-tickets/villanova" },
    { id: 2, title: "UConn vs. Duke", date: "Feb 22, 2025", time: "3:00 PM", location: "Pratt & Whitney Stadium", sport: "Football", ticketLink: "/buy-tickets/duke" },
    { id: 3, title: "UConn Hockey vs. Boston College", date: "Feb 25, 2025", time: "8:00 PM", location: "Toscano Family Ice Forum", sport: "Hockey", ticketLink: "/buy-tickets/hockey-bc" },
    // Add more events as needed
])

const filteredEvents = computed(() => {
    if (selectedSport.value === 'all') {
        return events.value
    }
    return events.value.filter(event => event.sport === selectedSport.value)
})

const addEvent = (event) => {
    events.value.push(event)
}

</script>

<template>
    <div id="app">
        <Header />
        <main>
            <h1>Events</h1>
            <img src="@/assets/other/events.jpg" alt="UConn Events" class="Img" />
            <div class="container">
                <div class="left-box">
                    <h2>Sports</h2>
                    <ul>
                        <li v-for="sport in sports" :key="sport" @click="selectedSport = sport">
                            {{ sport }}
                            <div v-if="selectedSport === sport" class="dropdown">
                                <input type="text" placeholder="Event Details" v-model="eventDetails" />
                                <button @click="addEvent({ sport, details: eventDetails })">Add</button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="right-box">
                    <h2>Upcoming Events</h2>
                    <ul class="events-list">
                        <li v-for="event in filteredEvents" :key="event.id" class="event-card">
                            <div class="event-details">
                                <h2>{{ event.title }}</h2>
                                <p>{{ event.date }} | {{ event.time }} | {{ event.location }}</p>
                                <a :href="event.ticketLink" class="ticket-button">Buy Tickets</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    background-color: #FFFFFF;
    text-align: center;
    margin: 0;
}

h1 {
    margin-bottom: 1rem;
    color: #0C2340;
    font-size: 1.5rem;
}

.container {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 150rem;
    margin: 0 auto;
}

.left-box, .right-box {
    color: black;
    width: 45%;
    border: 10px solid #0C2340;
    border-radius: 1rem;
    background-color: lightgrey;
    box-sizing: border-box;
}

.left-box {
    margin-right: 1rem;
}

.right-box {
    margin-left: 1rem;
}

.left-box ul, .right-box ul {
    list-style: none;
    padding: 0;
}

.left-box li {
    cursor: pointer;
    margin-bottom: 1rem;
}

.dropdown {
    margin-top: 0.5rem;
}

.events-list {
    max-height: 200px;
    overflow-y: auto;
}

.Img {
    width: 80%;
    max-width: 100rem;
    height: auto; 
    margin: 0.5rem;
}

.event-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.event-card:hover {
    transform: translateY(-5px);
}

.event-details {
    padding: 15px;
    text-align: center;
}

.event-details h2 {
    font-size: 1.25rem;
    font-weight: bold;
}

.event-details p {
    margin-top: 5px;
    color: #555;
}

.ticket-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #0C2340;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
}

.ticket-button:hover {
    background-color: red;
}
</style>