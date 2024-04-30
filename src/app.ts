import express from "express";
import cors from "cors";

import { setUserRouting } from "./routes/userRoutes";
import { setEventRouting } from "./routes/eventRoutes";
import { setAuthentificationRouting } from "./routes/authentificationRoutes";
import { setMongoConnection } from "./config/mongo.config";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
const port = 8080;

setMongoConnection();

setUserRouting(app);
setEventRouting(app);
setAuthentificationRouting(app);

app.listen(port, () => {
  console.log(`serveur en écoute sur : http://localhost:${port}`);
});
