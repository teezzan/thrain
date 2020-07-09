var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file


var books = [{ title: "Legend of tomorrow", author: 1 },
{ title: "Who am I?", author: 2 },
{ title: "The One", author: 2 }]



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



class UserApi extends DataSource {
    constructor() {
        super();
        this.users = [
            {
                fullname: 'John',
                email: 'john@mail.com',
                password: 'john123',
                username: 'yoursite.net',
            }
        ];
        this.books = [{ title: "Legend of tomorrow", author: 1 },
        { title: "Who am I?", author: 2 },
        { title: "The One", author: 2 }]


    }

    async getUserbyUsername(username) {



        var user, response;
        try {
            user = await User.findOne({ username: username });
            response = user;
        }
        catch (err) {
            console.log("error occurred", err);
            response = {}

        }
        return response;

    }
    async createUser(userObject, callback) {

        console.log("userService Entered");
        var hashedPassword = bcrypt.hashSync(userObject.password, 8);
        var user, response;
        try {
            user = await User.create({
                email: userObject.email,
                username: userObject.username,
                password: hashedPassword
            });
            response = {
                status: "200",
                message: "User Created Successfully",
                user: parseUser(user)
            }
        }
        catch (err) {
            console.log("error occurred", err);
            response = { status: "401", message: "User Not Created" };

        }
        console.log(response);
        return response;

    }

    async getAllUser() {

        console.log("userService Entered");

        var user, response;
        try {
            user = await User.find({});
            response = user;
        }
        catch (err) {
            console.log("error occurred", err);
            response = []

        }
        return response;

    }
    async getUserbyId(id) {

        console.log("id", id);

        var user, response;
        try {
            user = await User.findOne({ _id: id });
            response = user;
        }
        catch (err) {
            console.log("error occurred", err);
            response = {}

        }
        return response;

    }
    async loginUser(userObject) {


        var user, response;
        try {
            user = await User.findOne({ username: userObject.username });
            var passwordIsValid = bcrypt.compareSync(userObject.password, user.password);
            if (!passwordIsValid) {
                response = {
                    status: "404",
                    message: "Wrong Password",
                }
            }
            else {
                var token = jwt.sign({ id: user._id, username: user.username }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                response = {
                    status: "200",
                    message: "Success",
                    user: parseUser(user),
                    token
                }
            }

        }
        catch (err) {
            console.log("error occurred", err);
            response = response = {
                status: "404",
                message: "Wrong Password"
            }

        }
        return response;

    }










}


module.exports = UserApi;

// return new Promise((resolve) => {

//     
// }