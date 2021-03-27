const express = require("express");
const router = express.Router();

const sqlite = require("sqlite3");
const db = new sqlite.Database("./database.sqlite");

router.param("menuId", (req, res, next, menuId) => {
	db.get(`SELECT * FROM Menu WHERE id = ${menuId}`, (err, menu) => {
		if (err) {
			next(err);
		} else if (menu) {
			req.menu = menu;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

router.get("/", (req, res, next) => {
	db.all("SELECT * FROM Menu", (err, menus) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ menus: menus });
		}
	});
});

router.post("/", (req, res, next) => {
	const title = req.body.menu.title;

	if (!title) {
		res.sendStatus(400);
	}

	const postSql = "INSERT INTO Menu(title) VALUES ($title)";
	const postValues = {
		$title: title,
	};

	db.run(postSql, postValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
				res.status(201).json({ menu: menu });
			});
		}
	});
});

router.get("/:menuId", (req, res, next) => {
	res.status(200).json({ menu: req.menu });
});

router.put("/:menuId", (req, res, next) => {
	const title = req.body.menu.title;

	if (!title) {
		return res.sendStatus(400);
	}

	const putSql = `UPDATE Menu SET title = $title WHERE id = ${req.params.menuId}`;
	const putValues = {
		$title: title,
	};

	db.run(putSql, putValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM Menu WHERE id = ${req.params.menuId}`,
				(err, menu) => {
					res.status(200).json({ menu: menu });
				}
			);
		}
	});
});

router.delete("/:menuId", (req, res, next) => {
	db.get(
		`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`,
		(err, menuItem) => {
			if (err) {
				next(err);
			} else if (menuItem) {
				res.sendStatus(400);
			} else {
				const deleteSql = `DELETE FROM Menu WHERE id = ${req.params.menuId}`;

				db.run(deleteSql, function (err) {
					res.sendStatus(204);
				});
			}
		}
	);
});

const menuItemRouter = require("./menu-item");
router.use("/:menuId/menu-items", menuItemRouter);

module.exports = router;
