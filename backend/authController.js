// Fonction d'authentification
const messages = require("./messages");

const authenticate = (req, res) => {
	const { username, password } = req.body || {};

	if (username === "admin" && password === "docker") {
		return res.json({
			success: true,
			message: "Bienvenue. Et surtout, ne touche pas au bouton."
		});
	}

	return res.status(401).json({
		success: false,
		message: "Identifiants incorrects."
	});
};

module.exports = authenticate;