const express = require('express');

//database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

// /api/posts
router.get('/', (req, res) => {
  db('accounts')
    .then((accounts) => {
      res.json(accounts);
    })
    .catch((err) => {
      res.status(500).json({ message: 'error retrieving accounts', err });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db('accounts')
    .where({ id })
    .then((account) => {
      res.json(account);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'there was an error retrieving the account', err });
    });
});

router.post('/', (req, res) => {
  const accountData = req.body;

  db('accounts')
    .insert(accountData)
    .then((account) => {
      res.status(201).json(account);
    })
    .catch((err) => {
      res.status(500).json({ message: 'failed to create new accounts', err });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('accounts')
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.json({ update: count });
      } else {
        res.status(404).json({ message: 'invalid id' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'error updating account', error });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db('accounts')
    .where({ id })
    .del({ id })
    .then((count) => {
      if (count) {
        res.json({ deleted: count });
      } else {
        res.status(404).json({ message: 'invalid id' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'error deleting account', error });
    });
});

module.exports = router;
