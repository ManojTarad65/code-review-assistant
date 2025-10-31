import { MongoClient } from "mongodb";

if (!process.env.MONGO_URL) {
  throw new Error("❌ Please add your Mongo URI to the .env file (MONGO_URL).");
}

const uri = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev mode, reuse the MongoClient across hot reloads to prevent too many connections.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, always create a new connection.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
