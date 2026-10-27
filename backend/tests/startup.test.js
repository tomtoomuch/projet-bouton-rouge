const app = require("../server");

describe("Démarrage du serveur", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("startServer()", () => {
        test("écoute sur le port et l'hôte configurés", () => {
            const fakeServer = { close: jest.fn() };
            const listenSpy = jest
                .spyOn(app, "listen")
                .mockImplementation((port, host, callback) => {
                    callback();
                    return fakeServer;
                });

            const logger = { log: jest.fn() };

            const server = app.startServer({
                port: 4567,
                host: "127.0.0.1",
                logger
            });

            expect(listenSpy).toHaveBeenCalledWith(
                4567,
                "127.0.0.1",
                expect.any(Function)
            );

            expect(logger.log).toHaveBeenCalledWith(
                "API démarrée sur le port 4567"
            );

            expect(server).toBe(fakeServer);
        });

        test("Utilise les paramètres par défaut", () => {
            const listenSpy = jest
                .spyOn(app, "listen")
                .mockImplementation(() => ({}));

            app.startServer();

            expect(listenSpy).toHaveBeenCalledWith(
                process.env.PORT || 3000,
                "0.0.0.0",
                expect.any(Function)
            );
        });

        test("Ne démarre pas avant l'appel du callback", () => {
            const logger = { log: jest.fn() };

            jest.spyOn(app, "listen").mockImplementation(
                () => ({ close: jest.fn() })
            );

            app.startServer({ port: 4568, logger });

            expect(logger.log).not.toHaveBeenCalled();
        });
    });
    
    describe("startIfMain()", () => {
        test("Démarre le serveur si le fichier est principal", () => {
            const fakeServer = { close: jest.fn() };

            const startSpy = jest
                .spyOn(app, "startServer")
                .mockReturnValue(fakeServer);

            const result = app.startIfMain(true);

            expect(startSpy).toHaveBeenCalledTimes(1);
            expect(result).toBe(fakeServer);
        });

        test("Ne démarre pas le serveur si le fichier est importé", () => {
            const startSpy = jest
                .spyOn(app, "startServer")
                .mockReturnValue({});

            const result = app.startIfMain(false);

            expect(startSpy).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
});