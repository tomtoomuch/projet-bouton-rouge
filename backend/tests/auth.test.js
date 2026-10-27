import { authenticate } from "../authController.js";

describe("Test unitaire de la fonction fléchée authenticate", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it("devrait renvoyer une erreur 400 si username est absent",)
});