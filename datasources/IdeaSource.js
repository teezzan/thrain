var { DataSource } = require('apollo-datasource')
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
        // console.log(config.context)

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

    async getAllIdea(page, pages) {
        console.log(page);
        
        var idea, response;
        try {
            idea = await Idea.find({}).limit(page);
            
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


    async createIdea(userObject, callback) {

        // console.log("userService Entered");
        // var hashedPassword = bcrypt.hashSync(userObject.password, 8);
        // var user, response;
        // try {
        //     user = await User.create({
        //         email: userObject.email,
        //         username: userObject.username,
        //         password: hashedPassword
        //     });
        //     response = {
        //         status: "200",
        //         message: "User Created Successfully",
        //         user: parseUser(user)
        //     }
        // }
        // catch (err) {
        //     console.log("error occurred", err);
        //     response = { status: "401", message: "User Not Created" };

        // }
        // console.log(response);
        // return response;

    }










}


module.exports = IdeaApi;

// return new Promise((resolve) => {

//     
// }