import express from "express";
import { connect } from "./connection_db.mjs";
import cors from "cors";
import {readHistoricalData} from "./function_read.mjs";

// issue of scope for error otherwise side not.
let symbol;
const app = express();
app.use(cors());
const port = 3001;

app.get("/api/coins/list", async (req, res) => {
  try {
    const client = await connect();
    const db = client.db("cryptodata");
    const collection = db.collection("historicalprices");

    const symbols = await collection.distinct('symbol');
    res.json(symbols);
  } catch (error) {
    console.error("Error fetching coin list", error);
    res.status(500).json({ error: "Failed to read & load coin list" });
  }
});

app.get("/api/historical-prices/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const client = await connect();
      const historicalData = await readHistoricalData(symbol);
  
      if (historicalData) {
        res.json(historicalData);
      } else {
        res.status(404).json({ error: `No historical data found for ${symbol}`});
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}`, error);
      res.status(500).json({ error: "Failed to read & load historical data" });
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
