<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
<<<<<<< HEAD
=======
import axios from 'axios'
>>>>>>> frontend-2.0

// State variables
const OldNetID = ref('')
const NewNetID = ref('')
<<<<<<< HEAD
=======
const eventid = ref('')
>>>>>>> frontend-2.0
const notificationMessage = ref('') // For feedback messages
const showModal = ref(false)        // Controls modal visibility

const router = useRouter()

// Submit form logic
const submitForm = async () => {
    console.log('OldNetID:', OldNetID.value)
    console.log('NewNetID:', NewNetID.value)

<<<<<<< HEAD
    try {
        // API request to transfer ticket
        const response = await fetch('https://generateticket-610385862744.us-central1.run.app/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oldNetID: OldNetID.value.trim(),
                newNetID: NewNetID.value.trim(),
            }),
        })

        if (response.ok) {
            const data = await response.json()
            console.log('Response data:', data)
            notificationMessage.value = `Ticket successfully transferred! Confirmation ID: ${data.confirmationID}`
        } else {
            const errorData = await response.json()
            console.error('Error response:', errorData)
            notificationMessage.value = `Error: ${errorData.message || 'Failed to transfer ticket.'}`
        }
    } catch (error) {
        console.error('Network or fetch error:', error)
        notificationMessage.value = 'An error occurred. Please try again later.'
    }
=======

    const response = await axios.post('/api/transfer-ticket', {
        SendernetID: OldNetID.value,
        ReceiverNetID: NewNetID.value,
        eventID: eventid.value
    });
    console.log('transfer response: ', response);

    notificationMessage.value = "Transaction proccessing check back in a few minuets";
>>>>>>> frontend-2.0

    // Show modal with feedback
    showModal.value = true
}

// Close the modal
const closeModal = () => {
    showModal.value = false
}

// Navigate to ticket generation
const transferTicket = () => {
    router.push('/generate-ticket') // Navigate to the "Generate Ticket" page
}
</script>

<template>
    <div id="app">
        <Header />
        <main>
            <h1>Ticket Transfer</h1>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="OldNetID">Current NetID:</label>
                    <input type="text" id="OldNetID" v-model="OldNetID" required />
                </div>
                <div class="form-group">
                    <label for="NewNetID">New NetID:</label>
                    <input type="text" id="NewNetID" v-model="NewNetID" required />
                </div>
<<<<<<< HEAD
=======
                <div class="form-group">
                    <label for="eventid">Event ID:</label>
                    <input type="text" id="eventid" v-model="eventid" required />
                </div>
>>>>>>> frontend-2.0
                <button type="submit">Transfer Ticket</button>
            </form>
            <button @click="transferTicket" class="transfer-button">Generate New Tickets</button>

<<<<<<< HEAD
            <!-- Modal for feedback -->
=======
            <!-- Modal -->
>>>>>>> frontend-2.0
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
<<<<<<< HEAD
    color: #0C2340;
    text-align: center;
    margin-top: 5rem;
=======
    color: #000E2F;
    text-align: center;
    margin: 0;
>>>>>>> frontend-2.0
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
<<<<<<< HEAD
    background-color: #0C2340;
=======
    background-color: #000E2F;
>>>>>>> frontend-2.0
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
<<<<<<< HEAD
    background-color: #0C2340;
=======
    background-color: #000E2F;
>>>>>>> frontend-2.0
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
<<<<<<< HEAD
=======
    z-index: 1000;
>>>>>>> frontend-2.0
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
<<<<<<< HEAD
=======
    position: relative;
>>>>>>> frontend-2.0
}

.close {
    position: absolute;
<<<<<<< HEAD
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
    color: #000;
}
</style>
=======
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    font-size: 1.5rem;
}
</style>
>>>>>>> frontend-2.0
