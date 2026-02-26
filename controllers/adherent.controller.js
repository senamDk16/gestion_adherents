const adherentService = require("../services/adherent.service");

class AdherentController {
  /**
   * GET /adherents
   * Récupérer tous les adhérents
   */
  async getAll(req, res) {
    try {
      const adherents = await adherentService.getAll();
      return res.status(200).json({
        success: true,
        data: adherents,
        total: adherents.length,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur interne du serveur.",
      });
    }
  }

  /**
   * GET /adherents/:id
   * Récupérer un adhérent par ID
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "L'id doit être un nombre." });
      }
      const adherent = await adherentService.getById(id);
      return res.status(200).json({ success: true, data: adherent });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /adherents
   * Créer un nouvel adhérent
   */
  async create(req, res) {
    try {
      const { code, nom, prenom, telephone, adresse, code_parent } = req.body;

      // Validation des champs obligatoires
      if (!code || !nom || !prenom || !telephone || !adresse) {
        return res.status(400).json({
          success: false,
          message: "Les champs code, nom, prenom, telephone et adresse sont obligatoires.",
        });
      }

      const adherent = await adherentService.create({
        code,
        nom,
        prenom,
        telephone,
        adresse,
        code_parent: code_parent || null,
      });

      return res.status(201).json({ success: true, data: adherent });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /adherents/:id
   * Mettre à jour un adhérent
   */
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "L'id doit être un nombre." });
      }

      const adherent = await adherentService.update(id, req.body);
      return res.status(200).json({ success: true, data: adherent });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /adherents/:id
   * Supprimer un adhérent
   */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "L'id doit être un nombre." });
      }

      const result = await adherentService.delete(id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AdherentController();
