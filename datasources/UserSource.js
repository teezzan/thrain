var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var Idea = require("../models/Idea");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var configure = require('../config'); // get config file



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
    context = {};
    constructor() {
        super();

    }

    initialize(config) {
        this.context = config.context;
        this.userDetails = this.context.user;
        // console.log(config.context)

    }

    maskUser(user, userDetails) {
        var userOut = {
            username: user.username,
            ideas: user.ideas,
            fullname: user.fullname,
        }
        if (userDetails.auth) {
            userOut.verified = user.verified;
            userOut.liked_ideas = user.liked_ideas;
            userOut.email = user.email;
            userOut.comments = user.comments;
        }
        return userOut;
    }

    async getUserbyUsername(username) {


        // console.log("this.context", this.context)
        // if (this.userDetails.auth) {
        var user, response;
        try {
            user = await User.findOne({ username: username });

            response = {
                status: "200",
                user: this.maskUser(user, this.userDetails)
            }
        }
        catch (err) {
            console.log("error occurred", err.message);
            response = {
                status: "401",
                error: err.message
            }

        }
        return response;


    }


    async getAllUser() {

        console.log("userService Entered");

        var user, response;
        try {
            user = await User.find({});
            // response = user;
            response = {
                status: "200",
                message: "User Created Successfully",
                users: user
            }

        }
        catch (err) {
            console.log("error occurred", err);
            response = {
                status: "401",
                error: err.message
            }
        }
        return response;

    }
    async getUserbyId(id) {

        console.log("id", id);

        var user, response;
        try {
            user = await User.findOne({ _id: id });

            response = {
                status: "200",
                user: this.maskUser(user, this.userDetails)
            }
        }
        catch (err) {
            console.log("error occurred", err.message);
            response = {
                status: "401",
                error: err.message
            }

        }
        return response;

    }

    async getUserbyIdGen(id) {
        var user;
        var userOut
        try {
            user = await User.findOne({ _id: id });
            userOut = {
                username: user.username,
                fullname: user.fullname,
                // ideas: user.ideas,
                // comments: user.comments
            }
        }
        catch (err) {
            console.log("error occurred", err.message);

        }


        return userOut;

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
                var token = jwt.sign({ id: user._id, username: user.username }, configure.secret, {
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
                message: "Wrong Password",
                error: err.message
            }

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
            response = { status: "401", message: "User Not Created", error: err.message };

        }
        // console.log(response);
        return response;

    }










}


module.exports = UserApi;

// return new Promise((resolve) => {

//     
// }