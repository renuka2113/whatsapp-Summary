// import NestedChatGroup from "./models/messages.js";

// const doc = new NestedChatGroup(data);
// await doc.save();

import mongoose from "mongoose";
import dotenv from "dotenv";
import NestedChatGroup from "./models/messages.js"; // your schema file
// import data from "./data.json" assert { type: "json" }; // your actual JSON

dotenv.config();

async function insertData() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // 2. Insert the data
    const data = {
      groupid: 1,
      "date:26/6/2025": {
        users: {
          "userid: 2": {
            messages: [
              "Deploy team to checkpoint A.",
              "Confirm barricades in place.",
            ],
            timestamp: ["2025-06-26T06:00:00Z", "2025-06-26T06:15:00Z"],
          },
        },
      },
    };
    const doc = new NestedChatGroup(data);
    await doc.save();
    console.log("✅ Data inserted successfully");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    // 3. Close connection
    await mongoose.disconnect();
  }
}

insertData();
