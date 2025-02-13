<template>
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
        { id: 1, title: "UConn vs. Villanova", date: "Feb 20, 2025", time: "7:00 PM", location: "Gampel Pavilion", image: "/images/uconn-villanova.jpg", sport: "basketball", ticketLink: "/buy-tickets/villanova" },
        { id: 2, title: "UConn vs. Georgetown", date: "Feb 22, 2025", time: "3:00 PM", location: "Pratt & Whitney Stadium", image: "/images/uconn-georgetown.jpg", sport: "football", ticketLink: "/buy-tickets/georgetown" },
        { id: 3, title: "UConn Hockey vs. Boston College", date: "Feb 25, 2025", time: "8:00 PM", location: "Storrs Ice Arena", image: "/images/uconn-bc-hockey.jpg", sport: "hockey", ticketLink: "/buy-tickets/hockey-bc" },
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
