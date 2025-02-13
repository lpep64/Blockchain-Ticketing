<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const netID = ref(null);
const router = useRouter();
const showPromoPopup = ref(false);
const promoCode = ref("");

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

const transferHome = () => {
  router.push('/');
};

const transferEvents = () => {
  router.push('/transfer-events');
};

const transferWallet = () => {
  router.push('/transfer-wallet');
};

const transferSeatGeek = () => {
  window.location.href = "https://seatgeek.com/search?f=1&search=UConn&ui_origin=home_search";
};

const popupPromoCode = () => {
  showPromoPopup.value = true;
};

const closePromoPopup = () => {
  showPromoPopup.value = false;
};

const applyPromoCode = () => {
  console.log("Promo Code:", promoCode.value);
  //Code to confirm Promo Code
  closePromoPopup();
};
</script>

<template>
  <header>
    <div class="left-section">
      <img src="@/assets/header/main_logo_husky.svg" alt="Husky Logo" class="logo1" @click="transferHome"/>
      <img src="@/assets/header/main_logo.png" alt="UConn Logo" class="logo2" @click="transferHome"/>
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

  <div v-if="showPromoPopup" class="promo-popup">
    <div class="popup-content">
      <h2>Enter Promo Code</h2>
      <input v-model="promoCode" type="text" placeholder="Promo Code" />
      <button @click="applyPromoCode">Apply</button>
      <button @click="closePromoPopup">Close</button>
    </div>
  </div>
</template>

<style scoped>
header {
  background-color: #0C2340;
  color: #FFFFFF;
  padding: 0.25rem;
  width: 100%;
  position: fixed;
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

.logo1, .logo2 {
  cursor: pointer;
}

.link-button {
  background: none;
  border: 1rem solid transparent;
  color: #FFFFFF;
  text-decoration: underline;
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

.promo-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #7C878E;
  padding: 3rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border-radius: 15px;
  width: 400px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-content h2 {
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
  font-size: 1.5rem;
  color: #FFFFFF;
}

.popup-content input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #FFFFFF;
  border-radius: 5px;
  width: 80%;
}

.popup-content button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #1B2E67;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
}

.popup-content button:hover {
  background-color: #0A1E30;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  header {
    flex-direction: row;
    flex-wrap: nowrap; /* Prevent wrapping */
    overflow-x: auto; /* Allow horizontal scrolling */
  }

  .left-section, .middle-section, .right-section {
    justify-content: flex-start;
    margin-bottom: 0;
  }

  .logo1, .logo2 {
    margin-right: 0.5rem;
  }

  h2 {
    font-size: 1rem;
  }

  .link-button, .login-button, .logout-button {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>