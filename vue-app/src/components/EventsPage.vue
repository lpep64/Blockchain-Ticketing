<template>
  <header>
    <div class="left-section">
      <img src="@/assets/header/main_logo_husky.svg" alt="Husky Logo" class="logo1" />
      <img src="@/assets/header/main_logo.png" alt="UConn Logo" class="logo2" />
    </div>
    <div class="middle-section">
      <button @click="transferEvents" class="link-button">Events</button>
      <span class="separator">|</span>
      <button @click="transferWallet" class="link-button">Wallet</button>
      <span class="separator">|</span>
      <button @click="transferSeatGeek" class="link-button">SeatGeek</button>
      <span class="separator">|</span>
      <button @click="popupPromoCode" class="link-button">Promo Code</button>
    </div>
    <div class="right-section">
      <button v-if="!netID" @click="redirectToAuth" class="login-button">Login</button>
      <div v-else class="user-info">
        <h2>Welcome, {{ netID }}</h2>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </div>
  </header>
  <div class="events-page">
    <header class="events-header">
      <h1>UConn Athletics Events</h1>
      <div class="filters">
        <label for="sportFilter">Filter by Sport: </label>
        <select v-model="selectedSport" id="sportFilter">
          <option value="all">All Sports</option>
          <option value="basketball">Basketball</option>
          <option value="football">Football</option>
          <option value="hockey">Hockey</option>
          <!-- Add more sports as needed -->
        </select>
      </div>
    </header>

    <div class="event-list">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="event-details">
          <h2>{{ event.title }}</h2>
          <p>{{ event.date }} | {{ event.time }} | {{ event.location }}</p>
          <a :href="event.ticketLink" class="ticket-button">Buy Tickets</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSport: "all",
      events: [
        { id: 1, title: "UConn vs. Villanova", date: "Feb 20, 2025", time: "7:00 PM", location: "Gampel Pavilion", sport: "basketball", ticketLink: "/buy-tickets/villanova" },
        { id: 2, title: "UConn vs. Duke", date: "Feb 22, 2025", time: "3:00 PM", location: "Pratt & Whitney Stadium", sport: "football", ticketLink: "/buy-tickets/duke" },
        { id: 3, title: "UConn Hockey vs. Boston College", date: "Feb 25, 2025", time: "8:00 PM", location: "Toscano Family Ice Forum", sport: "hockey", ticketLink: "/buy-tickets/hockey-bc" },
        // Add more events as needed
      ]
    };
  },
  computed: {
    filteredEvents() {
      if (this.selectedSport === "all") {
        return this.events;
      }
      return this.events.filter(event => event.sport === this.selectedSport);
    }
  }
};
</script>

<style scoped>
header {
  background-color: #0C2340;
  color: #FFFFFF;
  padding: 0.25rem;
  width: 100%;
  position: static;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  justify-content: space-between;
  margin: 0;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.left-section, .middle-section, .right-section {
  display: flex;
  align-items: center;
}

.middle-section {
  flex: 1;
  justify-content: space-evenly;
}

.logo1 {
  margin-left: 0.5rem;
  height: 55px;
  margin-right: 0.5rem;
}

.logo2 {
  height: 25px;
  margin-right: 1rem;
}

.link-button {
  background: none;
  border: 1rem solid transparent;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 1.2rem;
}

.link-button:hover {
  color: red;
}

.separator {
  color: grey;
  font-size: 2rem;
}

h2 {
  font-weight: 350;
  font-size: larger;
  margin: 0;
  text-align: center;
}

.login-button, .logout-button {
  background-color: #1B2E67;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.login-button:hover, .logout-button:hover {
  background-color: #0A1E30;
}

.events-page {
  padding: 20px;
  font-family: 'Roboto', sans-serif;;
}

.events-header {
  text-align: center;
  margin-bottom: 30px;
}

.filters {
  display: inline-block;
  margin-top: 10px;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
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
