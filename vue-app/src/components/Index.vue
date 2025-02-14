<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

const transferEvents = () => {
  router.push('/transfer-events');
};

</script>

<template>
    <div id="app">
        <Header />
        <main>
            <img src="@/assets/home/students.jpg" alt="UConn Students" class="Img" />
            <div class="button-container">
                <button @click="transferEvents">CLAIM STUDENT TICKETS HERE!</button>
            </div>
            <img src="@/assets/home/uconnsports.png" alt="UConn Sports" class="Img" />
            <h1></h1>
            <img src="@/assets/home/ads.png" alt="UConn Ads" class="Img" />
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

.image-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  margin-bottom: 20px;
}

/* Center the button and add spacing */
.button-container {
    display: flex;
    justify-content: center;
    margin: 20px 0; /* Add spacing above and below */
}

/* Style the button similar to the navbar */
.nav-button {
    background-color: #001E62; /* UConn dark blue */
    color: white;
    font-size: 18px;
    font-weight: bold;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s;
}

.nav-button:hover {
    background-color: red; /* UConn accent color */
    transform: scale(1.05);
}

.nav-button {
    margin-top: 10px; /* Add space above the button */
}

button {
    background-color: #0C2340;
    color: rgb(212, 212, 212);
    padding: 1rem 2rem;
    border: 1px solid rgb(212, 212, 212);
    border-radius: 1rem;
    cursor: pointer;
    font-size: 3.5rem;
    font-family: Arial, sans-serif;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: red;
}

</style>