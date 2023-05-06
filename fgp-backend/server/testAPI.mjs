import axios from "axios";

async function fetchHistoricalData(symbol) {
    try {
        const response = await axios.get(`http://localhost:3001/api/historical-prices/${symbol}`);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching historical data', error);
    }
}
fetchHistoricalData("WBTC");