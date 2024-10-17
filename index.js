const express = require("express");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const { patientVerifyToken } = require("./middleware/patient");
const { doctorVerifyToken } = require("./middleware/doctor");
require("./config/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.send("Hello from API");
});

app.use("/api/auth", require("./routes/auth"));



app.use("/api/patient", patientVerifyToken, patientRoutes);
app.use("/api/doctor", doctorVerifyToken, doctorRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
