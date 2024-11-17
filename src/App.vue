<template>
  <div class="app-container">
    <Sidebar />
    <div>
      <h1>Band and Event Management</h1>

      <!-- Add Band Form -->
      <form @submit.prevent="handleBandSubmit">
        <h2>Add Band</h2>
        <div class="form-group">
          <label for="band-name">Band Name:</label>
          <input v-model="newBand.name" id="band-name" type="text" required />
        </div>
        <div class="form-group">
          <label for="genre">Genre:</label>
          <input v-model="newBand.genre" id="genre" type="text" required />
        </div>
        <button type="submit">Add Band</button>
      </form>

      <!-- Add Event Form -->
      <form @submit.prevent="handleEventSubmit">
        <h2>Add Event</h2>
        <div class="form-group">
          <label for="band">Select Band:</label>
          <select v-model="newEvent.bandId" id="band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="date">Event Date:</label>
          <input v-model="newEvent.date" id="date" type="date" required />
        </div>
        <div class="form-group">
          <label for="location">Location:</label>
          <input v-model="newEvent.location" id="location" type="text" required />
        </div>
        <button type="submit">Add Event</button>
      </form>

      <!-- Display Bands and Events -->
      <h2>Existing Bands and Events</h2>
      <ul>
        <li v-for="band in bands" :key="band.id">
          <strong>{{ band.name }} ({{ band.genre }})</strong>
          <ul>
            <li v-for="event in band.events" :key="event.id">
              Event Date: {{ event.date }} | Location: {{ event.location }}
              <button @click="deleteEvent(event.id)">Delete Event</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Sidebar,
  },
  name: "App",
  data() {
    return {
      newBand: {
        name: "",
        genre: ""
      },
      newEvent: {
        bandId: null,
        date: "",
        location: ""
      },
      bands: []
    };
  },
  mounted() {
    this.fetchBandsAndEvents();
  },
  methods: {
    async fetchBandsAndEvents() {
      try {
        const bandsResponse = await axios.get("/rest/Bands");
        const eventsResponse = await axios.get("/rest/Events");

        // Map events to their respective bands
        const bands = bandsResponse.data.items;
        const events = eventsResponse.data.items;
        bands.forEach(band => {
          band.events = events.filter(event => event.bandId === band.id);
        });
        this.bands = bands;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleBandSubmit() {
      try {
        const response = await axios.post("/rest/Bands", this.newBand);
        this.bands.push({ ...response.data, events: [] }); // Add empty events array
        this.resetBandForm();
      } catch (error) {
        console.error("Error adding band:", error);
      }
    },
    resetBandForm() {
      this.newBand.name = "";
      this.newBand.genre = "";
    },
    async handleEventSubmit() {
      try {
        const response = await axios.post("/rest/Events", {
          ...this.newEvent,
          bandId: this.newEvent.bandId
        });
        const band = this.bands.find(b => b.id === this.newEvent.bandId);
        band.events.push(response.data); // Add the event to the selected band
        this.resetEventForm();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    },
    resetEventForm() {
      this.newEvent.bandId = null;
      this.newEvent.date = "";
      this.newEvent.location = "";
    },
    async deleteEvent(eventId) {
      try {
        await axios.delete(`/rest/Events/${eventId}`);
        this.bands.forEach(band => {
          band.events = band.events.filter(event => event.id !== eventId);
        });
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  margin: auto;
  display: flex;
  margin-left: 200px;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.form-group {
  margin-bottom: 1rem;
}
button {
  margin-top: 1rem;
}
</style>
