const db = require("../config/database");

class AdherentModel {
  /**
   * Récupérer tous les adhérents
   */
  findAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM adherents`;
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Récupérer un adhérent par son ID
   */
  findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM adherents WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  /**
   * Récupérer un adhérent par son code
   */
  findByCode(code) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM adherents WHERE code = ?`;
      db.get(sql, [code], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  /**
   * Compter le nombre d'adhérents rattachés à un parent (code_parent)
   */
  countByCodeParent(code_parent) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as total FROM adherents WHERE code_parent = ?`;
      db.get(sql, [code_parent], (err, row) => {
        if (err) return reject(err);
        resolve(row.total);
      });
    });
  }

  /**
   * Créer un nouvel adhérent
   */
  create({ code, nom, prenom, telephone, adresse, code_parent }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO adherents (code, nom, prenom, telephone, adresse, code_parent)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.run(
        sql,
        [code, nom, prenom, telephone, adresse, code_parent || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  /**
   * Mettre à jour un adhérent
   */
  update(id, { code, nom, prenom, telephone, adresse, code_parent }) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE adherents
        SET code = ?, nom = ?, prenom = ?, telephone = ?, adresse = ?, code_parent = ?
        WHERE id = ?
      `;
      db.run(
        sql,
        [code, nom, prenom, telephone, adresse, code_parent || null, id],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
        }
      );
    });
  }

  /**
   * Supprimer un adhérent
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM adherents WHERE id = ?`;
      db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = new AdherentModel();
