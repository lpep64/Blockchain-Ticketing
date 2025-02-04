<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

</script>

<template>
    <div id="app">
        <Header />
        <main>
            <img src="@/assets/home/students.jpg" alt="UConn Students" class="Img" />
            <h1>Add Buttom Here: Send to Events</h1>
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

</style>