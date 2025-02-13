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
            <h1>Home</h1>
            <img src="@/assets/home/students.jpg" alt="UConn Students" class="Img" />
            <div style="width: 80%; height: 1px; margin: 0.5rem 0;"></div>
            <button @click="transferEvents" class="link-button">CLAIM YOUR TICKETS NOW!</button>
            <div style="width: 80%; height: 1px; margin: 0.5rem 0;"></div>
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
    border: 1px solid red;
    background-color: #081a2c;
}

</style>