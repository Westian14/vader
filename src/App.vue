<!-- Default view -->
<script setup>
import { RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue'
import { onMounted, ref } from 'vue'

//Lägg till en dummmy position till listan om det inte finns någon plats
onMounted(() => {
  let locations = JSON.parse(localStorage.getItem('locations'))
  if (!locations) {
    locations = [
      { name: 'Mariehamn', position: { lat: 60, long: 20 }, default: true },
    ]
    localStorage.setItem('locations', JSON.stringify(locations))
  }
})

const menuActive = ref(false)
</script>

<!-- BurgerMenu kompnenten -->
<template>
  <div>
    <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
  </div>
  <RouterView />
</template>

<style scoped>
div {
  display: flex;
  flex-direction: row;
}
</style>
