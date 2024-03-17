const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/med_donation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema and Model for your data
const donationSchema = new mongoose.Schema({
  name: String,
  presentation: String,
  form: String,
  laboratory: String,
  scannedLot: String,
  scannedExp: String,
  scannedGtin: String,
});

const Donation = mongoose.model("Donation", donationSchema);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error caught in error handling middleware:", err); // Add console log to trace error
  res.status(500).json({ error: "Internal server error" });
});

// API Endpoint to handle data submission
app.post("/api/donations", async (req, res, next) => {
  try {
    const {
      name,
      presentation,
      form,
      laboratory,
      scannedLot,
      scannedExp,
      scannedGtin,
    } = req.body;

    if (!name || !presentation) {
      return res
        .status(400)
        .json({ error: "Name and Presentation are required" });
    }

    const newDonation = new Donation({
      name,
      presentation,
      form,
      laboratory,
      scannedLot,
      scannedExp,
      scannedGtin,
    });

    await newDonation.save();

    res.status(201).json({ message: "Donation saved successfully" });
  } catch (error) {
    console.error("Error caught in API endpoint:", error); // Add console log to trace error
    next(error); // Pass error to the error handling middleware
  }
});

// API Endpoint to fetch all donations
app.get("/api/donations", async (req, res, next) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    console.error("Error caught in API endpoint:", error);
    next(error);
  }
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
