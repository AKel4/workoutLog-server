const router = require('express').Router();
const { UserModel } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//!REGISTER:
router.post('/register', async (req, res) => {
    let { username, password } = req.body.user;
    try {
    const User = await UserModel.create({
        username,
        password: bcrypt.hashSync(password, 13) ,
    });

    let token = jwt.sign({id: User.id, username: User.username}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        user: User,
        message: "User successfully registered",
        sessionToken: token
    });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
      } else {
        res.status(500).json({
            message: "Failed to register new user",
        });
      }
    }
});

// !LOGIN:

router.post('/login', async (req, res) => {
    let { username, password } = req.body.user;

    try{
    let loginUser = await UserModel.findOne({
    where: {
        username: username,
    },
  });

    if (loginUser) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        let passwordComparison = await bcrypt.compare(password, loginUser.password);
        if (passwordComparison) {
            
        res.status(200).json({
        user: loginUser,
        message: "User succesfully logged in!",
        sessionToken: token
    });
    } else {
        res.status(401).json({
            message: "Incorrect username or password"
        });
    }
 } else {
      res.status(401).json({
          message: "Incorrect username or password"
      });
 }
 } catch (err) {
    res.status(500).json({
        message: "Failed to log user in"
     })
 }
});

module.exports = router;

