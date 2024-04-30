import { userController } from "../controller/userController";
import { editUser } from "../middleware/validator";
import { tokenFilter } from "../middleware/authentification";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setUserRouting = (app) => {
  const endpoint = "user";

  app.get(`/${endpoint}`, tokenFilter, userController.findAll);
  app.get(`/${endpoint}/:id`, tokenFilter, userController.findById);
  app.patch(`/${endpoint}/:id`, tokenFilter, editUser, userController.update);
  app.delete(`/${endpoint}/:id`, tokenFilter, userController.delete);
};
