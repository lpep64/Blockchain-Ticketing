<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Header.vue';

const router = useRouter();
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <h1>Wallet</h1>
      <img src="@/assets/other/wallet.jpg" alt="UConn Wallet" class="Img" />
      <div class="ticket-container">
        <h2>Your Tickets</h2>
        <div class="ticket-item">Ticket 1</div>
        <div class="ticket-item">Ticket 2</div>
        <div class="ticket-item">Ticket 3</div>
        <div class="ticket-item">Ticket 4</div>
        <div class="ticket-item">Ticket 5</div>
        <div class="ticket-item">Ticket 6</div>
        <div class="ticket-item">Ticket 7</div>
        <div class="ticket-item">Ticket 8</div>
        <div class="ticket-item">Ticket 9</div>
        <div class="ticket-item">Ticket 10</div>
        <div class="ticket-item">Ticket 11</div>
        <div class="ticket-item">Ticket 12</div>
        <div class="ticket-item">Ticket 13</div>
        <div class="ticket-item">Ticket 14</div>
        <div class="ticket-item">Ticket 15</div>
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

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ticket-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-width: 100rem;
  width: 80%; 
  height: 50rem; 
  color: black;
  border: 3px solid #0C2340;
  border-radius: 1rem;
  background-color: lightgrey;
  box-sizing: border-box;
  margin-top: 1rem; 
  overflow-y: auto; 
}

.ticket-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #FFFFFF;
  border: 1px solid #0C2340;
  width: 90%;
  text-align: left;
}

h1 {
  margin-bottom: 1rem;
  color: #0C2340;
  font-size: 1.5rem;
}

.Img {
  width: 80%;
  max-width: 100rem;
  height: auto;
  margin: 0.5rem;
}
</style>