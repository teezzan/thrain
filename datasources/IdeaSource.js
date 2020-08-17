var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var Idea = require("../models/Idea");



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



class IdeaApi extends DataSource {
    context = {};
    constructor() {
        super();

    }

    initialize(config) {
        this.context = config.context;
        this.userDetails = this.context.user;

    }
    async checkIdValidity(userDetails) {
        var out = false;
        var date = Date.now() / 1000;
        if (userDetails.auth && date < userDetails.exp) {
            try {
                var user = await User.findOne({ _id: userDetails.id });
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
        var user = null;
        try {
            user = await User.findOne({ username: username });
        }
        catch (err) {
            console.log("err", err.message);

        }
        return user;
    }

    async getIdeabyId(id) {

        console.log("id", id);

        var idea, response;
        try {
            idea = await Idea.findOne({ _id: id });
            response = {
                status: "200",
                idea: idea
            }
        }
        catch (err) {
            console.log("error occurred", err);
            response = {
                status: "401",
                error: "Internal Error"
            }

        }
        return response;

    }
    async getIdeabyIdGen(id) {

        console.log("id", id);

        var idea;
        try {
            idea = await Idea.findOne({ _id: id });
        }
        catch (err) {
            console.log("error occurred", err);
        }
        return idea;

    }
    async getIdeasbyUsernameGen(username) {


        var user = await this.getUserbyUsername(username);
        var id = user._id;
        console.log("id", id);
        var idea;
        try {
            idea = await Idea.find({ author: id });
        }
        catch (err) {
            console.log("error occurred", err);
        }
        return idea;

    }
    async getLikedIdeasbyUsernameGen(username) {


        var user = await this.getUserbyUsername(username);
        var id = user._id;
        var idea;
        try {
            idea = await Idea.find({ _id: { $in: user.liked_ideas } });
        }
        catch (err) {
            console.log("error occurred", err);
        }
        return idea;

    }
    async getIdeabytag(tag) {


        var idea, response;
        try {
            idea = await Idea.find({ tags: { "$in": tag } });
            response = {
                status: "200",
                ideas: idea
            }
        }
        catch (err) {
            console.log("error occurred", err);
            response = {
                status: "401",
                error: "Internal Error"
            }

        }
        return response;

    }
    async getAllIdea(page, pages) {

        var idea, response;
        try {
            idea = await Idea.find({}).limit(page);

            response = {
                status: "200",
                ideas: idea
            }
        }
        catch (err) {
            console.log("error occurred", err);
            response = {
                status: "401",
                error: "Internal Error"
            }

        }
        console.log(response);
        return response;

    }


    async createIdea(userObject) {


        var idea, response;
        var tee = await this.checkIdValidity(this.userDetails)
        console.log(tee);
        if (tee) {
            console.log("true entered");

            try {
                idea = await Idea.create({
                    title: userObject.title,
                    description: userObject.description,
                    tags: userObject.tags,
                    author: this.userDetails.id
                });
                response = {
                    status: "200",
                    message: "IDEA Created Successfully",
                    idea: idea
                }
            }
            catch (err) {
                console.log("error occurred", err);
                response = { status: "401", message: "Idea Not Created", error: err.message };

            }
        }
        else {
            response = { status: "401", message: "Unauthorized" };
        }
        return response;

    }
}

module.exports = IdeaApi;
