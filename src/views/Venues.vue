<template>
  <div class="venues-container">
    <div class="venues-main-content">
      <h1>Venue Management</h1>

      <!-- Add Venue Form -->
      <form @submit.prevent="handleVenueSubmit" class="venues-form">
        <h2>Add Venue</h2>
        <div class="venues-form-group">
          <label for="venue-name">Venue Name: </label>
          <input v-model="newVenue.NAME" id="venue-name" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="street">Street (Number and Name): </label>
          <input v-model="newVenue.STREET" id="street" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="city">City: </label>
          <input v-model="newVenue.CITY" id="city" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="state">State (2 Characters): </label>
          <input v-model="newVenue.STATE" id="state" type="text" maxlength="2" required />
        </div>
        <div class="venues-form-group">
          <label for="zip">ZIP (5 Digits): </label>
          <input v-model="newVenue.ZIP" id="zip" type="number" maxlength="5" required />
        </div>
        <div class="venues-form-group">
          <label for="country">Country: </label>
          <input v-model="newVenue.COUNTRY" id="country" type="text" maxlength="55"  required />
        </div>
        <button class="venues-button" type="submit">Add Venue</button>
      </form>

      <!-- Display and Manage Venues -->
      <h2>All Venues</h2>
      <ul class="venues-list">
        <li v-for="(venue, index) in venues" :key="venue.id" class="venues-item">
          <p><strong>{{ venue.NAME }}</strong><a :href="`${ venue.GOOGLE_MAPS_LINK }`" target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" class="google-maps-icon"></a></p>
          <P>
          {{ venue.STREET }} <br>
          {{ venue.CITY }}, {{ venue.STATE }} {{ venue.ZIP }}<br>
          {{venue.COUNTRY}}</p>
          <button class="venues-edit-button" @click="editVenue(venue)">Edit</button>
          <button class="venues-delete-button" @click="confirmDelete(venue.id, index)">Delete</button>
        </li>
      </ul>

      <!-- Edit Venue Form -->
      <form v-if="editingVenue" @submit.prevent="handleEditVenueSubmit" class="venues-form">
        <h2>Edit Venue</h2>
        <div class="venues-form-group">
          <label for="edit-venue-name">Venue Name: </label>
          <input v-model="editingVenue.NAME" id="edit-venue-name" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="edit-street">Street (Number and Name): </label>
          <input v-model="editingVenue.STREET" id="edit-street" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="edit-city">City: </label>
          <input v-model="editingVenue.CITY" id="edit-city" type="text" required />
        </div>
        <div class="venues-form-group">
          <label for="edit-state">State (2 Characters): </label>
          <input v-model="editingVenue.STATE" id="edit-state" type="text" maxlength="2" required />
        </div>
        <div class="venues-form-group">
          <label for="edit-zip">ZIP (5 Digits): </label>
          <input v-model="editingVenue.ZIP" id="edit-zip" type="number" maxlength="5" required />
        </div>
        <div class="venues-form-group">
          <label for="edit-country">Country: </label>
          <input v-model="editingVenue.COUNTRY" id="edit-country" type="text" maxlength="55" required />
        </div>
        <button class="venues-button" type="submit">Save Changes</button>
        <button class="venues-cancel-button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "./Venues.css";
import FetchDataWithParams from "../functions/FetchDataWithParams";

const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:8080/data-api"
  : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

export default {
  components: {
  },
  name: "Venues",
  data() {
    return {
      newVenue: {
        NAME: "",
        STREET: "",
        CITY: "",
        STATE: "",
        ZIP: "",
        COUNTRY: "",
      },
      venues: [],
      editingVenue: null,
    };
  },
  mounted() {
    this.fetchVenues();
  },
  methods: {
    async fetchVenues() {
      try {
        const response = await FetchDataWithParams("Venues", "STATE", "asc");
        this.venues = response.map((venue) => ({
          id: venue.ID,
          NAME: venue.NAME,
          STREET: venue.STREET,
          CITY: venue.CITY,
          STATE: venue.STATE,
          ZIP: venue.ZIP,
          COUNTRY: venue.COUNTRY,
          GOOGLE_MAPS_LINK: venue.GOOGLE_MAPS_LINK,
        }));
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    },
    resetVenueForm() {
      this.newVenue = {
        NAME: "",
        STREET: "",
        CITY: "",
        STATE: "",
        ZIP: null,
        COUNTRY: ""
      };
    },
    async handleVenueSubmit() {
      try {
        await axios.post(`${baseURL}/rest/Venues`, this.newVenue);
        this.fetchVenues();
        this.resetVenueForm();
      } catch (error) {
        console.error("Error adding venue:", error);
      }
    },
    async handleEditVenueSubmit() {
      try {
        await axios.patch(`${baseURL}/rest/Venues/ID/${this.editingVenue.id}`, this.editingVenue);
        this.fetchVenues();
        this.editingVenue = null;
      } catch (error) {
        console.error("Error updating venue:", error);
      }
    },
    editVenue(venue) {
      this.editingVenue = { ...venue };
    },
    cancelEdit() {
      this.editingVenue = null;
    },
    async deleteVenue(venueId, index) {
      try {
        await axios.delete(`${baseURL}/rest/Venues/ID/${venueId}`);
        console.log("Venue deleted", index)
        this.fetchVenues();
      } catch (error) {
        console.error("Error deleting venue:", error);
      }
    },
    confirmDelete(venueId, index) {
      if (confirm("Are you sure you want to delete this venue?")) {
        this.deleteVenue(venueId, index);
      }
    },
  },
};
</script>
