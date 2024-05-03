import { eventController } from "../controller/eventController";
import { newEvent,editEvent } from "../middleware/validator";
import { tokenFilter } from "../middleware/authentification";
import { isAuthorized,isOwner } from "../middleware/authorization";

/**
 * Fonction permettant d'exporter toute nos routes event vers app.ts
 * @param app
 */
export const setEventRouting = (app) => {
  const endpoint = "event";

  app.get(`/${endpoint}`, tokenFilter, eventController.findAll);
  app.get(`/${endpoint}/:id`, tokenFilter, eventController.findById);
  app.get(`/${endpoint}/sortByDate/:orderBy`, tokenFilter, eventController.sortByDate);
  app.get(`/${endpoint}/sortByType/:orderType`, tokenFilter, eventController.sortByType);
  app.get(`/${endpoint}/sortByPopularity/:orderBy`, tokenFilter, eventController.sortByPopularity);
  app.post(`/${endpoint}`, tokenFilter, newEvent, isAuthorized(["MANAGER","ADMIN"]), eventController.create);
  app.patch(`/${endpoint}/:id`, tokenFilter, editEvent, isAuthorized(["MANAGER","ADMIN"]), isOwner, eventController.update);
  app.delete(`/${endpoint}/:id`, tokenFilter, isAuthorized(["MANAGER","ADMIN"]), isOwner, eventController.delete);
};
