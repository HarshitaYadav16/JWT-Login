const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require("path");
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');

//POST route for new user registration
router.post('/register', (req, res, next) => {

    if (req.body.user_name &&
        req.body.user_id &&
        req.body.email &&
        req.body.password) {

        const userData = {
            user_name: req.body.user_name,
            user_id: req.body.user_id,
            email: req.body.email,
            password: req.body.password
        }

        const user = {
            email: userData.email,
            username: userData.user_name
        };
        const token = jwt.sign({
            user
        }, 'my_secret_key');
        res.json({
            token: token
        });

        User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
            }
        });

    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})


//GET route to get all users
router.get('/getUsers', ensureToken, (req, res) => {
    User.find((err, data) => {
        if (err) res.send(err);
        else res.json(data);
    });
});


//GET route to get user according to ID
router.get('/getUserById/:id', ensureToken, (req, res) => {
    User.findOne({
        _id: req.params.id
    }, (err, data) => {
        if (err) res.send(err);
        else res.json(data);
    });
});

//PUT route to update user according to ID
router.put('/updateUser/:id', ensureToken, function(req, res) {
    User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                user_name: req.body.user_name,
                user_id: req.body.user_id,
                email: req.body.email,
                password: req.body.password
            }
        }, {
            upsert: true
        },
        function(err, data) {
            if (err) res.send(err);
            else {
                console.log(data);
                res.json(data);
            }
        }
    );
});

//DELETE route to delete user according to ID
router.delete('/deleteUser/:id', ensureToken, function(req, res) {
    User.findOneAndRemove({
        _id: req.params.id
    }, function(err, data) {
        if (err) res.send(err);
        else {
            console.log(data);
            res.json(data);
        }
    });
});




module.exports = router;