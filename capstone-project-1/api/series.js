const express = require("express");
const router = express.Router();

const issuesRouter = require("./issues");

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");

router.use("/:seriesId/issues", issuesRouter);

router.param("seriesId", (req, res, next, seriesId) => {
	db.get(
		"SELECT * FROM Series WHERE id = $seriesId",
		{ $seriesId: seriesId },
		(err, series) => {
			if (err) {
				next(err);
			} else if (series) {
				req.series = series;
				next();
			} else {
				res.sendStatus(404);
			}
		}
	);
});

router.get("/", (req, res, next) => {
	db.all("SELECT * FROM Series", (err, rows) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ series: rows });
		}
	});
});

router.post("/", (req, res, next) => {
	const series = req.body.series;

	if (!series.name || !series.description) {
		return res.sendStatus(400);
	} else {
		db.run(
			`INSERT INTO Series (name, description) VALUES ($name, $description)`,
			{
				$name: series.name,
				$description: series.description,
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get(
						"SELECT * FROM Series WHERE id = $seriesId",
						{ $seriesId: this.lastID },
						(err, series) => {
							if (err) {
								next(err);
							} else {
								res.status(201).json({ series: series });
							}
						}
					);
				}
			}
		);
	}
});

router.get("/:seriesId", (req, res, next) => {
	res.status(200).json({ series: req.series });
});

router.put("/:seriesId", (req, res, next) => {
	const series = req.body.series;

	if (!series.name || !series.description) {
		return res.sendStatus(400);
	} else {
		db.run(
			`
      UPDATE Series SET name = $name, description = $description WHERE id = $id`,
			{
				$name: series.name,
				$description: series.description,
				$id: req.params.seriesId,
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get(
						"SELECT * FROM Series WHERE id = $id",
						{ $id: req.params.seriesId },
						(err, series) => {
							res.status(200).json({ series: series });
						}
					);
				}
			}
		);
	}
});

router.delete("/:seriesId", (req, res, next) => {
	db.get(
		"SELECT * FROM Issue WHERE series_id = $id",
		{ $id: req.params.seriesId },
		(err, issue) => {
			if (err) {
				next(err);
			} else if (issue) {
				return res.sendStatus(400);
			} else {
				db.run(
					"DELETE FROM Series WHERE id = $id",
					{ $id: req.params.seriesId },
					function (err) {
						if (err) {
							next(err);
						} else {
							res.sendStatus(204);
						}
					}
				);
			}
		}
	);
});

module.exports = router;
