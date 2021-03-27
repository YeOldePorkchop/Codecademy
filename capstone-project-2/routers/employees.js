const express = require("express");
const router = express.Router();

const sqlite = require("sqlite3");
const db = new sqlite.Database("./database.sqlite");

router.param("employeeId", (req, res, next, employeeId) => {
	const sql = "SELECT * FROM Employee WHERE id = $employeeId";
	const values = { $employeeId: employeeId };

	db.get(sql, values, (err, employee) => {
		if (err) {
			next(err);
		} else if (employee) {
			req.employee = employee;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

router.get("/", (req, res, next) => {
	const sql = "SELECT * FROM Employee WHERE is_current_employee = 1";

	db.all(sql, (err, employees) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ employees: employees });
		}
	});
});

router.post("/", (req, res, next) => {
	const name = req.body.employee.name,
		position = req.body.employee.position,
		wage = req.body.employee.wage,
		isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

	if (!name || !position || !wage) {
		return res.sendStatus(400);
	}

	const postSql = `INSERT INTO
      Employee(name, position, wage, is_current_employee)
      VALUES ($name, $position, $wage, $isCurrentEmployee)
    `;

	const postValues = {
		$name: name,
		$position: position,
		$wage: wage,
		$isCurrentEmployee: isCurrentEmployee,
	};

	db.run(postSql, postValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM Employee WHERE id = ${this.lastID} `,
				(err, employee) => {
					res.status(201).json({ employee: employee });
				}
			);
		}
	});
});

router.get("/:employeeId", (req, res, next) => {
	res.status(200).json({ employee: req.employee });
});

router.put("/:employeeId", (req, res, next) => {
	const name = req.body.employee.name,
		position = req.body.employee.position,
		wage = req.body.employee.wage,
		isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

	if (!name || !position || !wage) {
		return res.sendStatus(400);
	}

	const putSql = `UPDATE Employee SET 
      name = $name, 
      position = $position, 
      wage = $wage, 
      is_current_employee = $isCurrentEmployee 
    WHERE id = $employeeId`;

	const putValues = {
		$name: name,
		$position: position,
		$wage: wage,
		$isCurrentEmployee: isCurrentEmployee,
		$employeeId: req.params.employeeId,
	};

	const getSql = `SELECT * FROM Employee WHERE id = ${req.params.employeeId}`;

	db.run(putSql, putValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(getSql, (err, employee) => {
				if (err) {
					next(err);
				} else {
					res.status(200).json({ employee: employee });
				}
			});
		}
	});
});

router.delete("/:employeeId", (req, res, next) => {
	const putSql = `UPDATE Employee SET is_current_employee = 0 WHERE id = ${req.params.employeeId}`;

	db.run(putSql, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`,
				(err, employee) => {
					res.status(200).json({ employee: employee });
				}
			);
		}
	});
});

const timesheetRouter = require("./timesheet");
router.use("/:employeeId/timesheets", timesheetRouter);

module.exports = router;
