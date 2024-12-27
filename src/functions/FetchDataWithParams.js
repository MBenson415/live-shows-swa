import axios from 'axios';

// Conditionally set the baseURL for the database
const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:8080/data-api"
  : "https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api";

const FetchDataWithParams = async (valueType, orderBy, orderByOrder) => {
  try {
    // Validate the valueType to ensure it's one of the expected types
    if (!['Bands', 'Venues', 'Events'].includes(valueType)) {
      throw new Error("Invalid value type. Must be 'bands', 'venues', or 'events'.");
    }

    const response =  await axios.get(`${baseURL}/rest/${valueType}?$orderby=${orderBy}%20${orderByOrder}`)

    
    console.log(response.data.value); // Log the fetched data

    // Process the data based on the type
    if (valueType === 'Bands') {
      return response.data.value;
    } else if (valueType === 'Venues') {
      return response.data.value;
    } else if (valueType === 'Events') {
      return response.data.value;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchDataWithParams;