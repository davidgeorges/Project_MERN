import { userController } from "../controller/userController";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setUserRouting = (app) => {
  const endpoint = "users";

  app.get(`/${endpoint}`, userController.findAll);
  app.get(`/${endpoint}/:id`, userController.findById);
  app.post(`/${endpoint}`, userController.create);
  app.patch(`/${endpoint}/:id`, userController.update);
  app.delete(`/${endpoint}/:id`, userController.delete);
};
