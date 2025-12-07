import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const FetchData = async (valueType) => {
  try {
    // Validate the valueType to ensure it's one of the expected types
    if (!['Bands', 'Venues', 'Events'].includes(valueType)) {
      throw new Error("Invalid value type. Must be 'bands', 'venues', or 'events'.");
    }

      const response = await axios.get(`${API_BASE_URL}/rest/${valueType}`)

    
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

export default FetchData;