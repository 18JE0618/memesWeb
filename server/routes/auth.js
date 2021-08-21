const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require('../middleware/requireLogin');

router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(422).json({ error: "please fill all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "user already exist with that email" });
            }
            bcrypt.hash(password, 12)   //used to encrypt the password
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })
})

router.post("/signin", (req, res) => {
    const { email, password } = req.body; // destructuring the req.body object
    if (!email || !password)    //statuscode 422: means server has understood the req but server can't process the req
    {
        res.status(422).json({ error: "please provide email and password both" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "invalid password or email" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "successfully signed in!" });
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email } = savedUser;
                        res.json({ token, user: { _id, name, email } });
                    }
                    else {
                        return res.status(422).json({ error: "invalid password or email" });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router