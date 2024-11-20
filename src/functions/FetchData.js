import axios from 'axios';

const baseURL = "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

const FetchData = async (valueType) => {
  try {
    // Validate the valueType to ensure it's one of the expected types
    if (!['bands', 'venues', 'events'].includes(valueType)) {
      throw new Error("Invalid value type. Must be 'bands', 'venues', or 'events'.");
    }

    const response = await axios.get(`${baseURL}/rest/${valueType}`);
    
    console.log(response.data); // Log the fetched data

    // Process the data based on the type
    if (valueType === 'bands') {
      return response.data.value.map((band) => ({
        id: band.ID, // Assuming the field name is ID
        name: band.NAME, // Assuming the field name is NAME
        events: [], // Placeholder for events
      }));
    } else if (valueType === 'venues') {
      return response.data.value.map((venue) => ({
        id: venue.ID, // Assuming the field name is ID
        name: venue.NAME, // Assuming the field name is NAME
        location: venue.LOCATION, // Assuming there's a LOCATION field
      }));
    } else if (valueType === 'events') {
      return response.data.value.map((event) => ({
        id: event.ID, // Assuming the field name is ID
        name: event.NAME, // Assuming the field name is NAME
        bandId: event.BAND_ID, // Assuming there's a BAND_ID field
        venueId: event.VENUE_ID, // Assuming there's a VENUE_ID field
      }));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchData;