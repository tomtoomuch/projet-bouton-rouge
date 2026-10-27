
const express = require("express");
const cors = require("cors");
const authenticate = require("./authController");
const getMessage = require("./clickController");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
	res.status(404).json({
		status: "ko"
	});
});

app.post("/login", authenticate);
app.post("/click", getMessage);

function startServer({
	port = PORT,
	host = HOST,
	logger = console
} = {}) {
	return app._router.listen(port, host, () => {
		logger.log(`API démarrée sur le port ${port}`);
	});
}

function startIfMain(isMain = require.main === module) {
	if (isMain) {
		return module.exports.startServer();
	}
	return null;
}

startIfMain();

module.exports = app;
module.exports.startServer = startServer;