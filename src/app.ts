import express from "express";
import cors from "cors";
import { setUserRouting } from "./routes/userRoutes";
import { setEventRouting } from "./routes/eventRoutes";
import { setAuthentificationRouting } from "./routes/authentificationRoutes";
import { setMongoConnection } from "./config/mongo.config";
import cookieParser from 'cookie-parser';
import { LISTEN_ADDRESS,LISTEN_PORT } from "./settings";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

const app = express();  
app.use(cors({ origin:true, credentials:true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

setMongoConnection();
setUserRouting(app);
setEventRouting(app);
setAuthentificationRouting(app);

app.listen(LISTEN_PORT, () => {
  console.log(`serveur en écoute sur : http://${LISTEN_ADDRESS}:${LISTEN_PORT}`);
});
