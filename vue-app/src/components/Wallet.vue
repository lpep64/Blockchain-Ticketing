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
                              <p class="seat-info">{{ ticket.section }} | {{ ticket.row }} | {{ ticket.seat }}</p>
                              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Placeholder" alt="Ticket QR Code" class="qr-code" />
                          </div>
                      </li>
                  </ul>
              </div>
          </div>
      </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

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

const tickets = ref([
  { 
      id: 1, 
      title: "UConn vs. Villanova", 
      date: "2025-02-20T19:00", 
      location: "Gampel Pavilion", 
      sport: "Men's Basketball",
      section: "Section 101",
      row: "Row 15",
      seat: "Seat 12"
  },
  { 
      id: 2, 
      title: "UConn vs. Duke", 
      date: "2025-02-22T15:00", 
      location: "Pratt & Whitney Stadium", 
      sport: "Football",
      section: "Section 203",
      row: "Row 20",
      seat: "Seat 8"
  },
  { 
      id: 3, 
      title: "UConn vs. Boston College", 
      date: "2025-02-25T20:00", 
      location: "Toscano Family Ice Forum", 
      sport: "Women's Hockey",
      section: "Section 115",
      row: "Row 10",
      seat: "Seat 5"
  },
  { 
      id: 4, 
      title: "UConn vs. Syracuse", 
      date: "2025-02-27T19:00", 
      location: "Gampel Pavilion", 
      sport: "Women's Basketball",
      section: "Section 108",
      row: "Row 12",
      seat: "Seat 15"
  }
])
</script>

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
  height: 40rem;
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

.seat-info {
  font-weight: bold;
  color: #E4002B !important;
  margin: 10px 0;
}

.qr-code {
  width: 120px;
  height: 120px;
  margin: 10px auto;
  display: block;
}
</style>