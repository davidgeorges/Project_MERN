import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Fonction permettant de faire la configuration à la connection avec MongoDB
 */
export const setMongoConnection = () => {
  mongoose
    .connect(
      process.env.DATABASE_URL
    )
    .then(() => {
      console.log("Connexion à la base de données réussie");
    })
    .catch((error) => {
      console.error("Erreur de connexion à la base de données:", error);
    });
};
