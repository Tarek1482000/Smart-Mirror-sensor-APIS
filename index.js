// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://sm:2000@sm.c9xgwqo.mongodb.net/sensors?retryWrites=true&w=majority&appName=SM"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define a schema for temperature data
const temperatureSchema = new mongoose.Schema({
  ambient_temperature: Number,
  object_temperature: Number,
});

// Define a schema for heart rate data
const heartRateSchema = new mongoose.Schema({
  heart_rate: Number,
});

const weighterSchema = new mongoose.Schema({
  // Existing fields
  weight: Number,
  height: Number,
  age: Number,
  gender: String,
  // New fields
  bmi: Number,
  bfp: Number,
  muscle_mass: Number,
});

// Create models based on the schemas
const Temperature = mongoose.model("Temp", temperatureSchema);
const HeartRate = mongoose.model("Heart", heartRateSchema);
const Inbody = mongoose.model("Weighter", weighterSchema);

// Create Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// PATCH route to update temperature data
app.patch("/temp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ambient_temperature, object_temperature } = req.body;

    // Find the temperature data by ID and update it
    const temperature = await Temperature.findByIdAndUpdate(
      id,
      {
        ambient_temperature,
        object_temperature,
      },
      { new: true }
    );

    if (!temperature) return res.status(404).send("Temperature data not found");

    res.send(temperature);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PATCH route to update heart rate data
app.patch("/heart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { heart_rate } = req.body;

    // Find the heart rate data by ID and update it
    const heartRate = await HeartRate.findByIdAndUpdate(
      id,
      {
        heart_rate,
      },
      { new: true }
    );

    if (!heartRate) return res.status(404).send("Heart rate data not found");

    res.send(heartRate);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/Inbody/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, height, age, gender, bmi, bfp, muscle_mass } = req.body;

    // Find the user data by ID and update it
    const updatedInbody = await Inbody.findByIdAndUpdate(
      id,
      {
        weight,
        height,
        age,
        gender,
        bmi,
        bfp,
        muscle_mass,
      },
      { new: true }
    );

    if (!updatedInbody) return res.status(404).send("Inbody data not found");

    res.send(updatedInbody);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET route to retrieve temperature data
app.get("/temp/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the temperature data by ID, excluding _id field
    const temperature = await Temperature.findById(id).select("-_id");

    if (!temperature) return res.status(404).send("Temperature data not found");

    res.send(temperature);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET route to retrieve heart rate data
app.get("/heart/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the heart rate data by ID, excluding _id field
    const heartRate = await HeartRate.findById(id).select("-_id");

    if (!heartRate) return res.status(404).send("Heart rate data not found");

    res.send(heartRate);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET route to retrieve Weight data
app.get("/Inbody/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Weight data by ID, excluding _id field
    const foundInbody = await Inbody.findById(id).select("-_id");

    if (!foundInbody) return res.status(404).send("Inbody data not found");

    res.send(foundInbody);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
const port = 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
