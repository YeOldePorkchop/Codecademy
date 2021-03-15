const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('error-handling');
const morgan = require('morgan');
const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

module.exports = app;