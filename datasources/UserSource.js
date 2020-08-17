var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var Idea = require("../models/Idea");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var configure = require('../config'); // get config file
var Utils = require("../models/Utils");



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

async function checkUsername(userObject, id, callback) {
    var response;
    // console.log(id);



    try {
        var user = await User.findOne({ username: userObject.username });

        response = {
            username: userObject.username,
            available: !!!user
        }

    }
    catch (err) {
        console.log("error occurred", err.message);
        response = {
            error: err.message
        }
    }
    callback(null, { response, receiverId: id });

}

async function saveAuthed(userObject, callback) {
    var response = false;



    try {
        var user = await User.findOne({ username: userObject.username });

        if (!!user) {
            var newauth = {
                socket_id: userObject.id, username: user.username, id: user._id
            }
            var util = await Utils.findOneAndUpdate({ server: configure.server }, { $push: { authed: newauth } }, { new: true });

            if (!!util) {
                response = true;
            }
        }


    }
    catch (err) {
        console.log("error occurred", err.message);
        response = false

    }
    callback(null, { auth: response, receiverId: userObject.id })

}

async function checkAuthed(socket_id, callback) {
    var response = false;
    var newauthed = [];



    try {
        var util = await Utils.findOne({ server: configure.server });
        if (!!util) {
            newauthed = util.authed.filter(c => c.socket_id === socket_id);

            if (newauthed.length !== 0) {
                response = true;
            }
        }


    }
    catch (err) {
        console.log("error occurred", err.message);
        response = false

    }
    if (response) {
        callback(null, { auth: response, receiverId: socket_id, _id: newauthed[0].id, username: newauthed[0].username });
    }
    else {
        callback(null, { auth: response, receiverId: socket_id, _id: null, username: null });
    }



}

async function popAuthed(socket_id, callback) {
    var response = false;
    console.log("popAuthed");



    try {

        var utils = await Utils.findOneAndUpdate({ server: configure.server }, { $pull: { authed: { socket_id: socket_id } } }, { new: true });
        if (!!utils) { response = true }

    }
    catch (err) {
        console.log("error occurred", err.message);
        response = false

    }

    callback(null, { auth: response, receiverId: socket_id });

}


class UserApi extends DataSource {
    context = {};
    constructor() {
        super();

    }

    initialize(config) {
        this.context = config.context;
        this.userDetails = this.context.user;
    }

    maskUser(user, userDetails) {
        var date = Date.now() / 1000;
        var userOut = {
            username: user.username,
            ideas: user.ideas,
            fullname: user.fullname,
        }
        if (userDetails.auth && date < userDetails.exp) {
            userOut.verified = user.verified;
            userOut.liked_ideas = user.liked_ideas;
            userOut.email = user.email;
            userOut.comments = user.comments;
        }
        return userOut;
    }

    async checkIdValidity(userDetails) {
        var out = false;
        var date = Date.now() / 1000;
        if (userDetails.auth && date < userDetails.exp) {
            try {
                var user = await User.findOne({ _id: userDetails.id });
                // console.log(user);
                if (user != null) {
                    out = true
                }

            }
            catch (err) {
                console.log("err", err.message);

                out = false;
            }

        }
        return out

    }
    async getUserbyUsername(username) {

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
                fullname: user.fullname
            }
        }
        catch (err) {
            console.log("error occurred", err.message);

        }


        return userOut;

    }

    async me() {


        var user, response;
        var tee = await this.checkIdValidity(this.userDetails)

        if (tee) {
            console.log("true entered");

            try {
                user = await User.findOne({ _id: this.userDetails.id });
                if (!!user) {
                    response = {
                        status: "200",
                        user: user
                    }
                } else {
                    response = {
                        status: "401",
                        message: "User not found"
                    }
                }
            }
            catch (err) {
                console.log("error occurred", err.message);
                response = {
                    status: "401",
                    error: err.message
                }

            }
        }
        else {
            response = { status: "401", message: "Unauthorized" };
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
            console.log("error occurred", err.message);
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
        return response;

    }

}


module.exports = { UserApi, checkUsername, saveAuthed, checkAuthed, popAuthed }