const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../services/validation/register');
const validateLoginInput = require('../../services/validation/login');

const User = require('../../models/User');

router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email: "Email already exists"})
            }else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            throw err
                        }
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })

});

router.post('/login', (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) {
        res.status(400).json(errors);
    }

    const {email, password} = req.body;

    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(404).json({emailNotFound:'Email not found'})
            }

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if(isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name
                        };

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn:31556926},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                            }
                        )
                    }else {
                        res.status(400).json({passwordIncorrect: 'Incorrect Password'})
                    }
                })
        })

});

module.exports = router;