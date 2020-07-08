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
    // return new Promise((resolve, reject) => {
    
    // });
};