const messages = require("./messages")

const getMessage = (req, res) => {
	const { count } = req.body || {};

	if (!Number.isInteger(count) || count < 1 || count > 30) {
		return res.status(400).json({
			error: "Le nombre de clics doit être compris entre 1 et 30."
		});
	}

	return res.json({
		count,
		message: messages[count - 1],
		finished: count === 30
	});
};

module.exports = getMessage;