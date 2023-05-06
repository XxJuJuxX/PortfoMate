import axios from "axios";
import { connect } from "./connection_db.mjs";

// uniswap v3 subgraph
const uniswapurl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
//ccryptocurrency list
const cryptoCurrencies = [
    { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"},
    { symbol: "BNB", address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"},
    { symbol: "WXRP", address: "0x39fBBABf11738317a448031930706cd3e612e1B9"},
    { symbol: "STAKE", address: "0x0Ae055097C6d159879521C384F1D2123D1f195e6"},
    { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"},
    { symbol: "stETH", address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"},
    { symbol: "MATIC", address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"},
    { symbol: "SOL", address: "0xD31a59c85aE9D8edEFeC411D448f90841571b89c"},
    { symbol: "BUSD", address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53"},
    { symbol: "HEX", address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39"},
    { symbol: "RARI", address: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF"},
    { symbol: "SAITAMA", address: "0xCE3f08e664693ca792caCE4af1364D5e220827B2"},
    { symbol: "CRO", address: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b"},
    { symbol: "BDG", address: "0x1961B3331969eD52770751fC718ef530838b6dEE"},
    { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"},
    { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA"},
    { symbol: "DAI", address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"},
    { symbol: "NEXO", address: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206"},
    { symbol: "GRT", address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"},
    { symbol: "LPT", address: "0x58b6A8A3302369DAEc383334672404Ee733aB239"},
    { symbol: "COMP", address: "0xc00e94Cb662C3520282E6f5717214004A7f26888"},
    { symbol: "TRX", address: "0xf230b790E05390FC8295F4d3F60332c93BEd42e2"},
    { symbol:"GALA", address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA"},
    { symbol: "SUSHI", address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"},
    { symbol: "ENJ", address: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"},
    { symbol: "ELON", address: "0x761D38e5ddf6ccf6Cf7c55759d5210750B5D60F3"},
    { symbol: "CBETH", address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704"},
    { symbol: "LDO", address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32"},
    { symbol: "MKR", address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"},
    { symbol: "RPL", address: "0xD33526068D116cE69F19A9ee46F0bd304F21A51f"}
];

async function fetchData(tokenSymbol, tokenAddress) {
    try {
        const lowerTokenAddress = tokenAddress.toLowerCase();
        const query = `
            query {
                tokenDayDatas(first: 1000, where: {token: "${lowerTokenAddress}"}, orderBy: date, orderDirection: desc) {
                    date
                    token {
                        id
                        symbol
                    }
                    priceUSD
                } 
            }
        `;
        const response = await axios.post(uniswapurl, { query });
        if (response.data.errors) {
            console.log(`${tokenSymbol} error:`);
            console.log(response.data.errors);
            return;
        }
        console.log(`${tokenSymbol} hisorical prices`);

        // sometimes you get the data is equal to zero.
        const filteredData = response.data.data.tokenDayDatas.filter(item => parseFloat(item.priceUSD) !== 0);
        console.log(JSON.stringify(response.data, null, 2)); 
        return {
            data: {
                tokenDayDatas: filteredData
            }
        };

    } catch (error) {
        console.log(`Error fetching data for: ${tokenSymbol}`, error);
    }
}
// store object cryptos and the function to the database.
async function fetchAllCryptos() {
    let client;
    try {
        const client = await connect();
        const db = client.db("cryptodata"); // database name
        const collection = db.collection("historicalprices"); // database collection 

        await Promise.all(cryptoCurrencies.map(async (crypto) => {
            const data = await fetchData(crypto.symbol, crypto.address);
            if (data) {
                try {
                    const cryptoData = {
                        symbol: crypto.symbol,
                        address: crypto.address,
                        historicalData: data.data.tokenDayDatas
                    };
                    //Store the fetched data in collection with appropriate symbol
                    await collection.insertOne(cryptoData);
                    console.log(`Data for ${crypto.address} has been stored successfully.`);
                } catch (error) {
                    console.log(`Error storing ${crypto.historicalData}`, error);
                }
            }
        }));
    } catch (error) {
        console.log("Error fetching all cryptos", error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}
fetchAllCryptos();

