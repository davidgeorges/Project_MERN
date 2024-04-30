import mongoose from "mongoose";

/**
 * Fonction permettant de faire la configuration à la connection avec MongoDB
 */
export const setMongoConnection = () => {
  mongoose
    .connect(
      "mongodb://localhost:27017/user" // Assurez-vous de remplacer par le nom de votre base de données
    )
    .then(() => {
      console.log("Connexion à la base de données réussie");
    })
    .catch((error) => {
      console.error("Erreur de connexion à la base de données:", error);
    });
};
