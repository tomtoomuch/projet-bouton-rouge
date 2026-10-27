
const getMessage = require("../clickController");
const messages = require("../messages");

describe("Contrôleur des clics", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {} };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    test("retourne le message du premier clic", () => {
        req.body = { count: 1 };

        getMessage(req, res);

        expect(res.json).toHaveBeenCalledWith({
            count: 1,
            message: messages[0],
            finished: false
        });
    });

    test("retourne le message correspondant au compteur", () => {
        req.body = { count: 5 };

        getMessage(req, res);

        expect(res.json).toHaveBeenCalledWith({
            count: 5,
            message: messages[4],
            finished: false
        });
    });

    test("termine le scénario au trentième clic", () => {
        req.body = { count: 30 };

        getMessage(req, res);

        expect(res.json).toHaveBeenCalledWith({
            count: 30,
            message: messages[29],
            finished: true
        });
    });

    test.each([
        ["zéro", 0],
        ["valeur négative", -1],
        ["valeur supérieure à 30", 31],
        ["nombre décimal", 1.5],
        ["chaîne de caractères", "5"],
        ["valeur nulle", null],
        ["booléen", true],
        ["valeur absente", undefined]
    ])("rejette un compteur invalide : %s", (_description, count) => {
        req.body = count === undefined ? {} : { count };

        getMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Le nombre de clics doit être compris entre 1 et 30."
        });
    });

    test("gère un corps de requête absent", () => {
        req.body = undefined;

        expect(() => getMessage(req, res)).not.toThrow();
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
