<template>
  <header>
    <img src="@/assets/uconn_huskies_logo_alternate.png" alt="UConn Huskies Logo" class="logo" />
    <div class="title-wrapper">
      <h1>Senior Design Project Team 45 - Blockchain Ticketing</h1>
    </div>
    <button v-if="!netID" @click="redirectToAuth" class="login-button">Login</button>
    <div v-else class="user-info">
      <h2>Welcome, {{ netID }}</h2>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

const netID = ref(null);

const getNetIDFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const netIDCookie = cookies.find((cookie) => cookie.startsWith("netID="));
  return netIDCookie ? netIDCookie.split("=")[1] : null;
};

const redirectToAuth = () => {
  window.location.href = "/login";
};

const logout = () => {
  window.location.href = "/logout";
};

onMounted(() => {
  netID.value = getNetIDFromCookie();
});
</script>

<style scoped>
header {
    background-color: #ffffff;
    color: #0C2340;
    padding: 1rem;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    justify-content: center;
    margin-bottom: 2rem;
    /* Center items horizontally */
}

.logo {
    height: 80px;
    margin-right: 1rem;
}

.title-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
}

h1 {
    font-weight: 700;
    margin: 0;
    text-align: center;
}
h2 {
    font-weight: 350;
    font-size: larger;
    margin: 0;
    text-align: center;
}
.login-button, .logout-button {
    background-color: #0C2340;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 1rem;
}

.login-button:hover, .logout-button:hover {
    background-color: #0A1E30;
}


/* Media query for mobile devices */
@media (max-width: 768px) {
    header {
        flex-direction: column;
        /* Stack items vertically */
        height: auto;
        /* Adjust height for vertical layout */
    }

    .logo {
        margin-right: 0;
        margin-bottom: 1rem;
        /* Add space below the logo */
    }

    .title-wrapper {
        justify-content: center;
    }

    h1 {
        font-size: 1.2rem;
        /* Adjust font size for smaller screens */
    }
}
</style>
