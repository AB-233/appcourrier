const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Mets ton mot de passe MySQL ici
  database: 'courrier_db'
});

// Route pour enregistrer un courrier
app.post('/api/courriers', upload.array('pieces_jointes'), (req, res) => {
  const {
    num_CA,
    num_origine,
    origine_courrier,
    date_signature,
    objet_courrier
  } = req.body;

  // Champs par défaut pour le secrétariat
  const est_visible_direction = true;
  const remarque_direction = null;
  const est_visible_service = false;
  const reponse_service = null;
  const etat_courrier = 0;
  const service_affecte = null;
  const archive = false;

  // Insertion du courrier
  const sql = `INSERT INTO courrier 
    (num_CA, num_origine, origine_courrier, date_signature, objet_courrier, 
    est_visible_direction, remarque_direction, est_visible_service, reponse_service, 
    etat_courrier, service_affecte, archive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    num_CA, num_origine, origine_courrier, date_signature, objet_courrier,
    est_visible_direction, remarque_direction, est_visible_service, reponse_service,
    etat_courrier, service_affecte, archive
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const courrierId = result.insertId;

    // Gestion des pièces jointes
    if (req.files && req.files.length > 0) {
      const pieces = req.files.map(file => [courrierId, file.filename, file.path]);
      db.query(
        'INSERT INTO piece_jointe (courrier_id, nom_fichier, chemin_fichier) VALUES ?',
        [pieces],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: 'Courrier et pièces jointes enregistrés.' });
        }
      );
    } else {
      res.json({ message: 'Courrier enregistré sans pièce jointe.' });
    }
  });
});

// Récupérer les courriers à traiter par la direction (non encore affectés)
app.get('/api/courriers/direction', (req, res) => {
  db.query(
    'SELECT * FROM courrier WHERE est_visible_direction = 1 AND service_affecte IS NULL AND archive = 0',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Affecter un courrier à un service avec une remarque (pour la direction)
app.post('/api/direction', (req, res) => {
  const { courrierId, service_affecte, remarque_direction } = req.body;

  if (!courrierId || !service_affecte) {
    return res.status(400).json({ error: 'Données manquantes.' });
  }

  db.query(
    `UPDATE courrier 
     SET service_affecte = ?, remarque_direction = ?, est_visible_service = 1, est_visible_direction = 0, etat_courrier = 1
     WHERE id = ?`,
    [service_affecte, remarque_direction, courrierId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Courrier affecté au service avec succès.' });
    }
  );
});

app.get('/api/courriers/direction', (req, res) => {
  db.query(
    'SELECT * FROM courrier WHERE est_visible_direction = 1 AND service_affecte IS NULL AND archive = 0',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Affecter un courrier à un service avec une remarque et des actions
app.put('/api/courriers/:id/affecter', (req, res) => {
  const courrierId = req.params.id;
  const { service_affecte, remarque_direction, actions } = req.body;

  if (!service_affecte || !Array.isArray(actions) || actions.length === 0) {
    return res.status(400).json({ error: 'Service ou actions manquants.' });
  }

  // Mettre à jour le courrier
  db.query(
    `UPDATE courrier 
     SET service_affecte = ?, remarque_direction = ?, est_visible_service = 1, est_visible_direction = 0, etat_courrier = 1
     WHERE id = ?`,
    [service_affecte, remarque_direction, courrierId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Insérer les actions dans la table de liaison
      const values = actions.map(actionId => [courrierId, service_affecte, actionId]);
      db.query(
        'INSERT INTO courrier_service_action (courrier_id, service, action_id) VALUES ?',
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: 'Courrier affecté au service avec actions.' });
        }
      );
    }
  );
});

// Récupérer la liste des actions possibles
app.get('/api/actions', (req, res) => {
  db.query('SELECT * FROM action', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Récupérer la liste des services (utilisateurs avec le rôle SERVICE)
app.get('/api/services', (req, res) => {
  db.query(
    "SELECT id, email FROM appuser WHERE role = 'SERVICE'",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Lancer le serveur
app.listen(3000, () => {
  console.log('API démarrée sur http://localhost:3000');
});

