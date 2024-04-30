import { eventController } from "../controller/eventController";
import { newEvent } from "../middleware/validator";

/**
 * Fonction permettant d'exporter toute nos routes users vers app.ts
 * @param app
 */
export const setEventRouting = (app) => {
  const endpoint = "events";

  app.get(`/${endpoint}`, eventController.findAll);
  app.get(`/${endpoint}/:id`, eventController.findById);
  app.post(`/${endpoint}`,newEvent,eventController.create);
  app.patch(`/${endpoint}/:id`, eventController.update);
  app.delete(`/${endpoint}/:id`, eventController.delete);
};
