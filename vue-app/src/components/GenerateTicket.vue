<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import axios from 'axios'

const netid = ref('')
const eventid = ref('')
const seatid = ref('')
const notificationMessage = ref('') // Handles notification text
const showModal = ref(false) // Controls modal visibility

const router = useRouter()

const submitForm = async () => {
    console.log('NetID:', netid.value);
    console.log('EventID:', eventid.value);
    console.log('SeatID:', seatid.value);

    const response = await axios.post('/api/generate-ticket', {
        netID: netid.value,
        eventID: eventid.value,
        seatInfo: seatid.value
    });
    console.log('Ticket Generation API response: ', response);


    notificationMessage.value = "Transaction proccessing check back in a few minuets";
    showModal.value = true;
};


const closeModal = () => { 
    showModal.value = false
}

const transferTicket = () => {
    router.push('/transfer-ticket') // Use router to navigate
}
</script>

<template>
    <div id="app">
        <Header />
        <main>
            <h1>Ticket Generation</h1>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="netid">Net ID:</label>
                    <input type="text" id="netid" v-model="netid" required />
                </div>
                <div class="form-group">
                    <label for="seatid">Seat ID (Optional):</label>
                    <input type="text" id="seatid" v-model="seatid" />
                </div>
                <div class="form-group">
                    <label for="eventid">Event ID:</label>
                    <input type="text" id="eventid" v-model="eventid" required />
                </div>
                <button type="submit">Generate Ticket</button>
            </form>
            <button @click="transferTicket" class="transfer-button">Transfer Existing Ticket</button>
            
            <!-- Modal -->
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <span class="close" @click="closeModal">&times;</span>
                    <p>{{ notificationMessage }}</p>
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
    background-color: #171717;
    color: #0C2340;
    text-align: center;
    margin-top: 5rem;
}

h1 {
    margin-bottom: 1rem;
    color: #ffffff;
    font-size: 1.5rem;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #0C2340;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1rem;
    width: 100%;
    max-width: 300px;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #ffffff;
}

input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #E4002B;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
}

button:hover {
    background-color: #C30024;
}

.transfer-button {
    background-color: #0C2340;
    margin-top: 1rem;
}

.transfer-button:hover {
    background-color: #0A1E30;
}

.modal {
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

.modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    position: relative;
}

.close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
}
</style>
