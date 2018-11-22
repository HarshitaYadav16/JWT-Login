const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require("path");
const jwt = require('jsonwebtoken');


//POST route for updating data
router.post('/register',  (req, res, next)=> {

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
		email : userData.email,
		username: userData.user_name
	};
	const token = jwt.sign({user}, 'my_secret_key');
	res.json({
			token:token
		});
	
    User.create(userData,  (error, user)=> {
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




module.exports = router;