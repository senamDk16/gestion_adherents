const adherentModel = require("../models/adherent.model");

class AdherentService {
  /**
   * Récupérer tous les adhérents
   */
  async getAll() {
    return await adherentModel.findAll();
  }

  /**
   * Récupérer un adhérent par ID
   */
  async getById(id) {
    const adherent = await adherentModel.findById(id);
    if (!adherent) {
      const error = new Error(`Adhérent avec l'id ${id} introuvable.`);
      error.status = 404;
      throw error;
    }
    return adherent;
  }

  /**
   * Créer un nouvel adhérent
   * Règles métier :
   *  - Le code doit être unique
   *  - Si code_parent fourni, le parent doit exister
   *  - Un adhérent parent ne peut avoir que 2 adhérents rattachés
   */
  async create(data) {
    const { code, code_parent } = data;

    // Vérifier unicité du code
    const existing = await adherentModel.findByCode(code);
    if (existing) {
      const error = new Error(`Le code "${code}" est déjà utilisé.`);
      error.status = 409;
      throw error;
    }

    // Vérifier le parent si fourni
    if (code_parent) {
      const parent = await adherentModel.findByCode(code_parent);
      if (!parent) {
        const error = new Error(`Le parent avec le code "${code_parent}" n'existe pas.`);
        error.status = 404;
        throw error;
      }

      // Vérifier la limite de 2 adhérents par parent
      const count = await adherentModel.countByCodeParent(code_parent);
      if (count >= 2) {
        const error = new Error(
          `Le parent "${code_parent}" a déjà atteint la limite de 2 adhérents rattachés.`
        );
        error.status = 400;
        throw error;
      }
    }

    const result = await adherentModel.create(data);
    return await adherentModel.findById(result.id);
  }

  /**
   * Mettre à jour un adhérent
   */
  async update(id, data) {
    // Vérifier existence
    const adherent = await adherentModel.findById(id);
    if (!adherent) {
      const error = new Error(`Adhérent avec l'id ${id} introuvable.`);
      error.status = 404;
      throw error;
    }

    const { code, code_parent } = data;

    // Vérifier unicité du code (sauf pour lui-même)
    if (code && code !== adherent.code) {
      const existing = await adherentModel.findByCode(code);
      if (existing) {
        const error = new Error(`Le code "${code}" est déjà utilisé.`);
        error.status = 409;
        throw error;
      }
    }

    // Vérifier le nouveau parent si modifié
    if (code_parent && code_parent !== adherent.code_parent) {
      // Empêcher un adhérent de se référencer lui-même
      if (code_parent === (code || adherent.code)) {
        const error = new Error("Un adhérent ne peut pas être son propre parent.");
        error.status = 400;
        throw error;
      }

      const parent = await adherentModel.findByCode(code_parent);
      if (!parent) {
        const error = new Error(`Le parent avec le code "${code_parent}" n'existe pas.`);
        error.status = 404;
        throw error;
      }

      const count = await adherentModel.countByCodeParent(code_parent);
      if (count >= 2) {
        const error = new Error(
          `Le parent "${code_parent}" a déjà atteint la limite de 2 adhérents rattachés.`
        );
        error.status = 400;
        throw error;
      }
    }

    // Fusionner les données existantes avec les nouvelles
    const updatedData = {
      code: code || adherent.code,
      nom: data.nom || adherent.nom,
      prenom: data.prenom || adherent.prenom,
      telephone: data.telephone || adherent.telephone,
      adresse: data.adresse || adherent.adresse,
      code_parent: code_parent !== undefined ? code_parent : adherent.code_parent,
    };

    await adherentModel.update(id, updatedData);
    return await adherentModel.findById(id);
  }

  /**
   * Supprimer un adhérent
   */
  async delete(id) {
    const adherent = await adherentModel.findById(id);
    if (!adherent) {
      const error = new Error(`Adhérent avec l'id ${id} introuvable.`);
      error.status = 404;
      throw error;
    }
    await adherentModel.delete(id);
    return { message: `Adhérent "${adherent.nom} ${adherent.prenom}" supprimé avec succès.` };
  }
}

module.exports = new AdherentService();
