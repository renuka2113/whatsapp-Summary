import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;
const SECRET = "ap-police-secret"; // your JWT secret

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://<username>:<password>@hackethon.qdczhgv.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  fullname: String,
  role: String,
  phoneNumber: String
});
const User = mongoose.model("User", userSchema, "Users");

// API 1: Generate token with fullname + role
app.post("/generate-token", (req, res) => {
  const { fullname, role } = req.body;
  const token = jwt.sign({ fullname, role }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// API 2: Receive message and assign task
app.post("/send-message", async (req, res) => {
  const { token, message } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);
    const senderRole = decoded.role;

    // Check if name is mentioned
    const mentionRegex = /@\w+/;
    const hasName = mentionRegex.test(message);

    if (hasName) {
      return res.json({ message: "Message contains name. No auto-assignment needed." });
    }

    // Define role hierarchy
    const roles = ["Constable", "Head Constable", "Sub Inspector", "Inspector", "DSP", "SP"];
    const senderIndex = roles.indexOf(senderRole);
    if (senderIndex === -1) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const lowerRoles = roles.slice(0, senderIndex);
    const available = await User.find({ role: { $in: lowerRoles } });

    if (available.length === 0) {
      return res.json({ message: "No junior officer found for assignment" });
    }

    const assigned = available[Math.floor(Math.random() * available.length)];
    return res.json({
      assignedTo: assigned.fullname,
      role: assigned.role,
      phone: assigned.phoneNumber,
      message: message
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.listen(PORT, () => {
  console.log(`🚓 Server running at http://localhost:${PORT}`);
});