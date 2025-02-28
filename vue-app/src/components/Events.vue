<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const formatDate = (datetime) => {
    const date = new Date(datetime);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Use 12-hour clock (AM/PM)
    };
    return date.toLocaleString('en-US', options);
}



const router = useRouter()

const sports = ref([
    'Basketball', 'Football', 'Hockey', 'Soccer', 'Other'
])

const allsports = ref([
    'Men\'s Basketball', 'Women\'s Basketball', 'Football', 'Men\'s Hockey', 'Women\'s Hockey', 'Men\'s Soccer', 'Women\'s Soccer', 'Other'
])

const selectedSports = ref([]) // Allow multiple selections
const events = ref([
    { id: 1, title: "UConn vs. Villanova", date: "2025-02-20T19:00", location: "Gampel Pavilion", sport: "Men's Basketball", ticketLink: "/buy-tickets/villanova", ticketsOpen: "2025-02-01T10:00" },
    { id: 2, title: "UConn vs. Duke", date: "2025-02-22T15:00", location: "Pratt & Whitney Stadium", sport: "Football", ticketLink: "/buy-tickets/duke", ticketsOpen: "2025-02-02T10:00" },
    { id: 3, title: "UConn vs. Boston College", date: "2025-02-25T20:00", location: "Toscano Family Ice Forum", sport: "Women's Hockey", ticketLink: "/buy-tickets/hockey-bc", ticketsOpen: "2025-02-03T10:00" },
    { id: 4, title: "UConn vs. Syracuse", date: "2025-02-27T19:00", location: "Gampel Pavilion", sport: "Women's Basketball", ticketLink: "/buy-tickets/syracuse", ticketsOpen: "2025-02-04T10:00" },
    { id: 5, title: "UConn vs. Alabama", date: "2025-03-01T15:00", location: "Pratt & Whitney Stadium", sport: "Football", ticketLink: "/buy-tickets/alabama", ticketsOpen: "2025-02-05T10:00" },
    { id: 6, title: "UConn vs. Providence", date: "2025-03-04T20:00", location: "Toscano Family Ice Forum", sport: "Men's Hockey", ticketLink: "/buy-tickets/hockey-providence", ticketsOpen: "2025-02-06T10:00" },
    { id: 7, title: "UConn vs. Boston College", date: "2025-03-06T19:00", location: "Morrone Stadium", sport: "Men's Soccer", ticketLink: "/buy-tickets/soccer-bc", ticketsOpen: "2025-02-07T10:00" },
    { id: 8, title: "UConn Celebration", date: "2025-03-08T18:00", location: "Gampel Pavilion", sport: "Other", ticketLink: "/buy-tickets/celebration", ticketsOpen: "2025-02-08T10:00" }
])

const filteredEvents = computed(() => {
    const sortedEvents = [...events.value].sort((a, b) => new Date(a.ticketsOpen) - new Date(b.ticketsOpen))
    if (selectedSports.value.length === 0) {
        return sortedEvents // Show all if none are selected
    }
    return sortedEvents.filter(event => {
        return selectedSports.value.some(sport => event.sport.includes(sport))
    })
})

const toggleSport = (sport) => {
    if (selectedSports.value.includes(sport)) {
        selectedSports.value = selectedSports.value.filter(s => s !== sport)
    } else {
        selectedSports.value.push(sport)
    }
}

const showAddEventPopup = ref(false)
const showErrorPopup = ref(false)
const errorMessage = ref('')
const newEvent = ref({
    sport: '',
    team: '',
    date: '',
    time: '',
    location: '',
    ticketsOpen: ''
})

const openAddEventPopup = () => {
    showAddEventPopup.value = true
}

const closeAddEventPopup = () => {
    showAddEventPopup.value = false
}

const closeErrorPopup = () => {
    showErrorPopup.value = false
}

const validateEvent = () => {
    if (!newEvent.value.sport) {
        errorMessage.value = "Please select a sport"
        return false
    }
    if (!newEvent.value.team) {
        errorMessage.value = "Please enter a team name"
        return false
    }
    if (!newEvent.value.date) {
        errorMessage.value = "Please select a date and time"
        return false
    }
    if (!newEvent.value.location) {
        errorMessage.value = "Please select a location"
        return false
    }
    if (!newEvent.value.ticketsOpen) {
        errorMessage.value = "Please select when tickets open"
        return false
    }
    return true
}

const addEvent = () => {
    if (!validateEvent()) {
        showErrorPopup.value = true
        return
    }
    
    const { sport, team, date, location, ticketsOpen } = newEvent.value
    const title = `UConn vs. ${team}`
    const id = events.value.length + 1
    events.value.push({ 
        id, 
        title, 
        date, 
        location, 
        sport, 
        ticketLink: `/buy-tickets/${team.toLowerCase().replace(/\s+/g, '-')}`, 
        ticketsOpen 
    })
    
    // Reset form
    newEvent.value = {
        sport: '',
        team: '',
        date: '',
        time: '',
        location: '',
        ticketsOpen: ''
    }
    
    closeAddEventPopup()
}

// Click outside to close error popup
const handleClickOutside = (e) => {
    if (e.target.className === 'error-popup-overlay') {
        closeErrorPopup()
    }
}
</script>

