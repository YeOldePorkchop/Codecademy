const express = require("express");
const router = express.Router({ mergeParams: true });

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");

router.param("issueId", (req, res, next, issueId) => {
	db.get(
		"SELECT * FROM Issue WHERE id = $id",
		{ $id: issueId },
		(err, issue) => {
			if (err) {
				next(err);
			} else if (issue) {
				req.issue = issue;
				next();
			} else {
				res.sendStatus(404);
			}
		}
	);
});

router.get("/", (req, res, next) => {
	db.all(
		"SELECT * FROM Issue WHERE series_id = $id",
		{ $id: req.params.seriesId },
		(err, rows) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({ issues: rows });
			}
		}
	);
});

router.post("/", (req, res, next) => {
	const issue = req.body.issue;

	if (
		!issue.name ||
		!issue.issueNumber ||
		!issue.publicationDate ||
		!issue.artistId
	) {
		return res.sendStatus(400);
	} else {
		db.run(
			`
      INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id)
      VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)`,
			{
				$name: issue.name,
				$issueNumber: issue.issueNumber,
				$publicationDate: issue.publicationDate,
				$artistId: issue.artistId,
				$seriesId: req.params.seriesId,
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get(
						"SELECT * FROM Issue WHERE id = $id",
						{ $id: this.lastID },
						(err, issue) => {
							if (err) {
								next(err);
							} else {
								res.status(201).json({ issue: issue });
							}
						}
					);
				}
			}
		);
	}
});

router.put("/:issueId", (req, res, next) => {
	const issue = req.body.issue;

	if (
		!issue.name ||
		!issue.issueNumber ||
		!issue.publicationDate ||
		!issue.artistId
	) {
		return res.sendStatus(400);
	} else {
		db.run(
			`
      UPDATE Issue
      SET
        name = $name,
        issue_number = $issueNumber,
        publication_date = $publicationDate,
        artist_id = $artistId
    `,
			{
				$name: issue.name,
				$issueNumber: issue.issueNumber,
				$publicationDate: issue.publicationDate,
				$artistId: issue.artistId,
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get(
						"SELECT * FROM Issue WHERE id = $id",
						{ $id: req.params.issueId },
						(err, issue) => {
							res.status(200).json({ issue: issue });
						}
					);
				}
			}
		);
	}
});

router.delete("/:issueId", (req, res, next) => {
	db.run(
		"DELETE FROM Issue WHERE id = $id",
		{ $id: req.params.issueId },
		function (err) {
			if (err) {
				next(err);
			} else {
				res.sendStatus(204);
			}
		}
	);
});

module.exports = router;
