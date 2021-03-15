const router = require('express').Router();
const database = require('../db');

/**
 * Meeting Schema
 * time: String
 * date: JS Date Object
 * day: String
 * note: String
 */

router.get('/', (req, res, next) => {
   // Get an array of all meetings. 
   res.send(database.getAllFromDatabase('meetings'));
});

router.post('/', (req, res, next) => {
   // Create a new meeting and save it to the database. 
   // Use the createMeeting function from db.js
   const meeting = database.addToDatabase('meetings', database.createMeeting());
   res.status(201).send(meeting);
});

router.delete('/', (req, res, next) => {
   // Delete all meetings from the database. 
   database.deleteAllFromDatabase('meetings');
   res.status(204).send();
});


module.exports = router;