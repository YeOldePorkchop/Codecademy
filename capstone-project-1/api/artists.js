const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");
const express = require("express");
const router = express.Router();

router.param("artistId", (req, res, next, artistId) => {
	db.get(
		"SELECT * FROM Artist WHERE id = $artistId",
		{ $artistId: artistId },
		(err, artist) => {
			if (err) {
				next(err);
			} else if (artist) {
				req.artist = artist;
				next();
			} else {
				res.sendStatus(404);
			}
		}
	);
});

router.get("/", (req, res, next) => {
	db.all(
		"SELECT * FROM Artist WHERE is_currently_employed = 1",
		(err, rows) => {
			if (err) {
				//return res.status(404).send();
				next(err);
			} else {
				res.status(200).json({ artists: rows });
			}
		}
	);
});

router.post("/", (req, res, next) => {
	const artist = req.body.artist;

	if (!artist.name || !artist.dateOfBirth || !artist.biography) {
		return res.sendStatus(400);
	} else {
		const isCurrentlyEmployed = artist.is_currently_employed === 0 ? 0 : 1;

		db.run(
			`
      INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)
      VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)`,
			{
				$name: artist.name,
				$dateOfBirth: artist.dateOfBirth,
				$biography: artist.biography,
				$isCurrentlyEmployed: isCurrentlyEmployed,
			},
			function (err) {
				if (err) {
					next(err);
				} else {
					db.get(
						"SELECT * FROM Artist WHERE id = $artistId",
						{ $artistId: this.lastID },
						(err, artist) => {
							if (err) {
								next(err);
							} else {
								res.status(201).json({ artist: artist });
							}
						}
					);
				}
			}
		);
	}
});

router.get("/:artistId", (req, res, next) => {
	res.status(200).json({ artist: req.artist });
});

router.put("/:artistId", (req, res, next) => {
	const artist = req.body.artist;

	if (!artist.name || !artist.dateOfBirth || !artist.biography) {
		return res.sendStatus(400);
	} else {
		db.run(
			`
      UPDATE Artist
      SET 
        name = $name,
        date_of_birth = $dateOfBirth,
        biography = $biography,
        is_currently_employed = $isCurrentlyEmployed
      WHERE id = $artistId
    `,
			{
				$name: artist.name,
				$dateOfBirth: artist.dateOfBirth,
				$biography: artist.biography,
				$isCurrentlyEmployed: artist.isCurrentlyEmployed,
				$artistId: req.params.artistId,
			},
			function (error) {
				if (error) {
					next(error);
				} else {
					db.get(
						"SELECT * FROM Artist WHERE id = $artistId",
						{ $artistId: req.params.artistId },
						(error, artist) => {
							res.status(200).json({ artist: artist });
						}
					);
				}
			}
		);
	}
});

router.delete("/:artistId", (req, res, next) => {
	db.run(
		` UPDATE Artist SET is_currently_employed = 0 WHERE id = $artistId`,
		{ $artistId: req.params.artistId },
		function (error) {
			if (error) {
				next(error);
			} else {
				db.get(
					"SELECT * FROM Artist WHERE id = $artistId",
					{ $artistId: req.params.artistId },
					(error, artist) => {
						res.status(200).json({ artist: artist });
					}
				);
			}
		}
	);
});

module.exports = router;
