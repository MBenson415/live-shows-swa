<template>
  <div class="bands-container">
    <div class="bands-main-content">
      <h1 class="bands-header">Band Management</h1>

      <!-- Add Band Form -->
      <form @submit.prevent="handleBandSubmit" class="bands-form">
        <h2>Add a new band</h2>
        <div class="bands-form-group">
          <label for="band-name">Band Name: </label>
          <input v-model="newBand.NAME" id="band-name" type="text" required />
        </div>
        <div class="bands-form-group">
          <label for="logo-image-link">Logo Image Link: </label>
          <input v-model="newBand.LOGO_IMAGE_LINK" id="logo-image-link" type="text" required />
        </div>
        <button class="bands-button" type="submit">Add Band</button>
        <button class="azure-storage-button" onclick=" window.open('https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2F4c6dabdd-a6e5-4e06-be96-74b110203a4a%2FresourceGroups%2Fretrieveshowsapi%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fsquarespacemusic/path/%24web/etag/%220x8DD254A2FE12B12%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride~/false/defaultId//publicAccessVal/Blob`','_blank')" >Open Azure Storage</button>
      </form>

      <!-- Display and Manage Bands -->
      <h2>All Bands</h2>
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
        <div class="bands-form-group">
          <label for="edit-logo-image-link">Logo Image Link: </label>
          <input
            v-model="editingBand.LOGO_IMAGE_LINK"
            id="edit-logo-image-link"
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
        LOGO_IMAGE_LINK: "",
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
          logo_image_link: band.LOGO_IMAGE_LINK,
        }));
      } catch (error) {
        console.error("Error fetching bands:", error);
      }
    },
    resetBandForm() {
      this.newBand.NAME = "";
      this.newBand.LOGO_IMAGE_LINK = "";
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
          LOGO_IMAGE_LINK: this.editingBand.LOGO_IMAGE_LINK,
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
