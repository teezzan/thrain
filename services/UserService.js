var User = require("../models/User");
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

function randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function parseUser(userData) {
    var user = {
        fullname: userData.fullname,
        email: userData.email,
        username: userData.username,
        verified: userData.verified,
        ideas: userData.ideas,
        liked_ideas: userData.liked_ideas,
        comments: userData.comments,
    }
    return user;
}

exports.createUser = async (userObject) => {
    return new Promise((resolve, reject) => {

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const user = new User({
            fullname: userObject.fullname,
            email: userObject.email,
            username: userObject.username,
            password: hashedPassword
        });
        user.save((err, userData) => {
            if (err) {
                var response = {
                    success: "401",
                    message: "User Not Created"
                }
                reject(response);
            };
            var response = {
                success: "200",
                message: "User Created Successfully",
                user: parseUser(userData)
            }
            resolve(response);
        });
    });
};