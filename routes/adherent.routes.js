const express = require("express");
const router = express.Router();
const adherentController = require("../controllers/adherent.controller");

// GET    /api/adherents          → Tous les adhérents
router.get("/", adherentController.getAll);

// GET    /api/adherents/:id      → Un adhérent par ID
router.get("/:id", adherentController.getById);

// POST   /api/adherents          → Créer un adhérent
router.post("/", adherentController.create);

// PUT    /api/adherents/:id      → Modifier un adhérent
router.put("/:id", adherentController.update);

// DELETE /api/adherents/:id      → Supprimer un adhérent
router.delete("/:id", adherentController.delete);

module.exports = router;
