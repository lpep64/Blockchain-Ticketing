<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const netid = ref('')
const eventid = ref('')
const seatid = ref('')

const router = useRouter()

const submitForm = () => {
    console.log('NetID:', netid.value)
    console.log('EventID:', eventid.value)
    console.log('SeatID:', seatid.value)
    // Add your form submission logic here
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
                    <label for="eventid">Event ID:</label>
                    <input type="text" id="eventid" v-model="eventid" required />
                </div>
                <div class="form-group">
                    <label for="seatid">Seat ID (Optional):</label>
                    <input type="text" id="seatid" v-model="seatid" />
                </div>
                <button type="submit">Generate Ticket</button>
            </form>
            <button @click="transferTicket" class="transfer-button">Transfer Existing Ticket</button>
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
</style>
