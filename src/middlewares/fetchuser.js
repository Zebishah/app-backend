require('dotenv').config();
var jwt = require("jsonwebtoken");

let jwt_secret = process.env.JWT_SECRET;

let fetchUser = (req, res, next) => {

    try {
        // let auth_token=req.body.auth_token; its for sending token in body 
        let auth_token = req.header("auth-token");
        if (!auth_token) {
            res.status(400).send({ error: "invalid auth-token" });
        }
        else {
            let data = jwt.verify(auth_token, jwt_secret);
            console.log(data);
            users = data.users;

            next();
        }


    } catch (error) {
        console.log("Here is error occured in fetching user" + error);

        res.status(500).send("Code have some issues in fetching user part.....");

    }

}

module.exports = fetchUser;