<template>
    <div>
      <div class="map-search-container">
        <h2>Search for a venue</h2>
        <GmapAutocomplete class="map-search-box"
          @place_changed='setPlace'
        />
        <button
          @click='addMarker'
        >
          Add
        </button>
      </div>
      <br>
      <GmapMap
        :center='center'
        :zoom='12'
        style='width:100%;  height: 400px;'
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          @click="center=m.position"
        />
      </GmapMap>
      <AddressPrint class="address">
            Name: {{ name }}<br>
            Street: {{ street }}<br>
            City: {{ city }}<br>
            State: {{ state }}<br>
            Zip Code: {{ zipcode }}<br>
            Country: {{ country }}<br>
      </AddressPrint>
    </div>
  </template>
  
  <script>
  import "./GoogleMap.css"
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
      }
    },
    mounted() {
      this.geolocate();
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
        console.log("Name: "+this.name);
        console.log("Address:"+ this.formatted_address);
        console.log("Street:"+ this.street);
        console.log("City:"+ this.city);
        console.log("State:"+ this.state);
        console.log("Zip Code:"+ this.zipcode);
        console.log("Country:"+ this.country);
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
      geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      },
    },
  };
  </script>