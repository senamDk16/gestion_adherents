const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = process.env.DB_PATH || "./database.sqlite";

const db = new sqlite3.Database(path.resolve(DB_PATH), (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    process.exit(1);
  }
  console.log("Connecté à la base de données SQLite.");
});

// Activer les clés étrangères
db.run("PRAGMA foreign_keys = ON");

// Création de la table adherents
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS adherents (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    code      TEXT    NOT NULL UNIQUE,
    nom       TEXT    NOT NULL,
    prenom    TEXT    NOT NULL,
    telephone TEXT    NOT NULL,
    adresse   TEXT    NOT NULL,
    code_parent TEXT  REFERENCES adherents(code) ON DELETE SET NULL
  )
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error("Erreur lors de la création de la table :", err.message);
  } else {
    console.log("Table 'adherents' prête.");
  }
});

module.exports = db;
