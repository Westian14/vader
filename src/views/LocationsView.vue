<!-- View för att välja location -->
<script setup>
import router from '@/router'
import { getPosition } from '@/services/positioningService'
import { getLocationName } from '@/services/positionNameService'
import { onMounted, ref } from 'vue'

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false,
})
const locationsList = ref([])

//Skapa currentlocation när view:n laddas
onMounted(() => {
  locationsList.value = JSON.parse(localStorage.getItem('locations')) || []
  let oldLocation = locationsList.value.filter(loc => loc.isCurrent)[0]
  var current = {
    name: 'Current location',
    position: { lat: 0, long: 0 },
    isCurrent: true,
  }
  if (oldLocation) {
    current.default = oldLocation.default
  } else {
    current.default = false
  }
  locationsList.value = locationsList.value.filter(loc => !loc.isCurrent)
  //Skaffa användarens postion och namnet för platsen
  getPosition()
    .then(response => {
      current.position = response.position
      return getLocationName(current.position)
    })
    .then(locResponse => {
      current.name = locResponse
      let index = locationsList.value.findIndex(loc => loc.isCurrent)
      if (index > -1) {
        locationsList.value.splice(index, 1, current)
      } else {
        locationsList.value.unshift(current)
      }
      localStorage.setItem('locations', JSON.stringify(locationsList.value))
    })
    .catch(err => {
      console.error('Failed to retrieve current location: ', err)
      let index = locationsList.value.findIndex(loc => loc.isCurrent)
      if (index > -1) {
        locationsList.value.splice(index, 1)
        localStorage.setItem('locations', JSON.stringify(locationsList.value))
      }
    })
})

//Funktion för att rensa lägg-till formuläret
function resetForm() {
  location.value = { name: '', position: { lat: 0, long: 0 }, default: false }
}

//Funktion för att ta bort en sparad plats
function deleteLocation(index) {
  if (locationsList.value[index].default) {
    locationsList.value.splice(index, 1)
    if (locationsList.value.length > 0) {
      locationsList.value[0].default = true
    }
  } else {
    locationsList.value.splice(index, 1)
  }
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

//Funktion för att spara en ny plats
function addLocation() {
  var newLocation = {
    name: location.value.name,
    position: {
      lat: location.value.position.lat,
      long: location.value.position.long,
    },
    default: false,
  }
  if (locationsList.value.length == 0) {
    newLocation.default = true
  }
  locationsList.value.push(newLocation)
  resetForm()
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

//Funktion för att välja en plats att se vädret på
function selectLocation(loc) {
  locationsList.value.forEach(item => {
    item.default = item === loc
  })
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
  router.push(`/forecast/${loc.name}`)
}
</script>

<template>
  <!-- Form för att spara en ny plats -->
  <h2>Locations</h2>
  <label>Namn: <input type="text" id="form" v-model="location.name" /></label>
  <label
    >Lat:
    <input
      type="number"
      id="form"
      max="90"
      min="-90"
      step=".1"
      size="5"
      v-model="location.position.lat"
  /></label>
  <label
    >Lat:
    <input
      type="number"
      id="form"
      max="180"
      min="-180"
      step=".1"
      size="5"
      v-model="location.position.long"
  /></label>
  <!-- Knappar -->
  <button @click="addLocation()">Save</button>
  <button @click="resetForm()">Reset</button>
  <hr />
  <h2>List</h2>
  <ul>
    <!-- Skriver ut alla sparade platser med deras namn, koordinater och knappar -->
    <li v-for="(loc, index) in locationsList" :key="loc">
      <span
        @click="selectLocation(loc)"
        :class="loc.default ? 'info default' : 'info'"
      >
        {{ loc.name }}
        ({{ Math.abs(loc.position.lat).toFixed(2) }}°{{
          loc.position.lat > 0 ? 'N' : 'S'
        }}
        {{ Math.abs(loc.position.long).toFixed(2) }}°{{
          loc.position.long > 0 ? 'W' : 'E'
        }})
      </span>
      <span
        v-show="loc.name !== 'Current location'"
        class="remove"
        @click="deleteLocation(index)"
        ><img
          src="../assets/images/delete.png"
          class="icons"
          alt="Trashcan Image"
      /></span>
    </li>
  </ul>
</template>

<style scoped>
hr {
  margin-top: 1em;
}
ul {
  list-style-type: none;
}
label {
  display: block;
  width: 15em;
  padding-top: 0.5em;
}
.info:hover {
  background-color: gray;
  cursor: pointer;
}
h2 {
  padding: 0.5em;
}
.default {
  font-weight: bold;
}
.icons {
  max-width: 1.5%;
  cursor: pointer;
}
</style>
