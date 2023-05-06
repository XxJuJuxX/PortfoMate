import { MongoClient, ServerApiVersion } from "mongodb";

const mb_username= "groupprojectuser";
const mb_pass = "newpassword";
const uri = `mongodb+srv://${mb_username}:${mb_pass}@fgpprojectdata.avuox8z.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connect() {
    //boolean if worker is connected or not connected
    try {
        await client.connect();
        console.log("Connected successfully to database");
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
    }
    return client;
}

export { connect };