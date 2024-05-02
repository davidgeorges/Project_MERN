import express from "express";
import cors from "cors";
import { setUserRouting } from "./routes/userRoutes";
import { setEventRouting } from "./routes/eventRoutes";
import { setAuthentificationRouting } from "./routes/authentificationRoutes";
import { setMongoConnection } from "./config/mongo.config";
import cookieParser from 'cookie-parser';
import { LISTEN_ADDRESS,LISTEN_PORT } from "./settings";


const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin:true, credentials:true }));
app.use(cookieParser());

setMongoConnection();
setUserRouting(app);
setEventRouting(app);
setAuthentificationRouting(app);

app.listen(LISTEN_PORT, () => {
  console.log(`serveur en écoute sur : http://${LISTEN_ADDRESS}:${LISTEN_PORT}`);
});
