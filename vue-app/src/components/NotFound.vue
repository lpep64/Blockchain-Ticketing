<template>
  <div class="container flex flex-col items-center mt-10">
    <h1 class="text-3xl mb-3">Sorry, this page does not exist!</h1>
    <router-link class="btn btn-light-green" :to="{ name: 'home' }">
      Back To Home
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
