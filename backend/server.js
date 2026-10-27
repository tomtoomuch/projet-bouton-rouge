
const express = require("express");
const cors = require("cors");
const authenticate = require("authController");
const getMessage = require("clickController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.post("/login", authenticate());
app.post("/click", getMessage());

app.listen(PORT, "0.0.0.0", () => {
	console.log(`API démarrée sur le port ${PORT}`);
});
