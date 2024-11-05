<!-- Komponent för att visa dagens väder på vald plats -->
<script setup>
import wc from '@/assets/data/weatherCodes.json'
import { ref } from 'vue'

const weatherCodes = ref(wc)
const props = defineProps(['currentWeather'])

//Funktion för att transformera väderkoder
function getText(code) {
  const item = weatherCodes.value.find(itm => itm.code == code)
  return item ? `${item.description} ${item.emoji}` : 'Unknown'
}
</script>

<template>
  <ul>
    <li>Date</li>
    <li>Temp</li>
    <li>Precip</li>
    <li>Wind</li>
    <li>Humidity</li>
    <li>Clouds</li>
    <li>Pressure</li>
  </ul>
  <!-- Hämta all väderdata -->
  <ul v-for="day in props.currentWeather.weather" :key="day">
    <li>
      {{ new Date(day.date).getDate() }}.{{ new Date(day.date).getMonth() + 1
      }}<br />
      {{ getText(day.code) }}
    </li>
    <li>
      Temperature: {{ day.temp.temp }}{{ day.temp.unit }}<br />
      Feels like: {{ day.temp.app }}{{ day.temp.unit }}
    </li>
    <li>{{ day.precipitation }}mm</li>
    <li>
      {{ Math.round(day.wind.speed) }} ({{
        Math.round(day.wind.gusts)
      }})m/s<br />
      {{ day.wind.direction }}°
    </li>
    <li>{{ day.humidity }}%</li>
    <li>{{ day.cloud }}%</li>
    <li>{{ day.pressure }} hPa</li>
  </ul>
</template>

<style scoped>
ul {
  padding: 0;
  display: grid;
  grid-template-columns: 20% 15% 10% 10% 10% 10% auto;
}
ul:nth-child(even) {
  background-color: #a0b7e6;
}
ul:nth-child(odd) {
  background-color: #7395db;
}
li {
  border: 0.1em black solid;
  padding: 0 0.5em;
  list-style-type: none;
  vertical-align: top;
  display: inline-block;
  color: black;
}
</style>
