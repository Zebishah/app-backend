require('dotenv').config();
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { query, validationResult, body } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
let jwt_secret = process.env.JWT_SECRET;

let success = null;
let e_success = true;
router.post(
      "/signUp",
      [
            body("name", "Please enter a valid name").isLength({ max: 14 }),
            body("Email", "Please enter a valid Email").isEmail(),
            body("Password", "Password must be less than 6 chracters").isLength({
                  max: 6,
            }),
      ],

      async (req, res) => {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                  return res.status(400).json({ errors: result.array() });
            } else {
                  try {
                        let user = await User.findOne({ Email: req.body.Email }).maxTimeMS(20000);;
                        if (user) {

                              res.status(400).send({ success: false, error: "User with that email already exsist..." });

                        }
                        else {
                              success = true;
                        }

                        var salt = bcrypt.genSaltSync(10);
                        var password = bcrypt.hashSync(req.body.Password, salt);
                        user = await User.create({
                              name: req.body.name,
                              Email: req.body.Email,
                              Password: password,
                        });
                        const data = {
                              users: {
                                    id: user.id,
                              },
                        }
                        if (success === true) {
                              var auth_token = jwt.sign(data, jwt_secret);
                              res.json({ "Success": success, "Your login token": auth_token });
                        }
                  } catch (error) {
                        console.log("Here is error occured in adding data" + error);

                        res.status(500).send("Code have some issues in inserting data part.....");

                  }
            }
      }
);
router.post(
      "/signIn",
      [

            body("Email", "Please enter a valid Email").isEmail(),
            body("Password", "Password must not be blank").exists(),
      ],

      async (req, res) => {

            const result = validationResult(req);

            if (!result.isEmpty()) {
                  return res.status(400).json({ errors: result.array() });
            } else {
                  try {
                        let success = null;
                        let p_success = null;
                        let e_success = null;
                        let { Email, Password } = req.body;
                        let user = await User.findOne({ Email: Email }).maxTimeMS(20000);;

                        if (!user) {
                              console.log("!user")
                              return res.status(400).send({ success: false, error: "Please Enter a Valid credentials..." });
                        }
                        else {
                              console.log("going to comparePassword")
                        }

                        var comparePassword = await bcrypt.compare(Password, user.Password);

                        if (!comparePassword) {
                              console.log("!comp_password")
                              return res.status(400).send({ p_success: false, error: "Please Enter a Valid credentials..." });
                        }
                        else {
                              p_success = true;
                        }


                        const data = {
                              users: {
                                    id: user.id,
                              },
                        };

                        if (p_success === true) {
                              console.log("jwt")
                              success = true;
                              var auth_token = jwt.sign(data, jwt_secret);
                              return res.json({ "Success": success, "your_login_token": auth_token });
                        }

                  } catch (error) {
                        console.log("Here is error occured in signing_In" + error);

                        return res.status(500).send("Code have some issues in Sign-In part.....");

                  }
            }
      }
);


router.get(
      "/fetchUser",

      async (req, res) => {

            try {


                  console.log("hye")
                  let user = await User.find().maxTimeMS(20000);;
                  res.send(user);

            } catch (error) {
                  console.log("Here is error occured in fetching user" + error);

                  res.status(500).send("Code have some issues in fetching user part.....");

            }
      }
);
module.exports = router;
