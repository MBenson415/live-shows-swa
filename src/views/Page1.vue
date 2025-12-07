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
          <input v-model="newBand.NAME" id="band-name" type="text" required />
        </div>
        <button class="page1-button" type="submit">Add Band</button>
      </form>

      <!-- Add Venue Form -->
      <form @submit.prevent="handleVenueSubmit" class="page1-form">
        <h2>Add Venue</h2>
        <div class="page1-form-group">
          <label for="venue-name">Venue Name:</label>
          <input v-model="newVenue.NAME" id="venue-name" type="text" required />
        </div>
        <div class="page1-form-group">
          <label for="street">Street (Number and Name):</label>
          <input v-model="newVenue.STREET" id="street" type="text" required />
        </div>
        <div class="page1-form-group">
          <label for="city">City:</label>
          <input v-model="newVenue.CITY" id="city" type="text" required />
        </div>
        <div class="page1-form-group">
          <label for="state">State (2 Characters):</label>
          <input
            v-model="newVenue.STATE"
            id="state"
            type="text"
            maxlength="2"
            required
          />
        </div>
        <div class="page1-form-group">
          <label for="zip">ZIP (5 Digits):</label>
          <input
            v-model="newVenue.ZIP"
            id="zip"
            type="number"
            maxlength="5"
            required
          />
        </div>
        <div class="page1-form-group">
          <label for="country">Country:</label>
          <input v-model="newVenue.COUNTRY" id="country" type="text" required />
        </div>
        <button class="page1-button" type="submit">Add Venue</button>
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
          <strong>{{ band.name }}</strong>
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

import FetchData from "../functions/FetchData";
import { API_BASE_URL } from "../config/api";

export default {
  components: {
    Sidebar,
  },
  name: "Page1",
  data() {
    return {
      newBand: {
        NAME: "",
      },
      newVenue: {
        NAME: "",
        STREET1: "",
        STREET2: "",
        STATE: "",
        ZIP: "",
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
        const bandsResponse = await FetchData('Bands');
        const eventsResponse = await axios.get(`${API_BASE_URL}/rest/Events`);

        const bands = bandsResponse.map((band) => ({
          id: band.ID,
          name: band.NAME,
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
    },
    resetVenueForm() {
      this.newVenue = {
        NAME: "",
        STREET1: "",
        STREET2: "",
        STATE: "",
        ZIP: "",
      };
    },
    async handleBandSubmit() {
      try {
        console.log("Submitting band:", this.newBand);
        await axios.post(`${API_BASE_URL}/rest/Bands`, this.newBand);
        this.fetchBandsAndEvents();
        this.resetBandForm();
        console.log("Success!");
      } catch (error) {
        console.error("Error adding band:", error);
      }
    },
    async handleVenueSubmit() {
      try {
        console.log("Submitting venue:", this.newVenue); // Debugging log
        await axios.post(`${API_BASE_URL}/rest/Venues`, this.newVenue);
        this.resetVenueForm();
        console.log("Success!");
      } catch (error) {
        console.error("Error adding venue:", error.response?.data || error.message);
      }
    },
    async handleEventSubmit() {
      try {
        const response = await axios.post(`${API_BASE_URL}/Events`, this.newEvent);
        const band = this.bands.find((b) => b.id === this.newEvent.bandId);
        band.events.push(response.data);
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
        await axios.delete(`${API_BASE_URL}/Events/${eventId}`);
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
