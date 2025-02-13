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
    <div>
        <h1>Wallet</h1>
        <p>Manage your blockchain tickets here.</p>
    </div>
</template>
  
<script setup>
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
</style>