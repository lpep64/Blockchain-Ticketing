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
            <img src="@/assets/home/students.jpg" alt="UConn Students" class="MainImg" />
            <h1>TODO: Button (Claim tickets = login, if login view my tickets), Sports you can get tickets to, sports that are free</h1>
            <img src="@/assets/home/ads.png" alt="UConn Ads" class="AdsImg" />
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

.MainImg {
  height: 32rem;
  margin: 2rem;
}

.MainImg {
  height: 20rem;
  margin: 2rem;
}

</style>