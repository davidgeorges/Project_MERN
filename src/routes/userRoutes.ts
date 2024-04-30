import { userController } from "../controller/userController";
import { newUser } from "../middleware/validator";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setUserRouting = (app) => {
  const endpoint = "user";

  app.get(`/${endpoint}`, userController.findAll);
  app.get(`/${endpoint}/:id`, userController.findById);
  app.patch(`/${endpoint}/:id`, userController.update);
  app.delete(`/${endpoint}/:id`, userController.delete);
};
