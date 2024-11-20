<template>
  <div class="page1-container">
    <Sidebar />
    <div class="page1-main-content">
      <h1>Band and Event Management</h1>

      <!-- Add Band Form -->
      <form @submit.prevent="handleBandSubmit" class="page1-form">
        <h2>Add Band</h2>
        <div class="page1-form-group">
          <label for="band-name">Band Name:</label>
          <input v-model="newBand.name" id="band-name" type="text" required />
        </div>
        <div class="page1-form-group">
          <label for="genre">Genre:</label>
          <input v-model="newBand.genre" id="genre" type="text" required />
        </div>
        <button class="page1-button" type="submit">Add Band</button>
      </form>

      <!-- Add Event Form -->
      <form @submit.prevent="handleEventSubmit" class="page1-form">
        <h2>Add Event</h2>
        <div class="page1-form-group">
          <label for="band">Select Band:</label>
          <select v-model="newEvent.bandId" id="band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="page1-form-group">
          <label for="date">Event Date:</label>
          <input v-model="newEvent.date" id="date" type="date" required />
        </div>
        <div class="page1-form-group">
          <label for="location">Location:</label>
          <input v-model="newEvent.location" id="location" type="text" required />
        </div>
        <button class="page1-button" type="submit">Add Event</button>
      </form>

      <!-- Display Bands and Events -->
      <h2>Existing Bands and Events</h2>
      <ul class="page1-bands-list">
        <li v-for="band in bands" :key="band.id" class="page1-band-item">
          <strong>{{ band.name }} ({{ band.genre }})</strong>
          <ul class="page1-events-list">
            <li v-for="event in band.events" :key="event.id" class="page1-event-item">
              Event Date: {{ event.date }} | Location: {{ event.location }}
              <button class="page1-delete-button" @click="deleteEvent(event.id)">
                Delete Event
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import "./Page1.css";

const baseURL = "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api/rest"; // Declare baseURL here

export default {
  components: {
    Sidebar,
  },
  name: "Page1",
  data() {
    return {
      newBand: {
        name: "",
        genre: "",
      },
      newEvent: {
        bandId: null,
        date: "",
        location: "",
      },
      bands: [],
    };
  },
  mounted() {
    this.fetchBandsAndEvents();
  },
  methods: {
    async fetchBandsAndEvents() {
      try {
        const baseURL = "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";
        const bandsResponse = await axios.get(`${baseURL}/rest/Bands`);
        const eventsResponse = await axios.get(`${baseURL}/rest/Events`);


        console.log(bandsResponse);
        console.log(eventsResponse.body);
        // Map events to their respective bands
        const bands = bandsResponse.data.value.map((band) => ({
          id: band.ID, // Correcting the field name
          name: band.NAME, // Correcting the field name
          events: [],
        }));

        const events = eventsResponse.data.value;

        bands.forEach((band) => {
          band.events = events.filter((event) => event.bandId === band.id);
        });

        this.bands = bands;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    resetBandForm() {
      this.newBand.name = "";
      this.newBand.genre = "";
    },
    async handleEventSubmit() {
      try {
        const response = await axios.post(`${baseURL}/Events`, this.newEvent); // Use baseURL for Event post
        const band = this.bands.find((b) => b.id === this.newEvent.bandId);
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
        await axios.delete(`${baseURL}/Events/${eventId}`); // Use baseURL for Event delete
        this.bands.forEach((band) => {
          band.events = band.events.filter((event) => event.id !== eventId);
        });
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
  },
};
</script>
