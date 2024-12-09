<template>
  <div class="bands-container">
    <div class="bands-main-content">
      <h1 class="bands-header">Band Management</h1>

      <!-- Add Band Form -->
      <form @submit.prevent="handleBandSubmit" class="bands-form">
        <h2>In a new band? Add it to the list here!</h2>
        <div class="bands-form-group">
          <label for="band-name">Band Name: </label>
          <input v-model="newBand.NAME" id="band-name" type="text" required />
        </div>
        <button class="bands-button" type="submit">Add Band</button>
      </form>

      <!-- Display and Manage Bands -->
      <h2>Existing Bands</h2>
      <h3>Here's a list of the current bands listed in the database. 
        <br>Edit using the edit button. Delete using the delete button.
      </h3>
      <ul class="bands-list">
        <li v-for="(band, bandIndex) in bands" :key="band.id" class="bands-item">
          <strong class="band-name">{{ band.name }}</strong>
          <button class="bands-edit-button" @click="editBand(band)">Edit</button>
          <button class="bands-delete-button" @click="deleteBand(band.id, bandIndex)">
            Delete
          </button>
        </li>
      </ul>

      <!-- Edit Band Form -->
      <form v-if="editingBand" @submit.prevent="handleEditBandSubmit" class="bands-form">
        <h2>Edit Band</h2>
        <div class="bands-form-group">
          <label for="edit-band-name">Band Name: </label>
          <input
            v-model="editingBand.NAME"
            id="edit-band-name"
            type="text"
            required
          />
        </div>
        <button class="bands-button" type="submit">Save Changes</button>
        <button class="bands-cancel-button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "./Bands.css";

import FetchData from "../functions/FetchData";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080/data-api"
    : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

export default {
  components: {
  },
  name: "Bands",
  data() {
    return {
      newBand: {
        NAME: "",
      },
      bands: [],
      editingBand: null, // Stores the band being edited
    };
  },
  mounted() {
    this.fetchBands();
  },
  methods: {
    async fetchBands() {
      try {
        const bandsResponse = await FetchData("Bands");
        this.bands = bandsResponse.map((band) => ({
          id: band.ID,
          name: band.NAME,
        }));
      } catch (error) {
        console.error("Error fetching bands:", error);
      }
    },
    resetBandForm() {
      this.newBand.NAME = "";
    },
    async handleBandSubmit() {
      try {
        await axios.post(`${baseURL}/rest/Bands`, this.newBand);
        this.fetchBands();
        this.resetBandForm();
        console.log("Band added successfully!");
      } catch (error) {
        console.error("Error adding band:", error.response?.data || error.message);
      }
    },
    async deleteBand(bandId, bandIndex) {
      try {
        console.log(`Attempting to delete Band ID: ${bandId} at index: ${bandIndex}`);
        const confirmed = window.confirm("Are you sure you want to delete this band?");
        if (!confirmed) return;

        // Update URL to include filtering
        const deleteUrl = `${baseURL}/rest/Bands/ID/${bandId}`;

        // Perform the DELETE request
        const response = await axios.delete(deleteUrl);
        console.log("Request sent successfully:", response.config);

        this.fetchBands();
        console.log("Band deleted successfully!");
      } catch (error) {
        console.error("Error deleting band:", error.response?.data || error.message);
        console.error("Request Details:", error.config); // Log request config for debugging
      }
    },
    editBand(band) {
      this.editingBand = { ...band }; // Create a copy of the band for editing
    },
    async handleEditBandSubmit() {
      try {
        await axios.patch(`${baseURL}/rest/Bands/ID/${this.editingBand.id}`, {
          NAME: this.editingBand.NAME,
        });
        this.fetchBands();
        this.editingBand = null; // Exit edit mode
        console.log("Band updated successfully!");
      } catch (error) {
        console.error("Error updating band:", error.response?.data || error.message);
      }
    },
    cancelEdit() {
      this.editingBand = null;
    },
  },
};
</script>
