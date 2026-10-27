
const authenticate = require("../authController");

describe("Contrôleur d'authentification", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {} };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    test("accepte les identifiants valides", () => {
        req.body = {
            username: "admin",
            password: "docker"
        };

        authenticate(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Bienvenue. Et surtout, ne touche pas au bouton."
        });
        expect(res.status).not.toHaveBeenCalled();
    });

    test("refuse un mot de passe incorrect", () => {
        req.body = {
            username: "admin",
            password: "incorrect"
        };

        authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Identifiants incorrects."
        });
    });

    test("refuse un utilisateur inconnu", () => {
        req.body = {
            username: "inconnu",
            password: "docker"
        };

        authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("refuse un corps de requête vide", () => {
        req.body = {};

        authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Identifiants incorrects."
        });
    });

    test("gère un corps de requête absent", () => {
        req.body = undefined;

        expect(() => authenticate(req, res)).not.toThrow();
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
