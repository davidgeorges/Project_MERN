import { userController } from "../controller/userController";
import { editUser } from "../middleware/validator";
import { tokenFilter } from "../middleware/authentification";
import { isAuthorized,isOwner } from "../middleware/authorization";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setUserRouting = (app) => {
  const endpoint = "user";

  app.get(`/${endpoint}`, tokenFilter, isAuthorized(["ADMIN"]), userController.findAll);
  app.get(`/${endpoint}/:id`, tokenFilter, isAuthorized(["USER","MANAGER","ADMIN"]), userController.findById);
  app.patch(`/${endpoint}/:id`, tokenFilter, isAuthorized(["USER","MANAGER","ADMIN"]), isOwner, editUser, userController.update);
  app.delete(`/${endpoint}/:id`, tokenFilter, isAuthorized(["USER","MANAGER","ADMIN"]), isOwner, userController.delete);
  app.post(`/${endpoint}/subscribe/:id`, tokenFilter, isAuthorized(["USER","MANAGER","ADMIN"]), userController.subscribeToAnEvent);
  app.delete(`/${endpoint}/unsubscribe/:id`, tokenFilter, isAuthorized(["USER","MANAGER","ADMIN"]), userController.unsubscribeFromAnEvent);

};
