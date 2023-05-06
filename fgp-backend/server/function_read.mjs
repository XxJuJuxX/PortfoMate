import { connect } from "./connection_db.mjs";

async function readHistoricalData(symbol) {

    const client = await connect();
    try {
        const db = client.db("cryptodata");
        const collection = db.collection("historicalprices");
        
        const data = await collection.findOne({ symbol: symbol });

    if (data) {
      return data.historicalData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error reading historical data from the database", error);
    throw error;
  } finally {
    await client.close();
  }
}

export { readHistoricalData };