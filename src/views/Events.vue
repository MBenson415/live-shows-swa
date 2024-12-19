<template>
  <div class="events-container">
    <div class="events-main-content">
      <h1>Event Management</h1>

      <!-- Add Event Form -->
      <form v-if="!editingEvent" @submit.prevent="handleEventSubmit" class="events-form">
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
          <label for="venue">Select Venue:</label>
          <select v-model="newEvent.venueId" id="venue" required>
            <option v-for="venue in venues" :key="venue.id" :value="venue.id">
              {{ venue.name }}
            </option>
          </select>
        </div>
        <button class="events-button" type="submit">Add Event</button>
      </form>

      <!-- Edit Event Form -->
      <form v-else @submit.prevent="handleEditEventSubmit" class="events-form">
        <h2>Edit Event</h2>
        <div class="events-form-group">
          <label for="edit-band">Select Band:</label>
          <select v-model="newEvent.bandId" id="edit-band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="edit-date">Event Date:</label>
          <input v-model="newEvent.date" id="edit-date" type="date" required />
        </div>
        <div class="events-form-group">
          <label for="edit-venue">Select Venue:</label>
          <select v-model="newEvent.venueId" id="edit-venue" required>
            <option v-for="venue in venues" :key="venue.id" :value="venue.id">
              {{ venue.name }}
            </option>
          </select>
        </div>
        <button class="events-button" type="submit">Save Changes</button>
        <button class="events-cancel-button" @click="cancelEdit">Cancel</button>
      </form>

      <!-- Display Events -->
      <h2>Current Events</h2>
      <ul class="events-events-list">
        <li v-for="event in events" :key="event.id" class="events-event-item">
          <div>
            <strong>Band: {{ event.bandName }}</strong><br>
            Event Date: {{ formatDate(event.date) }} | Location: {{ event.location }}
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
import FetchData from "../functions/FetchData";
import "./Events.css";

const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:8080/data-api"
  : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

export default {
  name: "Events",
  data() {
    return {
      newEvent: {
        bandId: null,
        date: "",
        venueId: null,
      },
      events: [],
      bands: [],
      venues: [],
      editingEvent: null, // If not null, means we are editing
    };
  },
  mounted() {
    this.fetchBandsAndVenues();
  },
  methods: {
    async fetchBandsAndVenues() {
      try {
        const bandsResponse = await FetchData("Bands");
        const venuesResponse = await axios.get(`${baseURL}/rest/Venues`);
        const eventsResponse = await axios.get(`${baseURL}/rest/Events`);

        this.bands = bandsResponse.map((band) => ({
          id: band.ID,
          name: band.NAME,
        }));

        this.venues = venuesResponse.data.value.map(venue => ({
          id: venue.ID,
          name: venue.NAME,
        }));

        this.events = eventsResponse.data.value.map(event => ({
          id: event.ID,
          bandId: event.BAND_ID,
          bandName: this.bands.find(band => band.id === event.BAND_ID)?.name,
          date: event.DATE,
          venueId: event.VENUE_ID,
          location: this.venues.find(venue => venue.id === event.VENUE_ID)?.name,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleEventSubmit() {
      try {
        const requestData = {
          BAND_ID: this.newEvent.bandId,
          DATE: this.newEvent.date,
          VENUE_ID: this.newEvent.venueId,
        };

        const response = await axios.post(`${baseURL}/rest/Events`, requestData);
        this.events.push({
          id: response.data.id,
          bandId: this.newEvent.bandId,
          bandName: this.bands.find(band => band.id === this.newEvent.bandId)?.name,
          date: this.newEvent.date,
          venueId: this.newEvent.venueId,
          location: this.venues.find(venue => venue.id === this.newEvent.venueId)?.name,
        });
        this.resetEventForm();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    },
    resetEventForm() {
      this.newEvent.bandId = null;
      this.newEvent.date = "";
      this.newEvent.venueId = null;
      this.editingEvent = null;
    },
    async deleteEvent(eventId) {
      try {
        const deleteUrl = `${baseURL}/rest/Events/ID/${eventId}`;
        await axios.delete(deleteUrl);
        this.events = this.events.filter(event => event.id !== eventId);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
    editEvent(event) {
      // Populate newEvent with existing event's data to edit
      this.newEvent.bandId = event.bandId;
      this.newEvent.date = event.date?.split('T')[0] || ""; // Just the date part if ISO
      this.newEvent.venueId = event.venueId;
      this.editingEvent = event; 
    },
    async handleEditEventSubmit() {
      try {
        const requestData = {
          BAND_ID: this.newEvent.bandId,
          DATE: this.newEvent.date,
          VENUE_ID: this.newEvent.venueId,
        };

        const editUrl = `${baseURL}/rest/Events/ID/${this.editingEvent.id}`;
        await axios.patch(editUrl, requestData);

        // Update the event in the local array
        const index = this.events.findIndex(e => e.id === this.editingEvent.id);
        if (index !== -1) {
          this.events[index].bandId = this.newEvent.bandId;
          this.events[index].bandName = this.bands.find(band => band.id === this.newEvent.bandId)?.name;
          this.events[index].date = this.newEvent.date;
          this.events[index].venueId = this.newEvent.venueId;
          this.events[index].location = this.venues.find(venue => venue.id === this.newEvent.venueId)?.name;
        }

        this.resetEventForm();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    cancelEdit() {
      this.resetEventForm();
    },
    formatDate(isoDate) {
      if (!isoDate) return "";

      const [datePart, timePart] = isoDate.split('T');
      if (!datePart) return isoDate;

      const [year, month, day] = datePart.split('-');
      let formattedDate = `${month}/${day}/${year}`;

      if (timePart && !timePart.startsWith("00:00:00")) {
        // Optional: handle time if needed
      }

      return formattedDate;
    },
  },
};
</script>
