<template>
    <header>
        <img src="@/assets/uconn_huskies_logo_alternate.png" alt="UConn Huskies Logo" class="logo" />
        <div class="title-wrapper">
            <h1>Senior Design Project Team 45 - Blockchain Ticketing</h1>
        </div>
    </header>
</template>

<script setup>
</script>

<style scoped>
header {
    background-color: #ffffff;
    color: #0C2340;
    padding: 1rem;
    width: 100%;
    position: sticky;
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
