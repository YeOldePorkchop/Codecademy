const router = require('express').Router();
const database = require('../db');
/**
 * Idea Schema
 * id: String
 * name: String
 * description: String
 * numWeeks: Number
 * weeklyRevenue: Number
 */

router.param('ideaId', (req, res, next, id) => {
    const idea = database.getFromDatabaseById('ideas', id);

    if (idea) {
        req.idea = idea;
        next();
    } else {
        res.status(404).send();
    }
});

router.get('/', (req, res, next) => {
    // Get an array of all ideas. 
    res.send(database.getAllFromDatabase('ideas'));
});

router.post('/', (req, res, next) => {
    // Create a new idea and save it to the database. 
    // Send back the new/updated idea.
    const idea = database.addToDatabase('idea', req.body);
    res.status(201).send(idea);
});

router.get('/:ideaId', (req, res, next) => {
    // Get a single idea by id. 
    res.send(req.idea);
});

router.put('/:ideaId', (req, res, next) => {
    // Update a single idea by id. 
    // Send back the new/updated idea.
    const idea = database.updateInstanceInDatabase('ideas', req.body);
    res.send(idea);
});

router.delete('/:ideaId', (req, res, next) => {
    // Delete a single idea by id. 
    const deleted = database.deleteFromDatabasebyId('ideas', req.params.ideaId);

    if (deleted) {
        res.status(204);
    } else {
        res.status(500);
    }

    res.send();
});

module.exports = router;