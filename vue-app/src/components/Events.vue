<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

const sports = ref(['Basketball', 'Football', 'Hockey', 'Soccer'])
const selectedSport = ref(null)
const events = ref([])

const addEvent = (event) => {
    events.value.push(event)
}

</script>

<template>
        <div id="app">
                <Header />
                <main>
                        <h1>Events</h1>
                        <img src="@/assets/other/events.jpg" alt="UConn Events" class="Img" />
                        <div class="container">
                                <div class="left-box">
                                        <h2>Sports</h2>
                                        <ul>
                                                <li v-for="sport in sports" :key="sport" @click="selectedSport = sport">
                                                        {{ sport }}
                                                        <div v-if="selectedSport === sport" class="dropdown">
                                                                <input type="text" placeholder="Event Details" v-model="eventDetails" />
                                                                <button @click="addEvent({ sport, details: eventDetails })">Add</button>
                                                        </div>
                                                </li>
                                        </ul>
                                </div>
                                <div class="right-box">
                                        <h2>Upcoming Events</h2>
                                        <ul class="events-list">
                                                <li v-for="event in events" :key="event.details">
                                                        {{ event.sport }}: {{ event.details }}
                                                </li>
                                        </ul>
                                </div>
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

h1 {
        margin-bottom: 1rem;
        color: #0C2340;
        font-size: 1.5rem;
}

.container {
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 150rem;
        margin: 0 auto;
}

.left-box, .right-box {
        color: black;
        width: 45%;
        border: 10px solid #0C2340;
        border-radius: 1rem;
        background-color: lightgrey;
        box-sizing: border-box;
}

.left-box{
        margin-right: 1rem;
}

.right-box {
        margin-left: 1rem;
}

.left-box ul, .right-box ul {
        list-style: none;
        padding: 0;
}


.left-box li {
        cursor: pointer;
        margin-bottom: 1rem;
}

.dropdown {
        margin-top: 0.5rem;
}

.events-list {
        max-height: 200px;
        overflow-y: auto;
}

.Img {
    width: 80%;
    max-width: 100rem;
    height: auto; 
    margin: 0.5rem;
}

</style>
