const express = require("express");
const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
router.get("/", (req, res) => {
	res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler());
app.use(morgan("dev"));
const PORT = process.env.PORT || 4000;
app.use("/", router);
const apiRouter = require("./routers/api");
app.use("/api", apiRouter);

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}.`);
});

module.exports = app;
