<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import axios from 'axios' // Import axios for API calls

// Utility function to format date
const formatDate = (datetime) => {
    const date = new Date(datetime);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    return date.toLocaleString('en-US', options);
}

const router = useRouter()

// Static sports categories
const sports = ref([
    'Basketball', 'Football', 'Hockey', 'Soccer', 'Other'
])

const allsports = ref([
    'Men\'s Basketball', 'Women\'s Basketball', 'Football', 'Men\'s Hockey', 'Women\'s Hockey', 'Men\'s Soccer', 'Women\'s Soccer', 'Other'
])

const selectedSports = ref([]) // Allow multiple selections

// Dynamic events data
const events = ref([])

// Fetch events from API
const fetchEvents = async () => {
    try {
        const response = await fetch(`/api/getEvents`);
        const data = await response.json();
        console.log('Fetched Events:', data);  // Log the events to inspect
        events.value = data;
    } catch (error) {
        console.error('Error fetching events:', error);
    }
};

// Claim a ticket
const claimTicket = async (eID) => {
    try {
        console.log(eID)
        const netID = (await axios.get("/api/getNetID")).data.netID
        const response = await axios.post("/api/claimTicket", { netID: netID, eventID: eID });
        console.log(response);
        alert(response.data);
    } catch (error) {
        console.error('Error claiming ticket:');
        alert('Error claiming ticket. Please try again later.');
    }
};

// Fetch events on component mount
onMounted(() => {
    fetchEvents()
})

// Computed property to filter and sort events
const filteredEvents = computed(() => {
    console.log('Filtered Events:', events.value);  // Log events here to ensure they're being processed
    const sortedEvents = [...events.value].sort((a, b) => new Date(a.ticketsOpen) - new Date(b.ticketsOpen));
    if (selectedSports.value.length === 0) {
        return sortedEvents; // Show all if none are selected
    }
    return sortedEvents.filter(event => {
        return selectedSports.value.some(sport => event.sport.includes(sport));
    });
});

// Toggle sport selection
const toggleSport = (sport) => {
    if (selectedSports.value.includes(sport)) {
        selectedSports.value = selectedSports.value.filter(s => s !== sport)
    } else {
        selectedSports.value.push(sport)
    }
}

// Popup and form handling
const showAddEventPopup = ref(false)
const showErrorPopup = ref(false)
const errorMessage = ref('')
const newEvent = ref({
    sport: '',
    team: '',
    date: '',
    time: '',
    location: '',
    ticketsOpen: '',
    totalTickets: ''
})

const resetForm = () => {
    newEvent.value = {
        sport: '',
        team: '',
        date: '',
        time: '',
        location: '',
        ticketsOpen: ''
    }
}

const openAddEventPopup = () => {
    resetForm()
    showAddEventPopup.value = true
}

const closeAddEventPopup = () => {
    resetForm()
    showAddEventPopup.value = false
}

const closeErrorPopup = () => {
    showErrorPopup.value = false
}

// Event validation
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
    if (!newEvent.value.totalTickets) {
        errorMessage.value = "Please enter how many tickets are available for this event"
        return false
    }

    const eventDate = new Date(newEvent.value.date)
    const currentDate = new Date()
    
    if (isNaN(eventDate.getTime())) {
        errorMessage.value = "Please enter a valid date and time"
        return false
    }
    
    if (eventDate < currentDate) {
        errorMessage.value = "Event date cannot be in the past"
        return false
    }
    
    const ticketsOpenDate = new Date(newEvent.value.ticketsOpen)
    
    if (isNaN(ticketsOpenDate.getTime())) {
        errorMessage.value = "Please enter a valid tickets open date and time"
        return false
    }
    
    if (ticketsOpenDate < currentDate) {
        errorMessage.value = "Tickets open date cannot be in the past"
        return false
    }
    
    if (ticketsOpenDate > eventDate) {
        errorMessage.value = "Tickets cannot open after the event date"
        return false
    }

    return true
}

// Add new event
const addEvent = async () => {
    if (!validateEvent()) {
        showErrorPopup.value = true
        return
    }
    
    const { sport, team, date, location, ticketsOpen } = newEvent.value
    const title = `UConn vs. ${team}`
    const id = events.value.length + 1
    const newEventData = { 
        id, 
        title, 
        date, 
        location, 
        sport, 
        ticketLink: `/buy-tickets/${team.toLowerCase().replace(/\s+/g, '-')}`, 
        ticketsOpen,
        totalTickets
    }

    try {
        //await axios.post('/api/events', newEventData) // Replace with your API endpoint
        //events.value.push(newEventData)
        resetForm()
        closeAddEventPopup()
    } catch (error) {
        console.error('Error adding event:', error)
        errorMessage.value = "Failed to add event. Please try again."
        showErrorPopup.value = true
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
                                <button @click="claimTicket(event.ID)" class="ticket-button">Claim Ticket</button>
                                <p class="tickets-open">Tickets Open: {{ formatDate(event.ticketsOpen) }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button @click="openAddEventPopup" class="add-event-button">Add Event</button>
            </div>
        </main>
        
        <!-- Add Event Popup -->
        <div v-if="showAddEventPopup" class="add-event-popup-overlay">
            <div class="add-event-popup">
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
                    <label>Total Tickets</label>
                    <input v-model="newEvent.totalTickets" type="number"/>
                    <div class="button-group">
                        <button @click="addEvent">Add</button>
                        <button @click="closeAddEventPopup">Close</button>
                    </div>
                </div>
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
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

ul {
    list-style: none;
    padding: 0;
}

.sports-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 1.25rem;
}

.sports-list li {
    cursor: pointer;
    margin: 0.25rem;
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
    height: 30rem;
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
    background-color: white;
    color: #000E2F;
    margin: 1rem 0;
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
    color: #000E2F;
}

.tickets-open {
    color: #7C878E;
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
    margin-bottom: .5rem;
    display: inline-block;
    font-size: 1rem;
    min-width: 120px;
    text-align: center;
}

.add-event-button:hover {
    background-color: #E4002B;
}

/* Add Event Popup Overlay */
.add-event-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.add-event-popup {
    background-color: #7C878E;
    padding: 2.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    margin: 2rem;
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
    width: 90%;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.popup-content button {
    margin: 0.5rem;
    padding: 0.5rem 1.5rem;
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
    background-color: #1B2E67;
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