<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import axios from 'axios' // Import axios for API calls

const router = useRouter()

// Utility function to format date
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

// Dynamic tickets data
const tickets = ref([])

// Fetch tickets from API
const fetchTickets = async () => {
  try {
    const netIDResponse = await axios.get('/api/getNetID');
    const netID = netIDResponse.data.netID;

    const response = await axios.get(`/api/ticketsByNetID?netID=${netID}`);
    tickets.value = await response.data;
    console.log("Fetched tickets:", response.data);
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};


const unclaimTicket = async (eID) => {
  try {
    const netID = (await axios.get("/api/getNetID")).data.netID

    const response = await axios.post(`/api/unclaimTicket?netID=${netID}&eventID=${eID}`);
    console.log("Unclaimed Ticket", response.data);
    alert(response.data);
    await fetchTickets();
  } catch (error) {
    console.error("Error Unclaiming Ticket: ", error)
    alert(error);
  }
}


// Fetch tickets on component mount
onMounted(() => {
  fetchTickets()
})
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <img src="@/assets/other/wallet.jpg" alt="UConn Wallet" class="Img" />
      <div class="container">
        <div>
          <h2>Your Tickets</h2>
          <ul class="tickets-list">
            <li v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
              <div class="ticket-details">
                <h2>{{ ticket.sport }}: {{ ticket.title }}</h2>
                <p>{{ formatDate(ticket.date) }} | {{ ticket.location }}</p>
                <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.QRCode)}`" 
                      alt="Ticket QR Code" class="qr-code" />
                <button @click="unclaimTicket(ticket.eventID)" class="unclaim-button">Unclaim Ticket</button>
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

.tickets-list {
  height: 38rem;
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

.ticket-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  color: #000E2F;
  margin: 1rem 0;
}

.ticket-details {
  padding: 15px;
  text-align: center;
}

.ticket-details h2 {
  font-size: 1.25rem;
  font-weight: bold;
}

.ticket-details p {
  margin-top: 5px;
  color: #000E2F;
}

.qr-code {
  width: 120px;
  height: 120px;
  margin: 10px auto;
  display: block;
}

.unclaim-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #1B2E67;
    color: white;
    text-decoration: none;
    border: none;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    margin-top: 10px;
}

.unclaim-button:hover {
    background-color: #E4002B;
}

</style>