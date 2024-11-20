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
        <tr v-for="band in bands" :key="band.id">
          <td>{{ band.id }}</td>
          <td>{{ band.name }}</td>
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
        <tr v-for="venue in venues" :key="venue.id">
          <td>{{ venue.id }}</td>
          <td>{{ venue.name }}</td>
          <td>{{ venue.location }}</td>
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
import axios from "axios";
import FetchData from "../functions/FetchData";

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
        const baseURL = "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api/rest";

        const [bandsResponse, venuesResponse, eventsResponse] = await Promise.all([
          axios.get(`${baseURL}/Bands`),
          axios.get(`${baseURL}/Venues`),
          axios.get(`${baseURL}/Events`),
        ]);

        const bands = await FetchData('bands');
        const venues = await FetchData('venues');
        const events = await FetchData('events');

        console.log( bands, venues, events);

        // Assign data to variables
        this.bands = bandsResponse.data.value || [];
        this.venues = venuesResponse.data.value || [];
        this.events = eventsResponse.data.value || [];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>

<style scoped>
.page2-container {
  padding: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.data-table th {
  background-color: #f4f4f4;
}
</style>
