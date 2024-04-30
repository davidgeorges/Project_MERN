import { eventController } from "../controller/eventController";
import { newEvent,editEvent } from "../middleware/validator";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setEventRouting = (app) => {
  const endpoint = "event";

  app.get(`/${endpoint}`, eventController.findAll);
  app.get(`/${endpoint}/:id`, eventController.findById);
  app.get(`/${endpoint}/sortByDate/:orderBy`, eventController.sortByDate);
  app.get(`/${endpoint}/sortByType/:orderType`, eventController.sortByType);
  app.get(`/${endpoint}/sortByPopularity/:orderBy`, eventController.sortByPopularity);
  app.post(`/${endpoint}`, newEvent, eventController.create);
  app.patch(`/${endpoint}/:id`, editEvent, eventController.update);
  app.delete(`/${endpoint}/:id`, eventController.delete);
};
