const express = require('express');

//database access using knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

// /api/posts
// router.get('/', (req, res) => {
//   db('accounts')
//     .then((accounts) => {
//       res.json(accounts);
//     })
//     .catch((err) => {
//       res.status(500).json({ message: 'error retrieving accounts', err });
//     });
// });

router.get('/', async (req, res) => {
  const query = {
    limit: req.query.limit ? req.query.limit : 5,
    sortby: req.query.sortby ? req.query.sortby : 'budget',
    sortdir: req.query.sortdir ? req.query.sortdir : 'desc',
  };

  try {
    const accounts = await knex
      .select('*')
      .table('accounts')
      .orderBy(query.sortby, query.sortdir)
      .limit(parseInt(query.limit));

    res.json(accounts);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'Server failed to GET accounts', error: err });
  }
});

// router.get('/:id', (req, res) => {
//   const { id } = req.params;

//   knex('accounts')
//     .where({ id })
//     .then((account) => {
//       res.json(account);
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .json({ message: 'there was an error retrieving the account', err });
//     });
// });

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [account] = await knex('accounts').where({ id });
    res.json(account);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'Server failed to GET accounts', error: err });
  }
});

router.post('/', (req, res) => {
  knex('accounts')
    .insert(req.body)
    .then((account) => {
      res.status(201).json(account);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: 'Failed to POST new account', error: err });
    });
});

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;

//   knex('accounts')
//     .where({ id })
//     .update(changes)
//     .then((count) => {
//       if (count) {
//         res.json({ update: count });
//       } else {
//         res.status(404).json({ message: 'invalid id' });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ message: 'error updating account', error });
//     });
// });

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await knex('accounts').update(req.body).where({ id });
    res.status(200).json(req.body);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'Server unable to PUT account', error: err });
  }
});

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;

//   knex('accounts')
//     .where({ id })
//     .del({ id })
//     .then((count) => {
//       if (count) {
//         res.json({ deleted: count });
//       } else {
//         res.status(404).json({ message: 'invalid id' });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ message: 'error deleting account', error });
//     });
// });

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [deleted] = await knex('accounts').where({ id });
    const count = await knex('accounts').del().where({ id });
    if (count > 0) {
      res.status(200).json(deleted);
    } else {
      res.status(404).json({ errorMessage: 'Invalid id' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'Server unable to DELETE account', error: err });
  }
});

module.exports = router;
