import { eventController } from "../controller/eventController";
import { newEvent,editEvent } from "../middleware/validator";
import { tokenFilter } from "../middleware/authentification";

/**
 * Fonction permettant d'exporter toute nos routes event vers app.ts
 * @param app
 */
export const setEventRouting = (app) => {
  const endpoint = "api/event";

  app.get(`/${endpoint}`, tokenFilter, eventController.findAll);
  app.get(`/${endpoint}/:id`, tokenFilter, eventController.findById);
  app.get(`/${endpoint}/sortByDate/:orderBy`, tokenFilter, eventController.sortByDate);
  app.get(`/${endpoint}/sortByType/:orderType`, tokenFilter, eventController.sortByType);
  app.get(`/${endpoint}/sortByPopularity/:orderBy`, tokenFilter, eventController.sortByPopularity);
  app.post(`/${endpoint}`, tokenFilter, newEvent, eventController.create);
  app.patch(`/${endpoint}/:id`, tokenFilter, editEvent, eventController.update);
  app.delete(`/${endpoint}/:id`, tokenFilter, eventController.delete);
};
