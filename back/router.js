const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/quiz');
const verify = require('./connectionRouter').verify;

module.exports = router;

router
    .get("/", (req, res) => {
        res.json("Hello world!!");
    })

    .get('/quizz',
        (req, res) => {
            db.all(
                "select * from quizzes",
                (err, rows) => res.json(rows)
            );
    })
    .get('/quizz/:id',
        (req, res) => {
            db.get(
                "select * from quizzes where id=?",
                req.params.id,
                (err, row) => {
                    res.json(row)
                }
            );
        })
    .get('/question/:id',
        (req, res) => {
            db.all(
                "select * from questions where quizzes_id=?",
                req.params.id,
                (err, row) => {
                    res.json(row)
                }
            );
        })
    .get('/question/:id/:idquestion',
        (req, res) => {
            db.get(
                "select * from questions where quizzes_id=? AND id=? ",
                req.params.id,req.params.idquestion,
                (err, row) => {
                    res.json(row)
                }
            );
        })
    .get('/users',
        (req, res) => {
            db.all(
                "select * from users",
                (err, rows) => res.json(rows)
            );
        })
    .get('/users/:id',
        (req, res) => {
            db.get(
                "select * from users where id=?",
                req.params.id,
                (err, row) => {
                    res.json(row)
                }
            );
        })
    .get('/recherche/:searchtxt',
        (req, res) => {
            db.all(
                "select * from quizzes WHERE name LIKE ? OR keywords LIKE ?",
                "%" + req.params.searchtxt + "%","%" + req.params.searchtxt + "%",
                (err, row) => {
                    res.json(row)
                }
            );
        })
    .get('/answer/:id',
        (req, res) => {
            db.all(
                "select * from answers where questions_id=?",
                req.params.id,
                (err, row) => {
                    res.json(row)
                }
            );
        })

    .get('/soluce/:idquizz/:idquestion',
        (req, res) => {
            db.all(
                "select solution from answers where questions_id=? AND id=? ",
                req.params.idquizz,req.params.idquestion,
                (err, row) => {
                    res.json(row)
                }
            );
        })

    .post('/users',
        (req, res) => {
            if(req.body.password == req.body.passwordconfirm){
                console.log("good");
                db.run("insert into users(username,password,avatar,admin) values(?,?,?,?)", [req.body.username,req.body.password,req.body.avatar,'0']);
                res.redirect(303, '/');
            }
        })

    .patch('/users/:id',
        (req, res) => {
            db.run("update persons set username=? where id=?",[req.body,req.params.id]);
            res.status(200).json(req.body);
        })

    .use((req, res) => {
        res.status(400);
        res.json({
            error: "Bad request"
        });
    });