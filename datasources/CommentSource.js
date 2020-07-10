var { DataSource } = require('apollo-datasource')
var User = require("../models/User");
var Comment = require("../models/Comment");
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



class CommentApi extends DataSource {
    context = {};
    constructor() {
        super();

    }

    initialize(config) {
        this.context = config.context;
        this.userDetails = this.context.user;
        // console.log(config.context)

    }
    async checkIdValidity(userDetails) {
        var out = false;
        var date = Date.now() / 1000;
        if (userDetails.auth /*&& date < userDetails.exp*/) {
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

    async getCommentbyId(id) {

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
    async getCommentsbyIdGen(id, page, pages) {

        console.log("id", id);

        var comments, idea;
        try {
            idea = await Idea.findOne({ _id: id });
            comments = await Comment.find({ _id: { $in: idea.comments } }).limit(page);

        }
        catch (err) {
            console.log("error occurred", err);
        }
        return comments;

    }
    async getCommentsbyUsernameGen(username) {

        // console.log("username", username);

        var comments, user;
        try {
            user = await User.findOne({ username: username });
            console.log("user comments ", user.comments);

            comments = await Comment.find({ _id: { $in: user.comments } });
            console.log(comments);
            

        }
        catch (err) {
            console.log("error occurred", err);
        }
        return comments;

    }


    async createComment(userObject) {


        var comment, idea, user, response;
        var tee = await this.checkIdValidity(this.userDetails)
        // console.log(tee);
        if (tee) {
            console.log("true entered");

            try {
                comment = await Comment.create({
                    text: userObject.text,
                    author: this.userDetails.id
                });

                

                //update user comments
                // console.log(this.userDetails);
                user = await User.findOneAndUpdate({ _id: this.userDetails.id }, { $push: { comments: comment._id } }, { new: true });
                // console.log(user);
                
                //find and update idea by id
                idea = await Idea.findOneAndUpdate({ _id: userObject.idea }, { $push: { comments: comment._id } }, { new: true });
                response = {
                    status: "200",
                    message: "Comment Created Successfully",
                    idea: idea
                }
            }
            catch (err) {
                console.log("error occurred", err);
                response = { status: "401", message: "Comment Not Created", error: err.message };

            }
        }
        else {
            response = { status: "401", message: "Unauthorized" };
        }
        // console.log(response);
        return response;

    }


    async createReplyComment(userObject) {


        var comment, reply, user, response;
        var tee = await this.checkIdValidity(this.userDetails)
        console.log(tee);
        if (tee) {
            console.log("true entered");

            try {
                reply = await Comment.create({
                    text: userObject.text,
                    author: this.userDetails.id
                });
                console.log(comment);

                //update user comments
                user = await User.findOneAndUpdate({ _id: this.userDetails._id }, { $push: { comments: reply._id } }, { new: true });

                //find and update idea by id
                comment = await Comment.findOneAndUpdate({ _id: userObject.id }, { $push: { replies: reply._id } }, { new: true });
                response = {
                    status: "200",
                    message: "Comment Reply Created Successfully",
                    comment: comment
                }
            }
            catch (err) {
                console.log("error occurred", err);
                response = { status: "401", message: "Comment  Reply Not Created", error: err.message };

            }
        }
        else {
            response = { status: "401", message: "Unauthorized" };
        }
        console.log(response);
        return response;

    }







}


module.exports = CommentApi;
