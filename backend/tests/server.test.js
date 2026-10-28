const request = require("supertest");
const app = require("../server");

describe("API Le Bouton Rouge", () => {
    describe("GET /health", () => {
        test("devrait répondre que le service est healthy", async () => {
            const response = await request(app)
                .get("/health")
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "status":"ok",
                "service":"backend"
            });
        });
    })
    
    describe("POST /login", () => {
        test("devrait accepter les identifiants valides", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    username: "admin",
                    password: "docker"
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message:
                    "Bienvenue. Et surtout, ne touche pas au bouton."
            });
        });

        test("devrait refuser un mot de passe incorrect", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    username: "admin",
                    password: "incorrect"
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: "Identifiants incorrects."
            });
        });

        test("devrait refuser un nom d'utilisateur incorrect", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    username: "inconnu",
                    password: "docker"
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("devrait refuser des identifiants absents", async () => {
            const response = await request(app)
                .post("/login")
                .send({});

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("devrait refuser une requête sans identifiants", async () => {
            const response = await request(app).post("/login");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /click", () => {
        test("devrait accepter le premier clic", async () => {
            const response = await request(app)
                .post("/click")
                .send({ count: 1 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                count: 1,
                message: "Je t'avais pourtant prévenu.",
                finished: false
            });
        });

        test("devrait renvoyer le message correspondant au compteur", async () => {
            const response = await request(app)
                .post("/click")
                .send({ count: 5 });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(5);
            expect(response.body.message).toBe(
                "Ce bouton n'est PAS un jouet."
            );
            expect(response.body.finished).toBe(false);
        });

        test("devrait terminer le scénario au 30e clic", async () => {
            const response = await request(app)
                .post("/click")
                .send({ count: 30 });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(30);
            expect(response.body.message).toContain("BOUM !");
            expect(response.body.finished).toBe(true);
        });

        test.each([
            ["zéro", 0],
            ["nombre négatif", -1],
            ["au-dessus de la limite", 31],
            ["nombre décimal", 1.5],
            ["chaîne de caractères", "5"],
            ["valeur nulle", null],
            ["valeur booléenne", true],
            ["valeur absente", undefined]
        ])("devrait rejeter un compteur invalide : %s", async (_, count) => {
            const body = count === undefined ? {} : { count };

            const response = await request(app)
                .post("/click")
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error:
                    "Le nombre de clics doit être compris entre 1 et 30."
            });
        });

        test("devrait rejeter une requête sans corps", async () => {
            const response = await request(app).post("/click");

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Le nombre de clics doit être compris entre 1 et 30."
            );
        });
    });

    describe("Routes inconnues", () => {
        test("devrait renvoyer une erreur 404", async () => {
            const response = await request(app).get("/route-inconnue");

            expect(response.status).toBe(404);
        });
    });


    describe("Gestion des requêtes HTTP invalides", () => {
        test("renvoie une erreur 400 si le JSON est mal formé", async () => {
            const response = await request(app)
                .post("/click")
                .set("Content-Type", "application/json")
                .send('{"count":');

            expect(response.status).toBe(400);
        });

        test("rejette un corps JSON envoyé en texte brut", async () => {
            const response = await request(app)
                .post("/click")
                .set("Content-Type", "text/plain")
                .send('{"count":5}');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error:
                    "Le nombre de clics doit être compris entre 1 et 30."
            });
        });

        test("rejette une méthode HTTP non prise en charge", async () => {
            const response = await request(app).get("/click");

            expect(response.status).toBe(404);
        });
    });

});
