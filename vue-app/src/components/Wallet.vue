<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

const tickets = ref([ // This is the list of tickets (like events)
    { id: 1, title: "UConn Basketball vs. Villanova", sport: "Basketball" },
    { id: 2, title: "UConn Football vs. Duke", sport: "Football" },
    { id: 3, title: "UConn Hockey vs. Boston College", sport: "Hockey" },
    { id: 4, title: "UConn Basketball vs. Syracuse", sport: "Basketball" },
    { id: 5, title: "UConn Footbll vs. Alabama", sport: "Football" },
    { id: 6, title: "UConn Hockey vs. Providence", sport: "Hockey" },
])

</script>

<template>
  <div id="app">
    <Header />
    <main>
      <h1>Wallet</h1>
      <img src="@/assets/other/wallet.jpg" alt="UConn Wallet" class="Img" />
      <div class="ticket-container">
        <h2 class="ticket-header">Your Tickets</h2>
        <div class="ticket-list">
          <div v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
            {{ ticket.title }}
          </div>
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
  font-family: Arial, sans-serif;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ticket-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 40rem;
  width: 90%;
  height: 50vh;
  color: #FFFFFF;
  border: 2px solid #000E2F;
  border-radius: 1rem;
  background: #000E2F;
  box-sizing: border-box;
  margin-top: 1rem;
  padding: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: relative;
}

.ticket-header {
  position: sticky;
  top: 0;
  background: #000E2F;
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid #FFFFFF;
}

.ticket-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-height: 200px; /* Keeps the list scrollable */
  overflow-y: auto;
}

.ticket-item {
  padding: 1rem;
  background-color: #FFFFFF;
  border: 2px solid #000E2F;
  border-radius: 0.5rem;
  color: #000E2F;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  width: 100%;
}

.ticket-item:hover {
  transform: scale(1.05);
  background-color: #E4002B;
  color: #FFFFFF;
}

h1 {
  margin-bottom: 1rem;
  color: #000E2F;
  font-size: 2rem;
  font-weight: bold;
}

.Img {
  width: 80%;
  max-width: 100rem;
  height: auto;
  margin: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>