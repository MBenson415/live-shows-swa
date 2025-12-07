<template>
  <div class="events-container">
    <div class="events-main-content">
      <h1>Event Management</h1>

      <!-- Add Event Form -->
      <form v-if="!editingEvent" @submit.prevent="handleEventSubmit" class="events-form" >

        <h2>Add Event</h2>
        <div class="events-form-group">
          <label for="event-name">Event Name: </label>
          <input v-model="newEvent.name" id="name" type="text" class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="band">Band: </label>
          <select v-model="newEvent.bandId" id="band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="date">Date: </label>
          <input v-model="newEvent.date" id="date" type="date" required />
        </div>
        <div class="events-form-group">
          <label for="venue">Venue: </label>
          <select v-model="newEvent.venueId" id="venue" required class="events-input">
            <option v-for="venue in venues" :key="venue.id" :value="venue.id">
              {{ venue.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="facebook-link">Facebook Link: </label>
          <input v-model="newEvent.facebook_link" id="facebook_link" type="text"  class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="ticket-link">Ticket Link: </label>
          <input v-model="newEvent.ticket_link" id="ticket_link" type="text"  class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="promo">Flyer Link: </label>
          <input v-model="newEvent.promo" id="promo" type="text"  class="events-input"/>
        </div>
        <button class="events-button" type="submit">Add Event</button>
        <button class="azure-storage-button" onclick=" window.open('https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2F4c6dabdd-a6e5-4e06-be96-74b110203a4a%2FresourceGroups%2Fretrieveshowsapi%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fsquarespacemusic/path/%24web/etag/%220x8DD254A2FE12B12%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride~/false/defaultId//publicAccessVal/Blob`','_blank')" >Open Azure Storage</button>

      </form>

      <!-- Edit Event Form -->
      <form v-else @submit.prevent="handleEditEventSubmit" class="events-form">
        <h2>Edit Event</h2>
        <div class="events-form-group">
          <label for="edit-event-name">Event Name: </label>
          <input v-model="newEvent.name" id="edit-name" type="text"   class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="edit-band">Band: </label>
          <select v-model="newEvent.bandId" id="edit-band" required>
            <option v-for="band in bands" :key="band.id" :value="band.id">
              {{ band.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="edit-date">Date: </label>
          <input v-model="newEvent.date" id="edit-date" type="date" required />
        </div>
        <div class="events-form-group">
          <label for="edit-venue">Venue: </label>
          <select v-model="newEvent.venueId" id="edit-venue" required>
            <option v-for="venue in venues" :key="venue.id" :value="venue.id">
              {{ venue.name }}
            </option>
          </select>
        </div>
        <div class="events-form-group">
          <label for="edit-facebook-link">Facebook Link: </label>
          <input v-model="newEvent.facebook_link" id="edit-facebook_link" type="text"   class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="edit-ticket-link">Ticket Link: </label>
          <input v-model="newEvent.ticket_link" id="edit-ticket_link" type="text"   class="events-input"/>
        </div>
        <div class="events-form-group">
          <label for="edit-promo">Flyer Link: </label>
          <input v-model="newEvent.promo" id="edit-promo" type="text"   class="events-input"/>
        </div>
        <button class="events-button" type="submit">Save Changes</button>
        <button class="azure-storage-button" onclick=" window.open('https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2F4c6dabdd-a6e5-4e06-be96-74b110203a4a%2FresourceGroups%2Fretrieveshowsapi%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fsquarespacemusic/path/%24web/etag/%220x8DD254A2FE12B12%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride~/false/defaultId//publicAccessVal/Blob`','_blank')" >Open Azure Storage</button>
        <button class="events-cancel-button" @click="cancelEdit">Cancel</button>
      </form>

      <!-- Display Events -->
      <h2>All Events</h2>
      <ul class="events-events-list">
        <li v-for="event in events" :key="event.id" class="events-event-item">
          <div>
            <strong>{{ event.bandName }}</strong><br>
            <i>{{ event.name }}</i><br>
            @ {{ event.location }} in {{ event.city }}, {{ event.state }} on {{ formatDate(event.date) }}
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

//construct date for REST API query parameters
const today = new Date(new Date().setDate(new Date().getDate() - 1));

const datetime = today.toISOString();

const dateonly = datetime.split('T')[0]

import { API_BASE_URL } from "../config/api";

//switch enviro dev or prod

export default {
  name: "Events",
  data() {
    return {
      newEvent: {
        name: "",
        bandId: null,
        date: "",
        venueId: null,
        facebook_link: "",
        ticket_link: "",
        promo: ""
      },
      name: [],
      events: [],
      bands: [],
      venues: [],
      facebook_link: [],
      ticket_link: [],
      promo: [],
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
        const venuesResponse = await axios.get(`${API_BASE_URL}/rest/Venues?$orderby=NAME%20%20asc`);
        const eventsResponse = await axios.get(`${API_BASE_URL}/rest/Events?$orderby=DATE%20%20asc&$filter=DATE%20gt%20`+ dateonly + `T00%3A00%3A00Z`);

        this.bands = bandsResponse.map((band) => ({
          id: band.ID,
          name: band.NAME,
        }));

        this.venues = venuesResponse.data.value.map(venue => ({
          id: venue.ID,
          name: venue.NAME,
          city: venue.CITY,
          state: venue.STATE
        }));

        this.events = eventsResponse.data.value.map(event => ({
          id: event.ID,
          name: event.NAME,
          bandId: event.BAND_ID,
          bandName: this.bands.find(band => band.id === event.BAND_ID)?.name,
          date: event.DATE,
          venueId: event.VENUE_ID,
          location: this.venues.find(venue => venue.id === event.VENUE_ID)?.name,
          city: this.venues.find(venue => venue.id === event.VENUE_ID)?.city,
          state: this.venues.find(venue => venue.id === event.VENUE_ID)?.state,
          facebook_link: event.FACEBOOK_LINK,
          ticket_link: event.TICKET_LINK,
          promo: event.PROMO,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleEventSubmit() {
      try {
        const requestData = {
          NAME: this.newEvent.name,
          BAND_ID: this.newEvent.bandId,
          DATE: this.newEvent.date,
          VENUE_ID: this.newEvent.venueId,
          FACEBOOK_LINK: this.newEvent.facebook_link,
          TICKET_LINK: this.newEvent.ticket_link,
          PROMO: this.newEvent.promo,
        };

        const response = await axios.post(`${API_BASE_URL}/rest/Events`, requestData);
        this.events.push({
          id: response.data.id,
          name: response.data.name,
          bandId: this.newEvent.bandId,
          bandName: this.bands.find(band => band.id === this.newEvent.bandId)?.name,
          date: this.newEvent.date,
          venueId: this.newEvent.venueId,
          location: this.venues.find(venue => venue.id === this.newEvent.venueId)?.name,
          facebook_link: response.facebook_link,
          ticket_link: response.ticket_link,
          promo: response.promo,
        });
        this.resetEventForm();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    },
    resetEventForm() {
      this.newEvent.name = "";
      this.newEvent.bandId = null;
      this.newEvent.date = "";
      this.newEvent.venueId = null;
      this.newEvent.facebook_link = "";
      this.newEvent.ticket_link = "";
      this.newEvent.promo = "";
      this.editingEvent = null;
    },
    async deleteEvent(eventId) {
      try {
        const deleteUrl = `${API_BASE_URL}/rest/Events/ID/${eventId}`;
        await axios.delete(deleteUrl);
        this.events = this.events.filter(event => event.id !== eventId);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
    editEvent(event) {
      // Populate newEvent with existing event's data to edit
      this.newEvent.name = event.name;
      this.newEvent.bandId = event.bandId;
      this.newEvent.date = event.date?.split('T')[0] || ""; // Just the date part if ISO
      this.newEvent.venueId = event.venueId;
      this.newEvent.facebook_link = event.facebook_link;
      this.newEvent.ticket_link = event.ticket_link;
      this.newEvent.promo = event.promo;
      this.editingEvent = event; 
    },
    async handleEditEventSubmit() {
      try {
        const requestData = {
          NAME: this.newEvent.name,
          BAND_ID: this.newEvent.bandId,
          DATE: this.newEvent.date,
          VENUE_ID: this.newEvent.venueId,
          FACEBOOK_LINK: this.newEvent.facebook_link,
          TICKET_LINK: this.newEvent.ticket_link,
          PROMO: this.newEvent.promo,
        };

        const editUrl = `${API_BASE_URL}/rest/Events/ID/${this.editingEvent.id}`;
        await axios.patch(editUrl, requestData);

        // Update the event in the local array
        const index = this.events.findIndex(e => e.id === this.editingEvent.id);
        if (index !== -1) {
          this.events[index].name = this.newEvent.name;
          this.events[index].bandId = this.newEvent.bandId;
          this.events[index].bandName = this.bands.find(band => band.id === this.newEvent.bandId)?.name;
          this.events[index].date = this.newEvent.date;
          this.events[index].venueId = this.newEvent.venueId;
          this.events[index].location = this.venues.find(venue => venue.id === this.newEvent.venueId)?.name;
          this.events[index].facebook_link = this.newEvent.facebook_link;
          this.events[index].ticket_link = this.newEvent.ticket_link;
          this.events[index].promo = this.newEvent.promo;
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
