const router = require('express').Router();
const database = require('../db.js');

/**
 * Minion Schema
 * id: String
 * name: String
 * title: String
 * salary: Number
 */
router.param('minionId', (req, res, next, id) => {
   const minion = database.getFromDatabaseById('minions', id);
   
    if (minion) {
        req.minion = minion;
        next(); 
    } else {
        res.status(404).send(); 
    }
});

router.get('/', (req, res, next) => {
    // Get an array of all minions.    
    res.send(database.getAllFromDatabase('minions'));
});

router.post('/', (req, res, next) => {
    // Create a new minion and save it to the database. Use next id in sequence.
    // Send back the new/updated minion.
    const minion = database.addToDatabase('minions', req.body);
    res.status(201).send(minion);
});

router.get('/:minionId', (req, res, next) => {
    // Get a single minion by id.
    res.send(req.minion);
});

router.put('/:minionId', (req, res, next) => {
    // Update a single minion by id. 
    // Send back the new/updated minion.
    const minion = database.updateInstanceInDatabase('minions', req.body);
    res.send(minion);
});

router.delete('/:minionId', (req, res, next) => {
    // Delete a single minion by id. 
    const deleted = database.deleteFromDatabasebyId('minions', req.params.minionId);

    if (deleted) {
        res.status(204);
    } else {
        res.status(500);
    }

    res.send();
});

module.exports = router;