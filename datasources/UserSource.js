var  { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');


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

    getUser(user) {
        console.log(user);
        return this.books;
    }

    async createUser(userObject) {

        console.log("userService Entered");
        var hashedPassword = bcrypt.hashSync(userObject.password, 8);

        User.create({
            email: userObject.email,
            username: userObject.username,
            password: hashedPassword
        }, (err, userData) => {
            if (err) return { status: "401", message: "User Not Created" };
            var response = {
                status: "200",
                message: "User Created Successfully",
                user: parseUser(userData)
            }
            console.log("response", response);
            return response
        });
        return {
            status: '200',
            message: 'User Created Successfully',
            user: {
              fullname: '',
              email: 'ad',
              username: '1q1dddw',
              verified: false,
              ideas: [],
              liked_ideas: [],
              comments: []
            }
          }
    }












}


module.exports = UserApi;

// return new Promise((resolve) => {

//     
// }