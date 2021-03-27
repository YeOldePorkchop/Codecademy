const express = require("express");
const router = express.Router({ mergeParams: true });

const sqlite = require("sqlite3");
const db = new sqlite.Database("./database.sqlite");

router.param("timesheetId", (req, res, next, id) => {
	db.get(`SELECT * FROM Timesheet WHERE id = ${id}`, (err, timesheet) => {
		if (err) {
			next(err);
		} else if (timesheet) {
			req.timesheet = timesheet;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

router.get("/", (req, res, next) => {
	db.all(
		`SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId}`,
		(err, timesheets) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({ timesheets: timesheets });
			}
		}
	);
});

router.post("/", (req, res, next) => {
	const hours = req.body.timesheet.hours,
		rate = req.body.timesheet.rate,
		date = req.body.timesheet.date,
		employeeId = req.params.employeeId;

	if (!hours || !rate || !date || !employeeId) {
		return res.sendStatus(400);
	}

	const postSql = `INSERT INTO
    Timesheet(hours, rate, date, employee_id)
    Values($hours, $rate, $date, $employeeId)
  `;

	const postValues = {
		$hours: hours,
		$rate: rate,
		$date: date,
		$employeeId: employeeId,
	};

	db.run(postSql, postValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM Timesheet WHERE id = ${this.lastID}`,
				(err, timesheet) => {
					res.status(201).json({ timesheet: timesheet });
				}
			);
		}
	});
});

router.put("/:timesheetId", (req, res, next) => {
	const hours = req.body.timesheet.hours,
		rate = req.body.timesheet.rate,
		date = req.body.timesheet.date,
		employeeId = req.params.employeeId;

	if (!hours || !rate || !date || !employeeId) {
		return res.sendStatus(400);
	}

	const putSql = `UPDATE Timesheet SET
    hours = $hours,
    rate = $rate,
    date = $date,
    employee_id = $employeeId
    WHERE id = ${req.params.timesheetId}
  `;

	const putValues = {
		$hours: hours,
		$rate: rate,
		$date: date,
		$employeeId: employeeId,
	};

	db.run(putSql, putValues, function (err) {
		if (err) {
			next(err);
		} else {
			db.get(
				`SELECT * FROM Timesheet WHERE id = ${req.params.timesheetId}`,
				(err, timesheet) => {
					res.status(200).json({ timesheet: timesheet });
				}
			);
		}
	});
});

router.delete("/:timesheetId", (req, res, next) => {
	const deleteSql = `DELETE FROM Timesheet WHERE id = ${req.params.timesheetId}`;

	db.run(deleteSql, function (err) {
		res.sendStatus(204);
	});
});

module.exports = router;
