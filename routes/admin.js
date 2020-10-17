const express = require("express");
var bodyParser = require('body-parser');
const User = require("../models/user");

const router = express.Router();

const jsonParser = bodyParser.json()

router.get("/panel", (req, res) => {
    if (req.user && req.user.admin) {
        res.render('admin', { title: "panel" })
    } else {
        res.redirect("/users/login")
    }
})

router.post("/ban", jsonParser, (req, res) => {
    // check if the user is admin again
    // they shouldnt be able to get here if they are not, but lets be safe

    if (!req.user.admin) {
        res.sendStatus(403);
        return;
    }

    User.findOne({ username: req.body.username }).then((rUser) => {
        if (!rUser) {
            //user doesnt exist, do nothing
            res.sendStatus(404);
            return;
        }

        //ban user

        rUser.remove(err => {
            if (err) {
                res.status(400).send({ error: err });
                return;
            }
        });

        res.sendStatus(200);
    });
});

module.exports = router;
