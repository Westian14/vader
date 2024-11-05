<script setup>
import { ref, watchEffect } from 'vue'
import { getForecast } from '@/services/forecastService'
import ForecastResult from '@/components/ForecastResult.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'
import { getCurrentWeather } from '@/services/currentWeatherService'

const currentLocation = ref({ lat: 60.0, long: 20.0, name: 'DUMMY' })
const forecast = ref({})
const currentWeather = ref({})
const props = defineProps(['location'])

watchEffect(() => {
  let locationsList = JSON.parse(localStorage.getItem('locations'))
  if (props.location) {
    currentLocation.value = locationsList.find(loc => {
      return loc.name.toLocaleLowerCase() === props.location.toLocaleLowerCase()
    })
  } else {
    currentLocation.value = locationsList.find(loc => {
      return loc.default
    })
  }
  if (currentLocation.value) {
    getForecast(currentLocation.value)
      .then(response => {
        forecast.value = response
      })
      .catch(err => {
        console.log(err)
      })
    getCurrentWeather(currentLocation.value)
      .then(response => {
        currentWeather.value = response
      })
      .catch(err => {
        console.log(err)
      })
  }
})
</script>

<template>
  <template v-if="!currentLocation">
    <h2>Angiven plats saknas</h2>
    <p>{{ props.location }} finns inte i listan över platser</p>
  </template>
  <template v-else>
    <header>
      <h2>{{ currentLocation.name }}</h2>
      <div>
        <h2 class="location">
          Lat: <span>{{ currentLocation.position.lat.toFixed(3) }}</span>
        </h2>
        <h2 class="location">
          Long: <span>{{ currentLocation.position.long.toFixed(3) }}</span>
        </h2>
      </div>
    </header>
    <main>
      <h2>Today:</h2>
      <CurrentWeather :currentWeather="currentWeather" />
      <br />
      <h2>This week:</h2>
      <ForecastResult :forecast="forecast" />
    </main>
  </template>
</template>

<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
header {
  display: flex;
  flex-direction: row;
  padding: 0.4em;
}
</style>