<template>
    <div id="app">
        <Header />
        <main>
            <img src="@/assets/other/events.jpg" alt="UConn Events" class="Img" />
            <div class="container">
                <div>
                    <h2>Sports</h2>
                    <ul class="sports-list">
                        <li v-for="sport in sports" :key="sport">
                            <label>
                                <input type="checkbox" :value="sport" v-model="selectedSports" />
                                {{ sport }}
                            </label>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2>Upcoming Events</h2>
                    <ul class="events-list">
                        <li v-for="event in filteredEvents" :key="event.id" class="event-card">
                            <div class="event-details">
                                <h2>{{ event.sport }}: {{ event.title }}</h2>
                                <p>{{ formatDate(event.date) }} | {{ event.location }}</p>
                                <a :href="event.ticketLink" class="ticket-button">Buy Tickets</a>
                                <p class="tickets-open">Tickets Open: {{ formatDate(event.ticketsOpen) }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button @click="openAddEventPopup" class="add-event-button">Add Event</button>
            </div>
        </main>
        
        <!-- Add Event Popup -->
        <div v-if="showAddEventPopup" class="add-event-popup">
            <div class="popup-content">
                <h2>Add Event</h2>
                <label>Sport</label>
                <select v-model="newEvent.sport">
                    <option v-for="sport in allsports" :key="sport" :value="sport">{{ sport }}</option>
                </select>
                <label>Team</label>
                <input v-model="newEvent.team" type="text" placeholder="Team UConn is playing" />
                <label>Date</label>
                <input v-model="newEvent.date" type="datetime-local" />
                <label>Location</label>
                <select v-model="newEvent.location">
                    <option v-if="newEvent.sport.includes('Basketball')" value="Gampel Pavilion">Gampel Pavilion</option>
                    <option v-if="newEvent.sport.includes('Basketball')" value="XL Center">XL Center</option>
                    <option v-if="newEvent.sport.includes('Hockey')" value="Toscano Family Ice Forum">Toscano Family Ice Forum</option>
                    <option v-if="newEvent.sport.includes('Hockey')" value="XL Center">XL Center</option>
                    <option v-if="newEvent.sport.includes('Soccer')" value="Morrone Stadium">Morrone Stadium</option>
                    <option v-if="newEvent.sport.includes('Football')" value="Pratt & Whitney Stadium">Pratt & Whitney Stadium</option>
                    <option v-if="newEvent.sport === 'Other'" value="Gampel Pavilion">Gampel Pavilion</option>
                </select>
                <label>Tickets Open</label>
                <input v-model="newEvent.ticketsOpen" type="datetime-local" />
                <button @click="addEvent">Add</button>
                <button @click="closeAddEventPopup">Close</button>
            </div>
        </div>
        
        <!-- Error Popup -->
        <div v-if="showErrorPopup" class="error-popup-overlay" @click="handleClickOutside">
            <div class="error-popup">
                <div class="error-icon">❌</div>
                <h3>ERROR</h3>
                <p>{{ errorMessage }}</p>
                <button @click="closeErrorPopup">OK</button>
            </div>
        </div>
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

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    max-width: 100rem; 
    margin: 0 auto;
}

.container > div {
    width: 100%;
    border: 10px solid #000E2F;
    border-radius: 1rem;
    background-color: #000E2F;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    margin-bottom: 1rem;
    padding: 1rem;
    color: white;
}

h2 {
    font-size: 2rem; /* Increase font size for h2 headers */
    margin-bottom: 0.5rem; /* Reduce space below h2 headers */
}

ul {
    list-style: none;
    padding: 0;
}

.sports-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 1.25rem; /* Increase font size */
}

.sports-list li {
    cursor: pointer;
    margin: 0.5rem;
    display: flex;
    align-items: center;
}

label {
    display: flex;
    align-items: center;
}

input[type="checkbox"] {
    margin-right: 0.5rem;
}

.events-list {
    height: 40rem; /* Reduce the height of the upcoming events container */
    overflow-y: auto;
}

.Img {
    width: 80%;
    max-width: 100rem;
    height: auto;
    margin: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white; /* Change background color to white */
    color: #000E2F; /* Change text color to #000E2F */
    margin: 1rem 0; /* Add margin above and below */
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
    color: #000E2F; /* Change text color to #000E2F */
}

.tickets-open {
    color: #7C878E; /* Set tickets open time and date color to dark grey */
    margin-top: 10px;
}

.ticket-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #1B2E67;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
}

.ticket-button:hover {
    background-color: #E4002B;
}

.add-event-button {
    background-color: #1B2E67;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
}

.add-event-button:hover {
    background-color: #E4002B;
}

.add-event-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #7C878E;
    padding: 3rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    border-radius: 15px;
    width: 400px;
}

.popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-content h2 {
    margin-bottom: 1rem;
    font-family: Arial, sans-serif;
    font-size: 1.5rem;
    color: #FFFFFF;
}

.popup-content label {
    margin-top: 1rem;
    color: #FFFFFF;
}

.popup-content input, .popup-content select {
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #FFFFFF;
    border-radius: 5px;
    width: 80%;
}

.popup-content button {
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    background-color: #1B2E67;
    color: #FFFFFF;
    border: none;
    border-radius: 5px;
}

.popup-content button:hover {
    background-color: #E4002B;
}

/* Error Popup Styles */
.error-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    font-family: Arial, sans-serif;
}

.error-popup {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    max-width: 90%;
    animation: popup-fade 0.3s ease-in-out;
    font-family: Arial, sans-serif;
}

.error-icon {
    font-size: 2rem;
    color: #E4002B;
    margin-bottom: 1rem;
}

.error-popup h3 {
    color: #000E2F;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.error-popup p {
    color: #000E2F;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.error-popup button {
    background-color: #000E2F;
    color: white;
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.error-popup button:hover {
    background-color: #E4002B;
}

@keyframes popup-fade {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>