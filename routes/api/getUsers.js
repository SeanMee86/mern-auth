const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');

router.route('/getUsers')
    .get(passport.authenticate('jwt', {session: false}), (req, res) => {
        User.find({}, (err, docs) => {
            res.send(docs);
        })
    });

module.exports = router;