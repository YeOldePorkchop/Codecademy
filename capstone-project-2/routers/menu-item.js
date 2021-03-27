const express = require("express");
const router = express.Router({ mergeParams: true });

const sqlite = require("sqlite3");
const db = new sqlite.Database("./database.sqlite");

router.param("menuItemId", (req, res, next, id) => {
	db.get(
		`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`,
		(err, menuItem) => {
			if (err) {
				next(err);
			} else if (menuItem) {
				req.menuItem = menuItem;
				next();
			} else {
				res.sendStatus(404);
			}
		}
	);
});

router.get("/", (req, res, next) => {
	db.all(
		`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`,
		(err, menuItems) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({ menuItems: menuItems });
			}
		}
	);
});

router.post("/", (req, res, next) => {
	const name = req.body.menuItem.name,
		description = req.body.menuItem.description,
		inventory = req.body.menuItem.inventory,
		price = req.body.menuItem.price,
		menuId = req.params.menuId;

	if (!name || !inventory || !price) {
		return res.sendStatus(400);
	}

	const postSql = `INSERT INTO
    MenuItem(name, description, inventory, price, menu_id)
    VALUES($name, $description, $inventory, $price, $menuId)
  `;
	const postValues = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menuId: menuId,
	};

	db.run(postSql, postValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM MenuItem WHERE id = ${this.lastID}`,
				(err, menuItem) => {
					res.status(201).json({ menuItem: menuItem });
				}
			);
		}
	});
});

router.put("/:menuItemId", (req, res, next) => {
	const name = req.body.menuItem.name,
		description = req.body.menuItem.description,
		inventory = req.body.menuItem.inventory,
		price = req.body.menuItem.price,
		menuId = req.params.menuId;

	if (!name || !inventory || !price) {
		return res.sendStatus(400);
	}

	const putSql = `UPDATE MenuItem SET
    name = $name,
    description = $description,
    inventory = $inventory,
    price = $price,
    menu_id = $menuId
    WHERE id = ${req.params.menuItemId}
  `;

	const putValues = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menuId: menuId,
	};

	db.run(putSql, putValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`,
				(err, menuItem) => {
					res.status(200).json({ menuItem: menuItem });
				}
			);
		}
	});
});

router.delete("/:menuItemId", (req, res, next) => {
	db.get(
		`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`,
		(err, menuItem) => {
			if (err) {
				next(err);
			} else if (menuItem) {
				const deleteSql = `DELETE FROM MenuItem WHERE id = ${req.params.menuItemId}`;

				db.run(deleteSql, function (err) {
					res.sendStatus(204);
				});
			} else {
				res.sendStatus(404);
			}
		}
	);
});

module.exports = router;
