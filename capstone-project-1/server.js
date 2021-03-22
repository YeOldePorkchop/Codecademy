const express = require("express");
const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const apiRouter = require("./api/api");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

router.get("/", (req, res) => {
	console.log("Merp.");
	res.sendStatus(200);
});
app.use("/", router);
app.use("/api", apiRouter);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
