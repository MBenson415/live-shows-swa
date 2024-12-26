<template>
  <div class="page2-container">
    <h1>Page 2</h1>
    <p>Welcome to Page 2! Below is the data from the database:</p>

    <!-- Bands Table -->
    <h2>Bands</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="band in bands" :key="band.ID">
          <td>{{ band.ID }}</td>
          <td>{{ band.NAME }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Venues Table -->
    <h2>Venues</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="venue in venues" :key="venue.ID">
          <td>{{ venue.ID }}</td>
          <td>{{ venue.NAME }}</td>
          <td>{{ venue.STREET }}, {{ venue.CITY }}, {{ venue.STATE }} {{ venue.ZIP }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Events Table -->
    <h2>Events</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Band ID</th>
          <th>Date</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in events" :key="event.id">
          <td>{{ event.id }}</td>
          <td>{{ event.bandId }}</td>
          <td>{{ event.date }}</td>
          <td>{{ event.location }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//import axios from "axios";
import FetchData from "../functions/FetchData";
import "./Page2.css";
//const baseURL = "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api/rest";
//const baseURL = "http://localhost:8080/data-api/rest";

export default {
  name: "Page2",
  data() {
    return {
      bands: [],
      venues: [],
      events: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Fetch data from the database

        /*
        const [venuesResponse] = await Promise.all([
          axios.get(`${baseURL}/Venues`),
        ]);
        const bandsResponse = await axios.get(`${baseURL}/Bands`);
        const eventsResponse = await axios.get(`${baseURL}/Events`);
        console.log(bandsResponse.data.value);
        */

        const bands = await FetchData('Bands');
        const venues = await FetchData('Venues');
        const events = await FetchData('Events');

        console.log(bands);
        console.log(venues);
        console.log(events);


        // Assign data to variables
        this.bands = bands || [];
        this.venues = venues || [];
        this.events = events || [];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>

