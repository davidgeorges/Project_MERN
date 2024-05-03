import { authentificationController } from "../controller/authentificationController";
import { newUser } from "../middleware/validator";

/**
 * Fonction permettant d'exporter toute nos routes authentification
 * @param app
 */
export const setAuthentificationRouting = (app) => {
  const endpoint = "api/auth";
  app.post(`/${endpoint}/register`, newUser, authentificationController.register);
  app.post(`/${endpoint}/login`, authentificationController.login);
  app.get(`/${endpoint}/logout`, authentificationController.logout);
};
