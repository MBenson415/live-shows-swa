<template>
  <div>
    <form @submit.prevent="handleVenueSubmit" class="venues-form">

      <h2>Add Venue</h2>
      <div class="map-search-container">
        <GmapAutocomplete class="map-search-box" @place_changed='setPlace' />
        <button @click='addMarker'>
          Add
        </button>
      </div>
      <br>
      <GmapMap :center='center' :zoom='12' class="GmapMap">
        <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" @click="center = m.position" />
      </GmapMap>
      <div class="venues-form-group" @submit.prevent="handleVenueSubmit">
        <label for="venue-name">Venue Name: </label>
        <input v-model="name" id="venue-name" type="text" required class="venue-inputs" />
      </div>
      <div class="venues-form-group">
        <label for="street">Street: </label>
        <input v-model="street" id="street" type="text" required class="venue-inputs"/>
      </div>
      <div class="venues-form-group">
        <label for="city">City: </label>
        <input v-model="city" id="city" type="text" required class="venue-inputs"/>
      </div>
      <div class="venues-form-group">
        <label for="state">State: </label>
        <input v-model="state" id="state" type="text" maxlength="2" required class="venue-inputs"/>
      </div>
      <div class="venues-form-group">
        <label for="zip">ZIP Code: </label>
        <input v-model="zipcode" id="zip" type="number" maxlength="5" required class="venue-inputs"/>
      </div>
      <div class="venues-form-group">
        <label for="country">Country: </label>
        <input v-model="country" id="country" type="text" maxlength="55" required class="venue-inputs" />
      </div>
      <button class="venues-button" type="submit">Add Venue</button>
    </form>

    <h2>All Venues</h2>
    <ul class="venues-list">
        <li v-for="(venue, index) in venues" :key="venue.id" class="venues-item">
          <p><strong>{{ venue.NAME }}</strong><a :href="`${ venue.GOOGLE_MAPS_LINK }`" target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" class="google-maps-icon"></a></p>
          <P>
          {{ venue.STREET }} <br>
          {{ venue.CITY }}, {{ venue.STATE }} {{ venue.ZIP }}<br>
          {{venue.COUNTRY}}</p>
          <button class="venues-delete-button" @click="confirmDelete(venue.id, index)">Delete</button>
        </li>
      </ul>
    
  </div>
</template>

<script>
import axios from "axios";
import "./GoogleMap.css";
import FetchDataWithParams from "../functions/FetchDataWithParams";

const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:8080/data-api"
  : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";


export default {
  name: 'GoogleMap',

  data() {
    return {
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      markers: [],
      places: [],
      name: null,
      street: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
      venues: [],
    }
  },
  mounted() {
    this.geolocate();
    this.fetchVenues();
  },

  methods: {
    setPlace(place) {
      this.currentPlace = place;
      this.name = place.name;
      this.formatted_address = place.formatted_address;
      this.split_formatted_address = this.formatted_address.split(", ");
      this.street = this.split_formatted_address[0];
      this.city = this.split_formatted_address[1];
      this.state = this.split_formatted_address[2].split(" ")[0];
      this.zipcode = this.split_formatted_address[2].split(" ")[1];
      this.country = this.split_formatted_address[3];
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },

    async handleVenueSubmit() {
      try {
        await axios.post(`${baseURL}/rest/Venues`, {
        NAME: this.name,
        STREET: this.street,
        CITY: this.city,
        STATE: this.state,
        ZIP: this.zipcode,
        COUNTRY: this.country,
      });
        this.fetchVenues();
        this.resetVenueForm();
      } catch (error) {
        console.error("Error adding venue:", error);
      }
    },
  
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
    }


  },
};


</script>