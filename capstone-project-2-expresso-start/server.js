const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler());

const PORT = process.env.PORT || 4000;

const apiRouter = require("./routers/api");
app.use("/api", apiRouter);

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}.`);
});

module.exports = app;
