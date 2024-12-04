<template>
  <div class="events-container">
    <Sidebar />
    <div class="events-main-content">
      <h1>Event Management</h1>

      <!-- Add Event Form -->
      <form @submit.prevent="handleEventSubmit" class="events-form">
        <h2>Add Event</h2>
        <div class="events-form-group">
          <label for="band">Select Band:</label>
          <select v-model="newEvent.bandId" id="band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="date">Event Date:</label>
          <input v-model="newEvent.date" id="date" type="date" required />
        </div>
        <div class="events-form-group">
          <label for="location">Select Venue:</label>
          <select v-model="newEvent.location" id="location" required>
            <option v-for="venue in venues" :key="venue.id" :value="venue.name">
              {{ venue.name }}
            </option>
          </select>
        </div>
        <button class="events-button" type="submit">Add Event</button>
      </form>

      <!-- Display Events -->
      <h2>Current Events</h2>
      <ul class="events-events-list">
        <li v-for="event in events" :key="event.id" class="events-event-item">
          <div>
            <strong>Band: {{ event.bandName }}</strong><br>
            Event Date: {{ event.date }} | Location: {{ event.location }}
          </div>
          <div class="events-action-buttons">
            <button class="events-edit-button" @click="editEvent(event)">Edit</button>
            <button class="events-delete-button" @click="deleteEvent(event.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import FetchData from "../functions/FetchData";
import "./Events.css";

const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:8080/data-api"
  : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

export default {
  components: {
    Sidebar,
  },
  name: "Events",
  data() {
    return {
      newEvent: {
        bandId: null,
        date: "",
        location: "",  // This will hold the name of the selected venue
      },
      events: [],
      bands: [],
      venues: [], // Store the list of venues
    };
  },
  mounted() {
    this.fetchBandsAndVenues();
  },
  methods: {
    async fetchBandsAndVenues() {
      try {
        const bandsResponse = await FetchData('Bands');
        const venuesResponse = await axios.get(`${baseURL}/rest/Venues`);
        const eventsResponse = await axios.get(`${baseURL}/rest/Events`);

        // Populate bands
        this.bands = bandsResponse.map((band) => ({
          id: band.ID,
          name: band.NAME,
        }));

        // Populate venues
        this.venues = venuesResponse.data.value.map(venue => ({
          id: venue.ID,
          name: venue.NAME,
        }));

        // Populate events and associate them with bands and venues
        this.events = eventsResponse.data.value.map(event => ({
          id: event.ID,
          bandId: event.bandId,
          bandName: this.bands.find(band => band.id === event.bandId)?.name,
          date: event.date,
          location: this.venues.find(venue => venue.id === event.locationId)?.name,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleEventSubmit() {
      try {
        const response = await axios.post(`${baseURL}/Events`, this.newEvent);
        this.events.push({
          ...this.newEvent,
          id: response.data.id,
          bandName: this.bands.find(band => band.id === this.newEvent.bandId)?.name,
        });
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
        await axios.delete(`${baseURL}/Events/${eventId}`);
        this.events = this.events.filter(event => event.id !== eventId);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
    editEvent(event) {
      this.newEvent = { ...event };
    },
  },
};
</script>
